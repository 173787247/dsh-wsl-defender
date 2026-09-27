// Pure side of dsh-wsl-defender: normalisation and formatting, testable without Windows.
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }

export function normalize(raw) {
  return ((raw) => ({
      antivirus: raw.antivirus ? {
        realTime: Boolean(raw.antivirus.realTime),
        sigAge: num(raw.antivirus.sigAge),
        sigVersion: String(raw.antivirus.sigVersion ?? ""),
        quickScanAge: num(raw.antivirus.quickScanAge),
      } : null,
      tamperProtected: raw.tamperProtected === undefined ? null : Boolean(raw.tamperProtected),
      firewall: (raw.firewall || []).map((f) => ({ profile: String(f.profile ?? ""), enabled: Boolean(f.enabled) })),
    }))(raw ?? {});
}

export function format(v) {
  return ((v) => {
      const l = [`win_defender ok=${v.ok}`];
      if (v.antivirus) {
        l.push(`  real-time protection: ${v.antivirus.realTime ? "on" : "OFF"}`);
        l.push(`  signatures: ${v.antivirus.sigVersion} (${v.antivirus.sigAge} days old)`);
        l.push(`  last quick scan: ${v.antivirus.quickScanAge === 0 ? "today" : v.antivirus.quickScanAge + " days ago"}`);
      } else l.push("  antivirus: unavailable (Get-MpComputerStatus failed)");
      if (v.tamperProtected !== null) l.push(`  tamper protection: ${v.tamperProtected ? "on" : "off"}`);
      for (const f of v.firewall || []) l.push(`  firewall ${f.profile}: ${f.enabled ? "on" : "OFF"}`);
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })({ ok: true, ...v });
}

export function parameters() {
  return {
  "type": "object",
  "additionalProperties": false,
  "properties": {}
};
}

export function outputSchema() {
  return { type: "object", additionalProperties: true };
}
