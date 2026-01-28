/**
 * Web Speech API hook for voice-to-text input.
 *
 * Uses the browser's SpeechRecognition API (with webkit prefix fallback)
 * to capture spoken input and convert it to text. Provides:
 *  - Continuous recognition with interim results
 *  - Start/stop/reset controls
 *  - Browser support detection
 *
 * The transcript populates the chat input textarea, allowing users to
 * review before sending.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Web Speech API type declarations (not yet in TypeScript's DOM lib)
declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly results: SpeechRecognitionResultList;
    readonly resultIndex: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  // biome-ignore lint/style/noVar: ambient global declarations require var
  var SpeechRecognition: {
    new (): SpeechRecognition;
    prototype: SpeechRecognition;
  };

  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export interface UseVoiceInputReturn {
  /** Final (committed) transcript text. */
  transcript: string;
  /** In-progress transcript that may change as the user speaks. */
  interimTranscript: string;
  /** Whether the microphone is actively listening. */
  isListening: boolean;
  /** Whether the Web Speech API is available in this browser. */
  isSupported: boolean;
  /** Start listening for voice input. */
  start: () => void;
  /** Stop listening and finalize the transcript. */
  stop: () => void;
  /** Clear the transcript state. */
  reset: () => void;
}

function getSpeechRecognitionConstructor():
  | typeof SpeechRecognition
  | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

export function useVoiceInput(): UseVoiceInputReturn {
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // Synchronous guard — prevents double-start race between browser API and React state batching
  const isListeningRef = useRef(false);

  const isSupported = useMemo(
    () => getSpeechRecognitionConstructor() !== undefined,
    [],
  );

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionConstructor();
    if (!Ctor || isListeningRef.current) return;

    isListeningRef.current = true;
    setIsListening(true);

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      setTranscript(finalText);
      setInterimTranscript(interimText);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // "aborted" fires when we call stop(); "no-speech" fires when user doesn't speak
      if (event.error !== "aborted" && event.error !== "no-speech") {
        // biome-ignore lint/suspicious/noConsole: voice error logging
        console.warn("[Voice] Recognition error:", event.error);
      }
      isListeningRef.current = false;
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (error) {
      // start() throws if mic permissions are denied at OS level
      // biome-ignore lint/suspicious/noConsole: voice error logging
      console.warn("[Voice] Failed to start recognition:", error);
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    isListeningRef.current = false;
    setIsListening(false);
    setInterimTranscript("");
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    start,
    stop,
    reset,
  };
}
