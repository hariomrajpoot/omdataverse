"use client";

import { useEffect } from "react";

export function DebugHydrationProbe() {
  useEffect(() => {
    const bodyAttrNames = (() => {
      try {
        return document.body.getAttributeNames();
      } catch {
        return [];
      }
    })();

    const cz = document.body.getAttribute("cz-shortcut-listen");

    // #region agent log
    fetch("http://127.0.0.1:7330/ingest/c0c88dee-b2fb-41bc-b468-aec6c2f47154", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "dca985" },
      body: JSON.stringify({
        sessionId: "dca985",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "components/DebugHydrationProbe.tsx:18",
        message: "Hydration probe: body attributes snapshot",
        data: {
          hasCzShortcutListen: cz != null,
          czShortcutListenValue: cz,
          bodyAttributeNames: bodyAttrNames,
          htmlClass: document.documentElement.className,
          bodyClass: document.body.className,
          userAgent: navigator.userAgent,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, []);

  return null;
}
