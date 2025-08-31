const { Telegraf } = require("telegraf");
require("dotenv").config();

// Telegram Token (from BotFather)
const BOT_TOKEN = process.env.TG_TOKEN || "your_telegram_token_here";

// Owner Telegram ID (apna ID daalo, taki sirf tum control kar sako)
const OWNER_ID = process.env.TG_OWNER || "123456789";

if (BOT_TOKEN === "your_telegram_token_here") {
    console.log("❌ Please set your Telegram BOT TOKEN in .env file!");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Start command
bot.start((ctx) => {
    if (ctx.from.id.toString() !== OWNER_ID) {
        return ctx.reply("⛔ Access Denied!");
    }
    ctx.reply(`👋 Welcome back, ${ctx.from.first_name}!\nYour WhatsApp bot (Dark Heart) is connected here.`);
});

// Menu command
bot.command("menu", (ctx) => {
    if (ctx.from.id.toString() !== OWNER_ID) return;
    ctx.reply(`
📍 *Dark Heart Control Panel* 📍

⚡ /status - Check bot status
⚡ /owner  - Show owner info
⚡ /menu   - Show this menu again
    `, { parse_mode: "Markdown" });
});

// Status command
bot.command("status", (ctx) => {
    if (ctx.from.id.toString() !== OWNER_ID) return;
    ctx.reply("✅ Dark Heart WhatsApp Bot is Running Smoothly!");
});

// Owner info
bot.command("owner", (ctx) => {
    if (ctx.from.id.toString() !== OWNER_ID) return;
    ctx.reply("👑 Owner: Mehdi Hacker\n📞 Number: Coming Soon...");
});

// Handle unknown commands
bot.on("text", (ctx) => {
    if (ctx.from.id.toString() !== OWNER_ID) return;
    ctx.reply("⚠️ Unknown command! Type /menu to see available commands.");
});

bot.launch().then(() => {
    console.log("✅ Telegram Panel is Running...");
});
