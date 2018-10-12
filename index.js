const bot_config = require("./config.json");
const discord = require("discord.js");
const request = require("request");
const bot = new discord.Client({ disableEveryone: true });

bot.on("ready", async () => {
  bot.user.setActivity("Feeling high!!");
});

bot.on("message", async message => {
  if (message.author.bot) return;

  if (message.author.type === "dm") return;

  let prefix = bot_config.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let from = cmd.slice(1, 4);
  let to = cmd.slice(4, 7);

  if (cmd === `${prefix}${from}${to}`) {
    request(
      `https://min-api.cryptocompare.com/data/price?fsym=${from}&tsyms=${to}`,
      { json: true },
      (err, res, body) => {
        if (res.statusCode === 200) {
          if (body.Response === "Error") {
            return message.channel.send(
              "Hey!! Something is wrong. Please check the command."
            );
          }

          let botEmMsg = new discord.RichEmbed()
            .setColor("#15f153")
            .setDescription("Currency Price")
            .addField("From:", ` 1 ${from}`)
            .addField("Equal to :", `${body[Object.keys(body)[0]]} ${to}`);
          return message.channel.send(botEmMsg);
        } else {
          return "Hey!! Something is wrong. Please report it to developer.";
        }
      }
    );
  }
  if (cmd === `${prefix}botinfo`) {
    let botEmbadeed = new discord.RichEmbed()
      .setDescription("Bot information")
      .setColor("#15f153")
      .addField("Bot Name", bot.user.username)
      .addField("UpTime", bot.uptime)
      .addField("Created at", bot.user.createdAt);

    return message.channel.send(botEmbadeed);
  }
});

bot.login(bot_config.token);
