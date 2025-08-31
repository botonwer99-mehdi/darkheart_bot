const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@adiwajshing/baileys");
const P = require("pino");
const os = require("os");
const moment = require("moment-timezone");

// Owner & Bot Info
const BOT_NAME = "Dark Heart";
const OWNER_NAME = "Mehdi Hacker";
const OWNER_NUM = "Coming Soon...";

// Utility
function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        logger: P({ level: "silent" }),
        printQRInTerminal: false, // QR disable
        auth: state,
        version,
        browser: [BOT_NAME, "Chrome", "4.0"]
    });

    // Connection update
    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, pairingCode } = update;

        if (connection === "open") {
            console.log("✅ Bot Connected Successfully!");
        }
        if (connection === "close") {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log("❌ Connection closed, reason:", reason);
            startBot(); // restart
        }
        if (pairingCode) {
            console.log("📌 Your WhatsApp Pairing Code:", pairingCode);
        }
    });

    sock.ev.on("creds.update", saveCreds);

    // Messages
    sock.ev.on("messages.upsert", async ({ messages }) => {
        try {
            const m = messages[0];
            if (!m.message) return;

            const from = m.key.remoteJid;
            const body =
                m.message.conversation ||
                m.message.extendedTextMessage?.text ||
                "";

            if (!body.startsWith(".")) return; // only commands with .

            const cmd = body.slice(1).trim().split(" ")[0].toLowerCase();

            if (cmd === "menu") {
                const menu = `
╭───《 ${BOT_NAME} 》───╮
│ ⚡ .ping
│ ⚡ .runtime
│ ⚡ .owner
│ ⚡ .search
│ ⚡ .fun
│ ⚡ .bug
│ ⚡ .quran
│ ⚡ .ai
╰──────────────────╯
                `;
                await sock.sendMessage(from, { text: menu });
            }

            if (cmd === "ping") {
                await sock.sendMessage(from, { text: "🏓 Pong! Bot is alive." });
            }

            if (cmd === "runtime") {
                const uptime = process.uptime();
                const h = Math.floor(uptime / 3600);
                const mnt = Math.floor((uptime % 3600) / 60);
                const s = Math.floor(uptime % 60);
                await sock.sendMessage(from, {
                    text: `⏱ Runtime: ${h}h ${mnt}m ${s}s`
                });
            }

            if (cmd === "owner") {
                await sock.sendMessage(from, {
                    text: `👑 Owner: ${OWNER_NAME}\n📞 Number: ${OWNER_NUM}`
                });
            }

            if (cmd === "search") {
                await sock.sendMessage(from, {
                    text: `🔎 Bot Name: ${BOT_NAME}`
                });
            }

            if (cmd === "bug") {
                await sock.sendMessage(from, {
                    text: "⚠️ Bug command triggered! (Fake crash effect)"
                });
            }

            if (cmd === "fun") {
                await sock.sendMessage(from, { text: "😂 Fun time activated!" });
            }

            if (cmd === "ai") {
                await sock.sendMessage(from, {
                    text: "🤖 AI feature coming soon..."
                });
            }

            if (cmd === "quran") {
                await sock.sendMessage(from, {
                    text: "📖 Holy Quran feature coming soon..."
                });
            }
        } catch (e) {
            console.log("❌ Error:", e);
        }
    });

    // Auto startup intro
    const ram = formatBytes(os.totalmem() - os.freemem());
    const rom = formatBytes(os.totalmem());
    const time = moment().tz("Asia/Karachi").format("HH:mm:ss");

    await sock.sendMessage("status@broadcast", {
        text: `✅ ${BOT_NAME} Started\n🕒 Time: ${time}\n📱 RAM Used: ${ram}\n💾 ROM Total: ${rom}\n👑 Owner: ${OWNER_NAME}`
    });
}

startBot();
