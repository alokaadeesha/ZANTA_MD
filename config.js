const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "gJcQkYja#oOM-p3coTi2HgoG8wbndqISNsYCPynvyzwUQm9bvS5s",
ALIVE_IMG: process.env.ALIVE_IMG || "https://github.com/Akashkavindu/ZANTA_MD/blob/main/images/ChatGPT%20Image%20Nov%2020,%202025,%2009_47_50%20PM.png?raw=true",
ALIVE_MSG: process.env.ALIVE_MSG || "*Hello👋...ZANTA-MD Is Alive Now😍*\n\n*You can contact me using this link*\n\nhttp://wa.me/+94743404814?text=*Hey__ZANTA*\n\n*You can join my whatsapp group*\n\n*https://chat.whatsapp.com/EChgJJtPHbY8IvrHApocWc*\n\n> ZANTA MD WA BOT",
BOT_OWNER: '94762450884',  // Replace with the owner's phone number



};
