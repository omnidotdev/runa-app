import { getHintUtils } from "@epic-web/client-hints";
import {
  clientHint as colorSchemeHint,
  subscribeToSchemeChange,
} from "@epic-web/client-hints/color-scheme";
import { clientHint as timeZoneHint } from "@epic-web/client-hints/time-zone";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const { getHints, getClientHintCheckScript } = getHintUtils({
  theme: colorSchemeHint,
  timezone: timeZoneHint,
});

const ClientHintCheck = () => {
  const router = useRouter();

  useEffect(() => {
    subscribeToSchemeChange(() => router.invalidate());
  }, [router]);

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: used for theme switch script
      dangerouslySetInnerHTML={{ __html: getClientHintCheckScript() }}
    />
  );
};

export default ClientHintCheck;
