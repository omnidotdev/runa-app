import { useEffect, useState } from "react";

/**
 * Whether the component has mounted on the client.
 *
 * Returns `false` during server render and the first client render (so the two
 * match and hydration is stable), then `true` after mount. Use it to defer
 * rendering that depends on the viewer's time zone or other browser-only state,
 * which the server cannot know and would otherwise render differently.
 */
const useMounted = (): boolean => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

export default useMounted;
