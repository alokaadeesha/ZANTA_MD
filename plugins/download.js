const { cmd, commands } = require("../command");
const axios = require('axios');
const tiktokdl = require("tiktok-dl"); // TikTok Downloader සඳහා

// --- ⚙️ Helper Functions ---

function isUrl(text) {
    // සරල URL validation
    return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
}

// --------------------------------------------------------------------------------------
// 📦 APK COMMAND - Direct APK Link Downloader
// --------------------------------------------------------------------------------------
cmd(
    {
        pattern: "apk",
        react: "📦",
        desc: "Download file from a direct APK link.",
        category: "download",
        filename: __filename,
    },
    async (zanta, mek, m, { from, reply, q }) => {
        try {
            if (!q || !isUrl(q)) return reply("❌ *Please provide a direct link to the APK file.*");

            // .apk link එකක්දැයි පරීක්ෂා කිරීම (විකල්ප)
            if (!q.toLowerCase().endsWith(".apk") && !q.toLowerCase().includes("apk")) {
                 return reply("⚠️ *This command is for direct .apk file links only.*");
            }

            await reply("🔄 *Downloading APK file... Please wait...* (Large files may fail due to WhatsApp limits)");

            await zanta.sendMessage(
                from,
                {
                    document: { url: q },
                    mimetype: "application/vnd.android.package-archive",
                    fileName: `app-${Date.now()}.apk`,
                    caption: "*📦 Your APK file is ready!*",
                },
                { quoted: mek }
            );
            
            return reply(">*වැඩේ හරි 🙃✅*");

        } catch (e) {
            console.error(e);
            reply(`❌ *Error in .apk:* ${e.message} 😞`);
        }
    }
);

// --------------------------------------------------------------------------------------
// 🕺 TIKTOK COMMAND - TikTok Video Downloader (No Watermark)
// --------------------------------------------------------------------------------------
cmd(
    {
        pattern: "tiktok",
        alias: ["ttdl"],
        react: "🕺",
        desc: "Download TikTok Video (No Watermark)",
        category: "download",
        filename: __filename,
    },
    async (zanta, mek, m, { from, reply, q }) => {
        try {
            if (!q || !q.includes("tiktok.com")) return reply("❌ *Please provide a valid TikTok video link.*");

            await reply("🔄 *Fetching TikTok video... Please wait...*");

            const result = await tiktokdl(q, {version: "v2"});

            if (!result || !result.video.no_watermark) {
                return reply("❌ *Failed to download TikTok video or No Watermark link not found.*");
            }
            
            const noWatermarkUrl = result.video.no_watermark;
            const captionText = `*🕺 TikTok Video Downloaded!* \n\n*Creator:* ${result.author.unique_id || 'N/A'}\n\n> *වැඩේ හරි 🙃✅*`;

            await zanta.sendMessage(
                from,
                {
                    video: { url: noWatermarkUrl },
                    mimetype: "video/mp4",
                    caption: captionText,
                },
                { quoted: mek }
            );

        } catch (e) {
            console.error(e);
            reply(`❌ *Error in .tiktok:* ${e.message} 😞`);
        }
    }
);
