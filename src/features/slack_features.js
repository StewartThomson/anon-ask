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
              console.log("Unable to get message information");
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
      console.log({ message });
      let user = {};
      try {
        const [foundUser] = await User.find({ user_id: message.user_id });
        if (foundUser) {
          user = foundUser;
        }
        console.log({ user });
      } catch (error) {
        if (error) console.log(error);
      }

      if (!user.is_admin) {
        return bot.replyPublic(
          message,
          `You are not a admin, you are not able to block users`
        );
      }

      await bot
        .replyPublic(message, `Blocked ${message.text}`)
        .then(async () => {
          let teamId = bot.getConfig("activity").channelData.team_id;
          bot.api.conversations
            .history({
              token: GetOAuthToken(teamId),
              channel: message.channel,
              limit: 1
            })
            .then(res => {
              console.log({ res });
            })
            .catch(err => {
              if (err) console.log(err);
            });
        });
    }
  });
  controller.on("message", async (bot, message) => {
    console.log({ message });
  });
};
