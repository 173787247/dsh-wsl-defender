import { runPowerShell } from "./wsl-host.js";
import { normalize } from "./defender.js";

/** The kit's one escaping rule: single-quote the value, doubling any apostrophe. */
function esc(s) {
  return "'" + String(s ?? "").replace(/'/g, "''") + "'";
}

function clamp(v, min, max, fallback) {
  const n = Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * The script is built here, at the call site, the way every other plugin in the
 * kit does it: the PowerShell is written inline and the values are escaped as
 * they are interpolated. An earlier version of this file used a @@TOKEN@@
 * substitution table instead, which needed a template literal that ate the
 * backslashes in a regex and quoted every token twice.
 */
export function script(a) {
  return (() => `
$av = $null
try { $av = Get-MpComputerStatus -ErrorAction Stop } catch {}
$fw = @()
try { $fw = Get-NetFirewallProfile -ErrorAction Stop | ForEach-Object { @{ profile = $_.Name; enabled = [bool]$_.Enabled } } } catch {}
$threats = @()
try {
  $threats = @(Get-MpThreatDetection -ErrorAction Stop | Select-Object -First 10 | ForEach-Object {
    @{ time = $_.InitialDetectionTime.ToString('o'); name = "$($_.ThreatID)"; action = "$($_.ActionSuccess)" }
  })
} catch {}
$excl = $null
try {
  $p = Get-MpPreference -ErrorAction Stop
  $excl = @{
    paths = @($p.ExclusionPath | Where-Object { $_ } | Select-Object -First 20)
    extensions = @($p.ExclusionExtension | Where-Object { $_ } | Select-Object -First 20)
    processes = @($p.ExclusionProcess | Where-Object { $_ } | Select-Object -First 20)
  }
} catch {}
$out = @{ firewall = @($fw); threats = @($threats) }
if ($av) {
  $out.antivirus = @{
    realTime = [bool]$av.RealTimeProtectionEnabled
    sigAge = [int]$av.AntivirusSignatureAge
    sigVersion = "$($av.AntivirusSignatureVersion)"
    quickScanAge = [int]$av.QuickScanAge
  }
  $out.tamperProtected = [bool]$av.IsTamperProtected
}
if ($excl) { $out.exclusions = $excl }
ConvertTo-Json -Compress -Depth 5 $out`)(a);
}

export async function execute(args, config = {}) {
  const a = {
    name: typeof args?.name === "string" ? args.name : "",
    state: typeof args?.state === "string" ? args.state : "",
    log: typeof args?.log === "string" ? args.log : "System",
    path: typeof args?.path === "string" ? args.path : "",
    provider: typeof args?.provider === "string" ? args.provider : "",
    level: clamp(args?.level, 1, 5, 2),
    count: clamp(args?.count, 1, 200, 20),
    limit: clamp(args?.limit, 1, 400, 40),
    top: clamp(args?.top, 1, 40, 8),
    detail: Boolean(args?.detail),
    subkeys: Boolean(args?.subkeys),
    all: Boolean(args?.all),
    full: Boolean(args?.full),
    since: null,
  };



  const timeoutMs = clamp(config.timeoutMs, 1000, 120000, 30000);
  const { stdout } = await runPowerShell(script(a), { timeoutMs });
  const raw = JSON.parse(stdout.trim() || "{}");
  if (raw.error) return { ok: false, error: String(raw.error) };
  return { ok: true, ...normalize(raw) };
}
