# A Simple Bot for Komodo Marketing

Upon request, this simple bot tells the user how much time remains until the next three meetings of the Komodo marketing team.

This bot is designed for use with the Riot platform, and is based on the [matrix-js-sdk](https://github.com/turt2live/matrix-js-bot-sdk#readme) Nodejs framework by @turt2live.

## Create a New Bot Instance
To create a new instance of this bot, follow these instructions:

- Create a new account on Riot
- In the user settings of this account, find the About tab, and then find the `access_token`
- Once you have the `access_token`, you may close the window, but do not log out as this will nullify the `access_token`
- Fork this repository to your own account
- Clone the repository to your VPS
- Ensure that your VPS's TCP Rules allow for communication on your desired port (default is 9000)
- Create a `.env` file in the project's root directory
- In this file, add the following content
  - `ACCESS_TOKEN=INSERT_YOURS_HERE`
- Run `npm install`
- Run `node bot.js`

Once the bot is running, try using another user account to communicate with the bot. 

Type: `!schedule`, and the bot will tell you the next three meetings.
