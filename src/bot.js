//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the anon-ask bot.

// Import Botkit's core features
const fs = require("fs");
const { Botkit } = require("botkit");
const { BotkitCMSHelper } = require("botkit-plugin-cms");

// Import a platform-specific adapter for slack.

const {
  SlackAdapter,
  SlackMessageTypeMiddleware,
  SlackEventMiddleware
} = require("botbuilder-adapter-slack");

const { MongoDbStorage } = require("botbuilder-storage-mongodb");

const tokenCacheFile = __dirname + "/tokenCache.json";


let tokenCache = {};
let userCache = {};

fs.access(tokenCacheFile, fs.constants.F_OK, (err) => {
  if(!err) {
    fs.readFile(tokenCacheFile, 'utf8', (err1, data) => {
      if(err1) {
        console.log(err1);
        return;
      }
      data = JSON.parse(data);
      tokenCache = data[0];
      userCache = data[0];
    })
  }
});

if(process.env.NODE_ENV !== "development") {
    // Load process.env values from .env file
    require('dotenv').config();
} else {
    require('dotenv').config({ path: __dirname + '/.dev.env' })
}

let storage = null;
if (process.env.MONGO_URI) {
  storage = mongoStorage = new MongoDbStorage({
    url: process.env.MONGO_URI
  });
}

const adapter = new SlackAdapter({
  // REMOVE THIS OPTION AFTER YOU HAVE CONFIGURED YOUR APP!
  enable_incomplete: false,
  debug:true,
  // parameters used to secure webhook endpoint
  clientSigningSecret: process.env.clientSigningSecret,

  // credentials used to set up oauth for multi-team apps
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  botToken: process.env.botToken, //Oauth Bot token
  scopes: ['bot'],
  redirectUri: process.env.redirectUri,

    // functions required for retrieving team-specific info
    // for use in multi-team apps
    getTokenForTeam: getTokenForTeam,
    getBotUserByTeam: getBotUserByTeam,
});

// Use SlackEventMiddleware to emit events that match their original Slack event types.
adapter.use(new SlackEventMiddleware());

// Use SlackMessageType middleware to further classify messages as direct_message, direct_mention, or mention
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  webhook_uri: "/api/messages",

  adapter: adapter,

  storage
});

if (process.env.cms_uri) {
  controller.usePlugin(
    new BotkitCMSHelper({
      uri: process.env.cms_uri,
    })
  );
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(__dirname + "/features");

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on("message,direct_message", async (bot, message) => {
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        // do not continue middleware!
        return false;
      }
    });
  }
});

controller.webserver.get("/", (req, res) => {
  res.send(`This app is running Botkit ${controller.version}.`);
});

controller.webserver.get("/install", (req, res) => {
  // getInstallLink points to slack's oauth endpoint and includes clientId and scopes
  res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get("/install/auth", async (req, res) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code);

    console.log("FULL OAUTH DETAILS", results);

    // Store token by team in bot state.
    tokenCache[results.team_id] = results.bot.bot_access_token;

    // Capture team to bot id
    userCache[results.team_id] = results.bot.bot_user_id;

    fs.writeFileSync(tokenCacheFile, JSON.stringify([
        tokenCache, userCache
    ]));

    res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});

if (process.env.TOKENS) {
  tokenCache = JSON.parse(process.env.TOKENS);
}

if (process.env.USERS) {
  userCache = JSON.parse(process.env.USERS);
}

async function getTokenForTeam(teamId) {
  if (tokenCache[teamId]) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(tokenCache[teamId]);
      }, 150);
    });
  } else {
    console.error("Team not found in tokenCache: ", teamId);
  }
}

async function getBotUserByTeam(teamId) {
  if (userCache[teamId]) {
    return new Promise(resolve => {
      setTimeout(function() {
        resolve(userCache[teamId]);
      }, 150);
    });
  } else {
    console.error("Team not found in userCache: ", teamId);
  }
}
