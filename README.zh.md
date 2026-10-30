# dsh-wsl-defender

> 从 WSL 读取 Windows 安全状态：Defender 防病毒状态与防火墙各配置文件状态。

DeepSeek Harness 插件：Windows security posture from WSL: Defender antivirus status and firewall profile state.

属于 **[dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit)** 的一部分。

[English → README.md](./README.md)

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-defender
```

## 用法

```
win_defender          # antivirus + firewall posture
```

## 说明

Uses `Get-MpComputerStatus` and `Get-NetFirewallProfile`. If Defender is
managed by a third party, or the cmdlets are unavailable, the antivirus section reports
unavailable rather than guessing.

## 依赖

- Windows + WSL，DeepSeek Harness 跑在 WSL 里。

## 测试

```sh
npm test
```

单元测试在任何平台都能跑；实时测试在 WSL 之外自动跳过。

## 兼容性

| 字段 | 值 |
|------|----|
| **插件** | `dsh-wsl-defender` **0.1.0** |
| **最低 dsh** | ≥ **0.1.2**（Web UI 一次性 `?token=`，Windows 中继 `:3081`） |
| **最新验证** | 以 [dsh-wsl-kit 兼容性](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) 为准（当前 **`0.2.1-rc.5`**）— 套件唯一真源 |
| **套件档位** | `full` 或单独安装 |

## 许可

MIT
