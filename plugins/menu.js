const { cmd, commands } = require("../command");

// 🖼️ MENU Image URL එක 
const MENU_IMAGE_URL = "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/ChatGPT%20Image%20Nov%2021,%202025,%2001_49_53%20AM.png?raw=true";

// Helper function to convert number to WhatsApp emoji number (1 -> ➊)
const numberToEmoji = (num) => {
    const emojis = ['0', '➊', '➋', '➌', '➍', '➎', '➏', '➐', '➑', '➒', '➓', '⓫', '⓬'];
    return emojis[parseInt(num)] || num;
};

// -----------------------------------------------------
// 1. Interactive Menu Categories 
// -----------------------------------------------------
// Key එක (1, 2, 3...) මගින් Category එක තෝරා ගැනීමට
const commandCategories = {
    "1": { name: "Main", emoji: "🏠", key: "main" },
    "2": { name: "Genaral", emoji: "📌", key: "other" }, // Mapped to 'other'
    "3": { name: "Download", emoji: "📥", key: "download" },
    "4": { name: "Owner", emoji: "👑", key: "owner" },
    "5": { name: "Search", emoji: "🔍", key: "search" }
};

cmd(
    {
        pattern: "menu",
        react: "📜",
        desc: "Displays the main menu.",
        category: "main",
        filename: __filename,
    },
    async (
        zanta,
        mek,
        m,
        {
            from,
            reply
        }
    ) => {
        try {
            const categories = {};

            // Commands, Category Key අනුව වෙන් කිරීම
            for (let cmdName in commands) {
                const cmdData = commands[cmdName];
                
                // 🚨 මෙතනින් Category Case Sensitivity Fix එක සිදුවේ.
                let cat = cmdData.category?.toLowerCase() || "other";
                // 'Genaral' වැනි Keys තිබුණත්, එය 'other' එකට map වේ.
                if (cat === "genaral") cat = "other"; 
                // -----------------------------------------------------

                if (cmdData.pattern === "menu") continue;
                
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push({
                    pattern: cmdData.pattern,
                    desc: cmdData.desc || `Use .${cmdData.pattern}`,
                });
            }

            // -----------------------------------------------------
            // A. REPLY COMMAND CHECK (Interactive Logic)
            // -----------------------------------------------------
            if (m.q) {
                const replyNumber = m.q.trim(); 

                if (commandCategories[replyNumber]) {
                    const selectedCat = commandCategories[replyNumber];
                    
                    // 🚨 REPLY MENU STYLE (ඔබ ඉල්ලූ Box/Divider Style)
                    let categoryText = "╭──────────●●►\n";
                    categoryText += `│🎡 *${selectedCat.name.toUpperCase()}* Command List:\n`;
                    categoryText += "╰──────────●●►\n";

                    const catKey = selectedCat.key;
                    
                    if (categories[catKey]) {
                        categories[catKey].forEach(c => {
                            // එක් එක් Command එක Box එකකින් පෙන්වයි
                            categoryText += `╭──────────●●►\n`;
                            categoryText += `│⛩ Command ☛ ${c.pattern}\n`;
                            categoryText += `│🏮 Use ☛ ${c.desc}\n`; 
                            categoryText += `╰──────────●●►\n`;
                        });
                    } else {
                        categoryText += "\n*⚠️ මෙම කාණ්ඩයේ කිසිදු Command එකක් සොයා ගැනීමට නොහැකි විය.*";
                    }

                    return await reply(categoryText.trim());

                } else {
                    return await reply("*❌ වැරදි අංකයක්!* කරුණාකර Menu එකේ ඇති අංකයක් Reply කරන්න.");
                }
            }

            // -----------------------------------------------------
            // B. MAIN MENU GENERATION (Header + Category List)
            // -----------------------------------------------------
            
            // 1. Welcome Banner (Header)
            let menuText = "╭━─━─━─━─━─━─━─━─━╮\n";
            menuText += "┃ 👑 *𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐙𝐀𝐍𝐓𝐀-𝐌𝐃* 🤖\n";
            menuText += "┃   _All Available Commands_\n";
            menuText += "╰━─━─━─━─━─━─━─━─━╯\n";
            
            // 2. Category List Header + Items
            menuText += "╭━━〔 📜 MENU LIST 〕━━┈⊷\n";
            menuText += "┃◈╭─────────────·๏\n";

            for (const key in commandCategories) {
                const cat = commandCategories[key];
                
                menuText += `┃◈│ ${numberToEmoji(key)} ${cat.emoji} ${cat.name} Menu\n`; 
            }

            menuText += "┃◈╰───────────┈⊷\n";
            menuText += "╰──────────────┈⊷\n\n";

            // 🚨 Magic Text (Interactive Reply එකට අත්‍යවශ්‍යයි)
            menuText += "Choose a menu option by replying with the number\n";

            // 3. Footer
            menuText += "\n➖➖➖➖➖➖➖➖➖➖➖➖\n";
            menuText += "> © 𝟐𝟎𝟐𝟓 | 𝐀𝐤𝐚𝐬𝐡 𝐊𝐚𝐯𝐢𝐧𝐝𝐮\n";
            
            // SEND IMAGE + MENU TEXT
            await zanta.sendMessage(
                from,
                {
                    image: { url: MENU_IMAGE_URL },
                    caption: menuText.trim(),
                },
                { quoted: mek }
            );

        } catch (err) {
            console.error(err);
            reply("❌ Error generating menu.");
        }
    }
);

