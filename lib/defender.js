// Pure side of defender: normalisation and formatting, testable without Windows.
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
      threats: (raw.threats || []).map((t) => ({ time: String(t.time ?? ""), name: String(t.name ?? ""), action: String(t.action ?? "") })),
      exclusions: raw.exclusions ? {
        paths: (raw.exclusions.paths || []).map(String),
        extensions: (raw.exclusions.extensions || []).map(String),
        processes: (raw.exclusions.processes || []).map(String),
      } : null,
    }))(raw ?? {});
}

// Dispatch on the shape of the result rather than making the caller say which
// formatter to use: a result carries either `detail`, or `subkeys`, or neither.
export function format(v) {
  const withOk = { ok: true, ...v };
  if (withOk.detail && typeof formatDetail === "function") return formatDetail(withOk);
  if (withOk.subkeys && typeof formatKeys === "function") return formatKeys(withOk);
  return ((v) => {
      const l = [`win_defender ok=${v.ok}`];
      if (v.antivirus) {
        l.push(`  real-time protection: ${v.antivirus.realTime ? "on" : "OFF"}`);
        l.push(`  signatures: ${v.antivirus.sigVersion} (${v.antivirus.sigAge} days old)`);
        l.push(`  last quick scan: ${v.antivirus.quickScanAge === 0 ? "today" : v.antivirus.quickScanAge + " days ago"}`);
      } else l.push("  antivirus: unavailable (Get-MpComputerStatus failed)");
      if (v.tamperProtected !== null) l.push(`  tamper protection: ${v.tamperProtected ? "on" : "off"}`);
      for (const f of v.firewall || []) l.push(`  firewall ${f.profile}: ${f.enabled ? "on" : "OFF"}`);
      if ((v.threats ?? []).length) {
        l.push(`  recent detections: ${v.threats.length}`);
        for (const t of v.threats) l.push(`    ${t.time.slice(0, 19)} threat ${t.name} action-ok=${t.action}`);
      } else l.push("  recent detections: none");
      if (v.exclusions) {
        const x = v.exclusions;
        l.push(`  exclusions: ${x.paths.length + x.extensions.length + x.processes.length}`);
        for (const p of x.paths) l.push(`    path ${p}`);
        for (const e of x.extensions) l.push(`    ext  ${e}`);
        for (const p of x.processes) l.push(`    proc ${p}`);
      }
      if (v.error) l.push(`error: ${v.error}`);
      return l.join("\n");
    })(withOk);
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
