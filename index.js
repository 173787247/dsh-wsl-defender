import { detectWsl } from "./lib/wsl-host.js";
import * as core from "./lib/defender.js";
import { execute } from "./lib/defender-exec.js";

export const name = "dsh-wsl-defender";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const wsl = detectWsl();

  ctx.systemPrompt.section({
    name: "tool:win_defender",
    order: 218,
    text: "Use win_defender for WSL/Windows interop: Windows security posture from WSL: Defender antivirus status and firewall profile state.",
  });

  ctx.tools.register({
    name: "win_defender",
    description: "Windows security posture from WSL: Defender antivirus status and firewall profile state.",
    parameters: core.parameters(),
    output: {
      schema: core.outputSchema(),
      render: (_args, value) => [{ type: "text", text: core.format(value) }],
    },
    timeoutMs: Number(config.timeoutMs) > 0 ? Number(config.timeoutMs) : 30_000,
    isConcurrencySafe: () => true,
    async execute(args) {
      if (!wsl) return { ok: false, error: "not running in WSL" };
      try {
        return await execute(args, config);
      } catch (error) {
        return { ok: false, error: String(error?.message ?? error) };
      }
    },
    presentCall: () => ({ card: "generic", title: "win_defender" }),
    presentResult: (_args, result) => ({ card: "generic", title: "win_defender", content: result?.content }),
  });
}
