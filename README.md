# Discord VC Role Bot

特定のDiscordサーバー内で、ボイスチャンネル（VC）に参加したユーザーに自動でロールを付与し、VCから退出したらそのロールを削除するシンプルなBotです。

## 🛠 機能

- ギルドIDで特定サーバーに限定して動作
- 指定されたロール（「カスタムキー表示権限」）の存在確認
- VC参加でロール付与 / 退出でロール削除
- ロールが存在しない場合、Botは起動しません

---

## 🧾 前提条件

- Node.js 16.9.0 以上（Discord.js v14 対応のため）推奨 v22.13.1
- Discord Botトークン
- Botがロール管理権限、メンバーの読み取り、Voice状態の読み取り権限を持っていること
- Botの「サーバーメンバーのインテント（MEMBER INTENT）」が有効であること

---

## 🚀 セットアップ手順

1. リポジトリをクローンまたはダウンロード：

```bash
git clone https://github.com/yuyutti/VC-Custam-role
cd VC-Custam-role
npm i
```

2. envの設定:  

```bash
TOKEN=your_discord_token
GUILD_ID=target_guild_id
LOG_CHANNEL_ID=target_guild_in_logging_channel_id
```

3. 実行
```bash
node index.js
```