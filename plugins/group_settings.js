const { cmd, commands } = require("../command");

// --- Core Admin Check Helper Function (group.js වෙතින් පිටපත් කර ඇත) ---
const checkAdminStatus = async (zanta, from, reply, isGroup, m, requireUserAdmin = true) => {
    if (!isGroup) {
        reply("*This command can only be used in a Group!* 🙁");
        return false;
    }

    try {
        let groupMeta = await zanta.groupMetadata(from);
        const botJid = zanta.user.id;
        const senderJid = m.sender; 
        
        const admins = groupMeta.participants.filter(p => p.admin !== null).map(p => p.id);
        const isBotAdminNew = admins.includes(botJid);
        const isUserAdminNew = admins.includes(senderJid);

        if (!isBotAdminNew) {
            reply("*I need to be an Admin in this group to use this command!* 🤖❌");
            return false;
        }
        
        if (requireUserAdmin && !isUserAdminNew) {
            reply("*You must be an Admin to use this command!* 👮‍♂️❌");
            return false;
        }

        return true; 
        
    } catch (e) {
        console.error("Error fetching Group Metadata for Admin check:", e);
        reply("*Error:* Failed to check admin status. Please try again. 😔");
        return false;
    }
};


// --- MUTE/CLOSE COMMAND ---
cmd(
  {
    pattern: "mute",
    alias: ["close"],
    react: "🔒",
    desc: "Closes the group so only admins can send messages.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isAdmins }) => {
    // User Admin අවශ්‍යයි (requireUserAdmin default = true)
    if (!await checkAdminStatus(zanta, from, reply, isGroup, m)) return;

    try {
      reply("*Closing group for members... 🔒*");
      await zanta.groupSettingUpdate(from, 'announcement');
      return reply(`*Group successfully closed! Only Admins can send messages now. 🤐✅*`);
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to mute the group. ${e.message || e}`);
    }
  }
);

// --- UNMUTE/OPEN COMMAND ---
cmd(
  {
    pattern: "unmute",
    alias: ["open"],
    react: "🔓",
    desc: "Opens the group so all members can send messages.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isAdmins }) => {
    // User Admin අවශ්‍යයි
    if (!await checkAdminStatus(zanta, from, reply, isGroup, m)) return;

    try {
      reply("*Opening group for all members... 🔓*");
      await zanta.groupSettingUpdate(from, 'not_announcement');
      return reply(`*Group successfully opened! All members can send messages now. 💬✅*`);
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to unmute the group. ${e.message || e}`);
    }
  }
);

// --- INVITE LINK COMMAND ---
cmd(
  {
    pattern: "invite",
    alias: ["link"],
    react: "🔗",
    desc: "Gets the group invite link.",
    category: "group",
    filename: __filename,
  },
  async (zanta, mek, m, { from, reply, isGroup, isAdmins }) => {
    // User Admin අවශ්‍ය නැත (requireUserAdmin = false)
    if (!await checkAdminStatus(zanta, from, reply, isGroup, m, false)) return;

    try {
      reply("*Generating Invite Link... 🔗*");
      
      const code = await zanta.groupInviteCode(from);
      
      if (!code) {
          return reply("*Failed to generate the invite link.* 😔");
      }

      const inviteLink = `https://chat.whatsapp.com/${code}`;
      
      await zanta.sendMessage(
        from,
        { 
          text: `*🔗 Group Invite Link:*\n\n${inviteLink}`,
        },
        { quoted: mek }
      );
      
      return reply("> *වැඩේ හරි 🙃✅*");
      
    } catch (e) {
      console.error(e);
      reply(`*Error:* Failed to fetch the invite link. ${e.message || e}`);
    }
  }
);
