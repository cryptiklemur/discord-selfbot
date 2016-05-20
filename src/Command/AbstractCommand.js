const Eris    = require('eris'),
      Channel = Eris.prototype.Channel,
      User    = Eris.prototype.User,
      Member  = Eris.prototype.Member;

class AbstractCommand {
    get prefixed() { return true; }

    constructor(bot) {
        this.bot = bot;
    }

    isPrivate(message) {
        return !message.channel.guild;
    }

    getServerConfigFromMessage(message) {
        return this.getServerManagerFromMessage(message).config;
    }

    getServerManagerFromMessage(message) {
        return this.bot.managers.find(manager => manager.guild.id === message.channel.guild.id);
    }

    createMessage(destination, content, noPrefix) {
        if (noPrefix === undefined) {
            noPrefix = false;
        }

        if (noPrefix === false) {
            content = this.bot.config.response_prefix + ' ' + content;
        }

        if (destination instanceof Channel) {
            return this.bot.client.createMessage(destination.id, content);
        }

        if (destination instanceof Member) {
            return this.createMessage(destination.member, content, prefix)
        }

        if (destination instanceof User) {
            return new Promise((resolve, reject) => {
                this.bot.client.getDMChannel(destination.id).then(channel => {
                    this.createMessage(channel, content, prefix).then(resolve).catch(reject);
                }).catch(reject);
            });
        }

        throw new Error("Invalid destination.");
    }

    reply(message, content, prefix) {
        console.log(message.channel);
        this.createMessage(this.isPrivate(message) ? message.author : message.channel, content, prefix)
    }

    deleteMessage(message) {
        return this.bot.client.deleteMessage(message.channel.id, message.id);
    }

    editMessage(message, content) {
        return this.bot.client.editMessage(message.channel.id, message.id, content);
    }
}

module.exports = AbstractCommand;
