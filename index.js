const { Client, GatewayIntentBits, Events } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const LOG_CHANNEL_ID = process.env.LOG_CHANNEL_ID;
const TARGET_ROLE_NAME = "カスタムキー表示権限";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

let targetRole;

let logChannel = null;

client.once(Events.ClientReady, async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);

    const guild = await client.guilds.fetch(GUILD_ID).catch(() => null);
    if (!guild) {
        console.error("❌ 指定されたギルドが見つかりません。");
        process.exit(1);
    }

    await guild.members.fetch(); // メンバーキャッシュを事前取得

    const role = guild.roles.cache.find(r => r.name === TARGET_ROLE_NAME);
    if (!role) {
        console.error(`❌ ロール "${TARGET_ROLE_NAME}" が見つかりません。`);
        process.exit(1);
    }

    targetRole = role;
    console.log(`🎯 対象ロール: ${role.name}`);

    // ログチャンネルの取得
    logChannel = guild.channels.cache.get(LOG_CHANNEL_ID);
    if (!logChannel) {
        console.error("❌ ログチャンネルが見つかりません。");
    }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const member = newState.member || oldState.member;
    const guild = newState.guild || oldState.guild;

    // ギルドチェック
    if (!guild || guild.id !== GUILD_ID) return;

    // VC参加時
    if (!oldState.channel && newState.channel) {
        const channelName = newState.channel.name;
        if (channelName.includes("VC")) {
            if (!member.roles.cache.has(targetRole.id)) {
                await member.roles.add(targetRole).catch(console.error);
                console.log(`✅ ${member.user.tag} にカスタムキー表示権限を付与（${channelName} に参加）`);
                logChannel?.send(`✅ ${member.user.tag} にカスタムキー表示権限を付与（${channelName} に参加）`);
            }
        }
    }

    // VC退出時
    if (oldState.channel && !newState.channel) {
        const channelName = oldState.channel.name;
        if (channelName.includes("VC")) {
            if (member.roles.cache.has(targetRole.id)) {
                await member.roles.remove(targetRole).catch(console.error);
                console.log(`❌ ${member.user.tag} のカスタムキー表示権限を削除（${channelName} から退出）`);
                logChannel?.send(`❌ ${member.user.tag} のカスタムキー表示権限を削除（${channelName} から退出）`);
            }
        }
    }
});


client.login(TOKEN);
