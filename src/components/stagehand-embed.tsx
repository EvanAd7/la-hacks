"use client";

import { runStagehand } from "@/app/stagehand/main";

export function StagehandEmbed() {
  return (
    <div>
      <button onClick={runStagehand}>Start Session</button>
    </div>
  );
}