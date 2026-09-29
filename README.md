# dsh-wsl-defender

DeepSeek Harness plugin: Windows security posture from WSL: Defender antivirus status and firewall profile state.

Part of **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)**.

[中文说明 → README.zh.md](./README.zh.md)

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-defender
```

## Usage

```
win_defender          # antivirus + firewall posture
```

## Notes

Uses `Get-MpComputerStatus` and `Get-NetFirewallProfile`. If Defender is
managed by a third party, or the cmdlets are unavailable, the antivirus section reports
unavailable rather than guessing.

## Requirements

- Windows with WSL, and DeepSeek Harness running inside it.

## Tests

```sh
npm test
```

The unit tests run anywhere. The live tests are skipped outside WSL.

## Compatibility

| Field | Value |
|-------|-------|
| **Plugin** | `dsh-wsl-defender` **0.1.0** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.0-rc.2`**) — single source of truth for the suite |
| **Kit set** | `full` or install alone |

## License

MIT
