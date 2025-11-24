const { cmd, commands } = require("../command");

// 🖼️ MENU Image URL එක 
const MENU_IMAGE_URL = "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/ChatGPT%20Image%20Nov%2021,%202025,%2001_49_53%20AM.png?raw=true";

// -----------------------------------------------------
// 1. Button Menu Categories Map (Key එක Button ID එක ලෙස භාවිතා වේ)
// -----------------------------------------------------
const categoriesMap = {
    "CAT_MAIN": { name: "🏠 Main Commands", key: "main" },
    "CAT_OTHER": { name: "📌 General Commands", key: "other" },
    "CAT_DOWNLOAD": { name: "📥 Download Tools", key: "download" },
    "CAT_OWNER": { name: "👑 Owner Commands", key: "owner" },
    "CAT_SEARCH": { name: "🔍 Search Commands", key: "search" }
};

cmd(
    {
        pattern: "menu",
        react: "📜",
        desc: "Displays the main menu using buttons.",
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
            const buttons = [];

            // Commands, Category Key අනුව වෙන් කිරීම (මෙය Reply සඳහා ද අවශ්‍යයි)
            for (let cmdName in commands) {
                const cmdData = commands[cmdName];
                
                // Case Sensitivity Fix එක තවදුරටත් තබමු.
                let cat = cmdData.category?.toLowerCase() || "other";
                if (cat === "genaral") cat = "other"; 

                if (cmdData.pattern === "menu") continue;
                
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push({
                    pattern: cmdData.pattern,
                    desc: cmdData.desc || `Use .${cmdData.pattern}`,
                });
            }


            // -----------------------------------------------------
            // A. REPLY COMMAND LIST GENERATION (If a button was clicked - m.q is the button ID)
            // -----------------------------------------------------
            if (m.q) {
                const selectedButtonId = m.q;
                
                // Button ID එකෙන් Key එක සොයා ගැනීම
                const selectedCatData = Object.values(categoriesMap).find(data => `CAT_${data.key.toUpperCase()}` === selectedButtonId);

                if (selectedCatData) {
                    const catKey = selectedCatData.key;
                    
                    let categoryText = "╭──────────●●►\n";
                    categoryText += `│🎡 *${selectedCatData.name.toUpperCase()}* Command List:\n`;
                    categoryText += "╰──────────●●►\n";

                    if (categories[catKey]) {
                        categories[catKey].forEach(c => {
                            // එක් එක් Command එක Box එකකින් පෙන්වයි
                            categoryText += `╭──────────●●►\n`;
                            categoryText += `│⛩ Command ☛ .${c.pattern}\n`;
                            categoryText += `│🏮 Use ☛ ${c.desc}\n`; 
                            categoryText += `╰──────────●●►\n`;
                        });
                    } else {
                        categoryText += "\n*⚠️ මෙම කාණ්ඩයේ කිසිදු Command එකක් සොයා ගැනීමට නොහැකි විය.*";
                    }
                    // Button එකක් Click කළ විට Reply එකක් ලෙස Commands List එක යවයි
                    return await reply(categoryText.trim());

                } else {
                    return await reply("*❌ දත්ත සොයා ගැනීමට නොහැකි විය.* කරුණාකර නැවත උත්සාහ කරන්න.");
                }
            }
            
            // -----------------------------------------------------
            // B. MAIN BUTTON MESSAGE GENERATION (If no button was clicked)
            // -----------------------------------------------------
            
            // 1. Buttons Array සකස් කිරීම
            for (const id in categoriesMap) {
                buttons.push({
                    buttonId: id, // Example: 'CAT_OWNER'
                    buttonText: { displayText: categoriesMap[id].name }, // Example: '👑 Owner Commands'
                    type: 1 
                });
            }

            // 2. Stylish Caption Text
            let menuText = "╭━─━─━─━─━─━─━─━─━╮\n";
            menuText += "┃ 👑 *𝐖𝐄𝐋𝐂𝐎𝐌𝐄 𝐓𝐎 𝐙𝐀𝐍𝐓𝐀-𝐌𝐃* 🤖\n";
            menuText += "┃   _Select a Category Below_\n";
            menuText += "╰━─━─━─━─━─━─━─━─━╯\n\n";

            menuText += "╭━━〔 📜 MENU OPTIONS 〕━━┈⊷\n";
            menuText += "┃ 🚨 *Choose your Command Group*\n";
            menuText += "┃ \n";
            menuText += "┃ _(Simply press the button)_ \n";
            menuText += "╰──────────────┈⊷";

            // 3. Send Button Message
            await zanta.sendMessage(from, {
                image: { url: MENU_IMAGE_URL },
                caption: menuText.trim(),
                buttons: buttons,
                footer: "© 𝟐𝟎𝟐𝟓 | 𝐀𝐤𝐚𝐬𝐡 𝐊𝐚𝐯𝐢𝐧𝐝𝐮"
            }, { quoted: mek });

        } catch (err) {
            console.error(err);
            reply("❌ Error generating menu.");
        }
    }
);
