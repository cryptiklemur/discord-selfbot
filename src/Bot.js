const chalk         = require("chalk");
const Eris          = require('eris');
const fs            = require('fs');
const ServerManager = require('./ServerManager');

class Bot {
    constructor() {
        this.config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

        this.commands = [
            new (require('./Command/GetTagsCommand'))(this),
            new (require('./Command/GetTagCommand'))(this),
            new (require('./Command/SetTagCommand'))(this),
            new (require('./Command/EvalCommand'))(this)
        ];

        let startTime = 0;
        this.managers = [];
        this.client   = new Eris(this.config.token, this.config.client.options);
        this.client.connect();

        this.client.on('ready', () => {
            console.log(chalk.bold.green("Ready!"));
            console.log(chalk.bold.green(`${this.client.guilds.size} guilds | ${this.client.users.size} users`));
            startTime = Date.now();

            this.client.guilds.forEach(this.createServerManager.bind(this));
        });

        this.client.on("messageCreate", (msg) => {
            if (msg.channel.guild) {
                let manager = this.managers.find(manager => manager.guild.id === msg.channel.guild.id);
                if (!manager.isEnabled()) {
                    return;
                }

                console.log((msg.mentionedBy.implicit || msg.mentionedBy.explicit
                        ? chalk.red.bold("[Mentioned] ")
                        : "") + (msg.channel.guild || {name: "DM"}).name + " <#" + msg.channel.name + "> " + msg.author.username + ": " + msg.content);

                for (let command of this.commands) {
                    if (msg.content.indexOf(this.config.prefix) !== 0) {
                        return;
                    }

                    let message = msg.content.replace(this.config.prefix, ''),
                        matches = message.match(command.regex);

                    if (matches) {
                        return command.handle(msg, matches);
                    }
                }
            }
        });

        this.client.on("error", (msg, shardID) => {
            console.log(chalk.red("Shard " + shardID + " | " + (msg.stack || msg)));
        });

        this.client.on("connect", () => {
            console.log(chalk.bold.green("Connect!"));
        });

        this.client.on("disconnect", (err) => {
            console.log(err);
            console.log(chalk.red("Disconnect! Uptime: " + Date.now() - startTime));
        });

        var interruptedAlready = false;

        process.on('SIGINT', () => {
            if (interruptedAlready) {
                console.log(chalk.red.bold("Caught second interrupt signal... Exiting"));

                process.exit(1);
            }

            interruptedAlready = true;

            console.log(chalk.yellow.bold("Caught interrupt signal... Disconnecting"));

            this.client.disconnect();
        });
    }

    createServerManager(guild) {
        this.managers.push(new ServerManager(this, guild));
    }
}

module.exports = Bot;
