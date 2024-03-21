const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const translate = require("@plainheart/google-translate-api");
const pgp = require("pg-promise")();
const connectionString = "postgres://postgres:TsuXonDokSpar04032024!@127.0.0.1:5432/clarity";
const { Player } = require("discord-player");
const Clarity = require("clarity-db");
const { LavasfyClient } = require("lavasfy");
const { Manager } = require("erela.js");
const deezer = require("erela.js-deezer");
const apple = require("erela.js-apple");
const facebook = require("erela.js-facebook");
const mongoose = require("mongoose");
const Logger = require("../client/logger");
mongoose.set("strictQuery", false);
const DeezerExtractor = require("discord-player-deezer").default;
module.exports = class ClarityBots extends Client {
  constructor(
    options = {
      intents: [3276799],
      partials: [1, 2, 5, 3, 4, 6, 0],
    }
  ) {
    super(options);
    this.setMaxListeners(0);
    this.cachedChannels = new Map()
    this.commands = new Collection();
    this.aliases = new Collection();
    this.slashCommands = new Collection();
    this.snipes = new Collection();
    this.config = require("../../../config/config");
    this.color = this.config.default_color;
    this.creators = require("../../../config/creators");
    this.version = require("../../../version");
    this.player = Player.singleton(this);
    this.player.extractors.register(DeezerExtractor);
    this.player.extractors.loadDefault();
    this.functions = require("../utils/index");
    this.ms = require("../utils/ms");
    this.emoji = require("../../../config/emoji");
    this.db = pgp(connectionString);
    this.data = new Clarity(`./Clarity.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.data2 = require("quick.db");
    this.prevname = new Clarity(`./Prevname.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.antiraid = new Clarity(`./Antiraid.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.invites = new Clarity(`./Invites.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.logs = new Clarity(`./Logs.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.settings = new Clarity(`./Settings.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.giveaway = new Clarity(`./Giveaway.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.ticket = new Clarity(`./Ticket.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.embeds = new Clarity(`./Embeds.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.modlogs = new Clarity(`./Modlogs.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.perms = new Clarity(`./Perms.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.xp = new Clarity(`./Xp.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    });
    this.lavadb = new Clarity(`./Lavadb.json`, {
      backup: {
        enabled: true,
        folder: "./db_backups/",
        interval: 3600000,
      },
      preset: {
        hello: "world",
      },
    })
    this.logger = new Logger("./Clarity.log");
    this.connections = new Map();
    this.CommandsRan = 0;
    this.SongsPlayed = 0;
    this.pretty = require("pretty-ms");
    this.logsType = require("./logsType");
    this.channelType = require("./channelType");
    this.componentType = require("./componentType");
    this.buttonType = require("./buttonType");
    this.colorListed = require("./colorListed");
    this.allInvites = new Collection();
    this.vanityCount = new Collection();
    this.translate = translate;
    this.Lavasfy = new LavasfyClient({

    })
    this.initCommands();
    this.initEvents();
    this.connectToToken();
    this.initSlashCommands();
  }

  async connectToToken() {
    this.login(this.config.token)
      .then(() => {
        var x = setInterval(() => {
          if (this.ws.reconnecting || this.ws.destroyed) {
            this.login(this.config.token).catch((e) => {
              clearInterval(x);
              console.error("Erreur pendant la connexion au token :");
              console.error(e);
            });
          }
        }, 30000);
      })
      .catch((e) => {
        console.error(e);
        if (e?.code?.toLowerCase()?.includes("token")) return;
        setTimeout(() => {
          this.connectToToken();
        }, 10000);
      });
  }
  refreshConfig() {
    delete this.config;
    delete require.cache[require.resolve("../../../config/config")];
    this.config = require("../../../config/config");
  }
  async initMongo() {
    this.mongo = await mongoose
      .connect(
        "mongodb+srv://tsubasa:keyla0910@cluster0.httezlr.mongodb.net/?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("[MongoDB] Connected");
      })
      .catch((e) => {
        console.error("[MongoDB] Error");
        console.error(e);
      });
  }
  initCommands() {
    const subFolders = fs.readdirSync("./source/commands");
    for (const category of subFolders) {
      const commandsFiles = fs
        .readdirSync(`./source/commands/${category}`)
        .filter((file) => file.endsWith(".js"));
      for (const commandFile of commandsFiles) {
        const command = require(`../../commands/${category}/${commandFile}`);
        command.category = category;
        command.commandFile = commandFile;
        if (command.name === "bl" && this.config.isPublic) continue;
        if (command.name === "unbl" && this.config.isPublic) continue;
        if (command.name === "leavesettings") continue;
        if (command.category === "gestion" && this.config.isPublic) continue;
        this.commands.set(command.name, command);
        if (command.aliases && command.aliases.length > 0) {
          command.aliases.forEach((alias) => this.aliases.set(alias, command));
        }
      }
    }
    let finale = new Collection();
    this.commands.map((cmd) => {
      if (finale.has(cmd.name)) return;
      finale.set(cmd.name, cmd);
      this.commands
        .filter((v) => v.name.startsWith(cmd.name) || v.name.endsWith(cmd.name))
        .map((cm) => finale.set(cm.name, cm));
    });
    this.commands = finale;
  }

  initEvents() {
    const subFolders = fs.readdirSync(`./source/events`);
    for (const category of subFolders) {
      const eventsFiles = fs
        .readdirSync(`./source/events/${category}`)
        .filter((file) => file.endsWith(".js"));
      for (const eventFile of eventsFiles) {
        const event = require(`../../events/${category}/${eventFile}`);
        this.on(event.name, (...args) => event.run(this, ...args));
        if (category === "anticrash")
          process.on(event.name, (...args) => event.run(this, ...args));
      }
    }
  }

  initSlashCommands() {
    const subFolders = fs.readdirSync(`./source/slashCmds`);
    for (const category of subFolders) {
      const commandsFiles = fs
        .readdirSync(`./source/slashCmds/${category}`)
        .filter((file) => file.endsWith(".js"));
      for (const commandFile of commandsFiles) {
        const command = require(`../../slashCmds/${category}/${commandFile}`);
        command.category = category;
        command.commandFile = commandFile;
        this.slashCommands.set(command.name, command);
        slashArray.push(command);
        this.on("ready", async () => {
          await this.application.commands.set(slashArray);
        });
      }
    }
  }
};
