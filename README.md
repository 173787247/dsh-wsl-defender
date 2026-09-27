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

## License

MIT
