class AbstractCommand {
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

    createMessage(channel, content) {
        return this.bot.client.createMessage(channel.id, '< ' + content);
    }

    deleteMessage(message) {
        return this.bot.client.deleteMessage(message.channel.id, message.id);
    }

    editMessage(message, content) {
        return this.bot.client.editMessage(message.channel.id, message.id, content);
    }
}

module.exports = AbstractCommand;
