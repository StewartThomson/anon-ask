/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { SlackDialog } = require("botbuilder-adapter-slack");
const Message = require("../schema/message");
const User = require("../schema/user");

const { GetOAuthToken } = require("../bot");

module.exports = function(controller) {
  controller.on("slash_command", async (bot, message) => {
    //code for slash command to speak anon to channel
    if (message.command === "/ask") {
      try {
        const [foundUser] = await User.find({ user_id: message.user_id });
        if (foundUser && foundUser.is_banned) {
          return bot.replyPrivate(
            message,
            `Unable to ask, you have been banned.`
          );
        }
      } catch (error) {
        return bot.replyPrivate(message, `Error occurred.`);
      }
      await bot.replyPublic(message, ` ${message.text}`).then(async () => {
        let teamId = bot.getConfig("activity").channelData.team_id;
        bot.api.conversations
          .history({
            token: GetOAuthToken(teamId),
            channel: message.channel,
            limit: 1
          })
          .then(res => {
            let messageInfo = res.messages[0];
            if (!messageInfo) {
              console.log("Unable to get message information.");
              return;
            }
            Message.create(
              {
                team_id: teamId,
                sender_id: message.user,
                message_timestamp: messageInfo.ts,
                message_body: message.text,
                channel_id: message.channel
              },
              err => {
                if (err) throw err;
              }
            );
          })
          .catch(err => {
            if (err) console.log(err);
          });
      });
    }
    if (message.command === "/ask-block") {
      let user = {};
      try {
        const [foundUser] = await User.find({ user_id: message.user_id });
        if (foundUser) {
          user = foundUser;
        }
      } catch (error) {
        return bot.replyPrivate(message, `Unable to block. Error occurred.`);
      }
      if (!user.is_admin) {
        return bot.replyPrivate(
          message,
          `You are not a admin, you are not able to block users.`
        );
      }
      let str = message.text;
      const arrStr = str.split(/[ ,]+/);

      arrStr.forEach(async str => {
        const ifMatch = str.match(/(?!<@)([A-Z0-9]{9})\|(\w+)/g);
        if (!ifMatch) {
          return bot.replyPrivate(
            message,
            `Unable to block ${str}. Invalid user.`
          );
        }
        const [matchStr] = ifMatch;
        const [user_id, name] = matchStr.split("|");
        try {
          const user = await User.findOneAndUpdate(
            { user_id },
            { is_banned: true }
          );
          return await bot.replyPrivate(message, `Blocked ${name}`);
        } catch (error) {
          return bot.replyPrivate(
            message,
            `Unable to block ${name}. Error occured.`
          );
        }
      });
    }
  });
};
