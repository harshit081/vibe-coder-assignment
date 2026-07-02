import type { SelectedProfile } from "@/types";

function rosterFilename(ext: "txt" | "json") {
  const date = new Date().toISOString().slice(0, 10);
  return `campaign-roster-${date}.${ext}`;
}

function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function buildRosterTextExport(profiles: SelectedProfile[]): string {
  const lines = [
    "CAMPAIGN ROSTER",
    `Total: ${profiles.length}`,
    `Exported: ${new Date().toLocaleString()}`,
    "",
  ];

  profiles.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.profile.fullname} (@${item.profile.username}) — ${item.platform}`
    );
  });

  return lines.join("\n");
}

export function buildRosterJsonExport(profiles: SelectedProfile[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      count: profiles.length,
      roster: profiles,
    },
    null,
    2
  );
}

export function downloadRosterText(profiles: SelectedProfile[]) {
  triggerDownload(
    buildRosterTextExport(profiles),
    rosterFilename("txt"),
    "text/plain;charset=utf-8"
  );
}

export function downloadRosterJson(profiles: SelectedProfile[]) {
  triggerDownload(
    buildRosterJsonExport(profiles),
    rosterFilename("json"),
    "application/json;charset=utf-8"
  );
}
