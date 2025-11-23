const { cmd } = require("../command");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Helper function to convert Media Stream to a Buffer
async function streamToBuffer (stream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        stream.on('error', reject)
              .on('data', (data) => buffers.push(data))
              .on('end', () => resolve(Buffer.concat(buffers)))
    })
}

cmd(
    {
        pattern: "save",
        react: "🔑", // Key Debugging Emoji
        desc: "Resend Status or One-Time View Media (Final Key Fix)",
        category: "general",
        filename: __filename,
    },
    async (
        zanta,
        mek,
        m,
        {
            from,
            quoted,
            reply,
        }
    ) => {
        try {
            if (!quoted) {
                return reply("*කරුණාකර Status/Media Message එකකට reply කරන්න!* 🧐");
            }

            reply("*Status Message Data නැවත පූරණය කරමින්...* 🗝️");

            // 1. Status Message ID එක ලබා ගැනීම
            const quotedKey = m.message.extendedTextMessage.contextInfo.quotedMessage;
            const quotedMsgId = m.message.extendedTextMessage.contextInfo.stanzaId;
            
            if (!quotedKey || !quotedMsgId) {
                return reply("*⚠️ Status Message Context එක සොයාගත නොහැක. එය Valid Status එකක් නොවේ.*");
            }

            // 2. Message ID එක භාවිතයෙන් සම්පූර්ණ Status Data එක නැවත Fetch කිරීම (loadMessage)
            // අපිට Media Key එක ලබා ගැනීමට නම්, Bot විසින් Status එකේ සත්‍ය message එක load කළ යුතුයි.
            // ZANTA_MD client (zanta) එකේ loadMessage method එකක් ඇති බවට අපි උපකල්පනය කරමු.
            let fullQuotedMessage;
            try {
                // We use the sender JID (status@broadcast) and the original message ID
                fullQuotedMessage = await zanta.loadMessage(
                    "status@broadcast", 
                    quotedMsgId
                );
            } catch (e) {
                console.error("Failed to load message:", e);
                return reply("*⚠️ සම්පූර්ණ Status Message එක Load කිරීම අසාර්ථක විය.*");
            }

            if (!fullQuotedMessage || !fullQuotedMessage.message) {
                 return reply("*⚠️ Load කළ Message එක හිස්ය. එය Text Status එකක් හෝ Error එකක්.*");
            }
            
            // 3. Media Object එක ලබා ගැනීම (Media Key සහිත)
            // Status messages බොහෝ විට viewOnceMessage තුළ ඇති බැවින්, අපි එය පරීක්ෂා කරමු.
            const innerMessage = fullQuotedMessage.message.viewOnceMessage 
                                ? fullQuotedMessage.message.viewOnceMessage.message 
                                : fullQuotedMessage.message;
            
            const messageType = Object.keys(innerMessage).find(key => key.endsWith('Message'));

            if (!messageType) {
                 return reply("*⚠️ Loaded Status එකේ Media Content එකක් හමු නොවේ.*");
            }
            
            // 4. Media File Download (Native Baileys Method භාවිතයෙන්)
            reply("*Media Key සහිතව File එක Decrypt කරමින්...* 🔑");
            
            const mediaObjectToDownload = innerMessage[messageType];
            
            // Media Type එක (image, video, document)
            const downloadType = messageType.replace('Message', '');
            
            // Decryption සහ Download සඳහා Stream ලබා ගැනීම
            const stream = await downloadContentFromMessage(
                mediaObjectToDownload,
                downloadType
            );
            
            // Stream එක Buffer එකක් බවට පරිවර්තනය කිරීම
            const mediaBuffer = await streamToBuffer(stream);
            
            // 5. Message Options සැකසීම සහ යැවීම
            let messageOptions = {};
            let saveCaption = "*✅ Status Media Saved!*";
            
            if (downloadType === 'image') {
                messageOptions = { image: mediaBuffer, caption: saveCaption };
            } else if (downloadType === 'video') {
                messageOptions = { video: mediaBuffer, caption: saveCaption };
            } else if (downloadType === 'document') {
                messageOptions = { 
                    document: mediaBuffer, 
                    fileName: mediaObjectToDownload.fileName || 'saved_media', 
                    mimetype: mediaObjectToDownload.mimetype, 
                    caption: saveCaption 
                };
            }
            
            await zanta.sendMessage(from, messageOptions, { quoted: mek });

            return reply("*හරි! මේ පාරනම් වැඩේ හරි යන්න ඕනේ 💯✅*");

        } catch (e) {
            console.error("--- FINAL CRITICAL ERROR ---", e);
            reply(`*🚨 අතිශය තීරණාත්මක දෝෂය:* ${e.message || e}. ඔබගේ Framework එක Status Message Load කිරීමට අසමත් වී ඇත (loadMessage function එක).`);
        }
    }
);
