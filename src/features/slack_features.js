/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const { SlackDialog } = require("botbuilder-adapter-slack");

module.exports = function(controller) {
  controller.on("slash_command", async (bot, message) => {
    //code for slash command to speak anon to channel
    if (message.command === "/ask") {
      await bot.replyPublic(message, ` ${message.text}`);
    }
  });
};
