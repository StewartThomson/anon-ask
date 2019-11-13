# Botivity: anon-bot

## Project Background
The Botivity team is building a Slack bot that allows you to ask anonymous questions in your Slack workspace without risk of embarrassing yourself.

Using the [Botkit](https://botkit.ai/) framework, we have integrated ways to ask questions and up-vote to questions using Slack's amazing features. 


# Using the anon-bot:

Slack slash commands:

- `/ask ${message}` --> Posts message onto desired channel.
- `/ask-block [@users]` --> Slack admin users have the ability to block users from using the anon-bot. Blocked user are not able to ask questions.
- `/ask-unblock [@users]` --> Slack admin users have the ability to un-block users from using the anon-bot.

With more features to come!

## Run anon-bot locally for developer
#### NodeJS
Requires node ^12.13.0. Run node -v to check your version.

If you are encountering node versioning issues, please refer to [How to install specific NodeJS version](https://medium.com/@katopz/how-to-install-specific-nodejs-version-c6e1cec8aa11) on how to resolve them.


#### Update dependencies before running server
1. In Terminal, navigate to the local directory you cloned the anon-bot repo to. This root directory should have a package.json file.
2. Run `npm install` or `yarn` command in Terminal to install the dependencies.

#### Installing the bot
1. Clone this repo.
    ```sh
    > git clone https://gitlab.socs.uoguelph.ca/botivity/anon-bot.git
    ```
2. Go to https://api.slack.com/apps.
3. Login to slack.
4. Click on `Create New App`.
5. Name the app as well as specify which Slack .Workspace you would like to install the bot.
6. Click on `Create App`.
7. You will find yourself on the `Basic Information` page for your bot.
8. Scroll down to App Credentials.
9. There you will need to copy the Client ID, Client Secret, Signing Secret.
10. Now let's go back to the code editor of your choice.
11. In the root directory of the project, you will need to create a file called `.env`.
12. In the `.env` file you will need the information from step 9 to set the environment variables.
    ```bash
    # .env

    clientSigningSecret='.....'

    clientSecret='.....'

    clientId='.....'

    ```
13. Install [ngrok](https://ngrok.com/).
14. Run
    ```
    > ngrok http 3000
    ``` 
15. Get your tunneling url from the ngrok terminal, should look something like this: ```https://{yoursubdomain}.ngrok.io```.
16. Append to your `.env` file
    ```diff
      + redirectUri=http://{yoursubdomain}.ngrok.io/install/auth
    ```
17. Go back to your Slack app on the browser.
18. Click on `OAuth & Permissions` from the side menu.
19. There you will need to add the `redirectUri` from step 16 onto the field for `Redirect URLs`.
20. Click on `Save URLs`.
21. Now finally start up the botkit server.
    ```bash
    > cd Docker
    > docker-compose up
    ```
22. Navigate to `http://{yoursubdomain}.ngrok.io/install` on your browser. This will install the app.

#### Installing the slash commands
So you have installed the app on your Slack Workspace, now you would like to install the slash commands.
1. Navigate to your app on slack. `https://api.slack.com/apps`.
2. Click on `Slash Commands` from the side menu.
3. Click on `Create New Command`.
4. Fill out the input fields for the slash command.
   eg.
   ```
      Command => `/ask`
      Request URL => `http://{yoursubdomain}.ngrok.io/api/messages`
      Short Description => `Short Description of the command. eg. Ask questions to your team without feeling embarrassed.`
      Usage Hint => `Useful hints for command.  eg. How much do the individual assignments weigh?`
   ```
5. Enable `Escape channels, users, and links sent to your app`.
6. Click `Save`.



# TODO: 
- Troubleshooting, 
- `Make your first commit`
- `Want to start contributing?`
- FAQ
- Info about the team
- Make it look like a open source project
