const AbstractCommand = require('./AbstractCommand');

class SetTagCommand extends AbstractCommand {
    get regex() { return  /^tag ([A-Za-z0-9-_]+) (.*)$/i; }

    handle(message, matches) {
        if (this.isPrivate(message)) {
            return;
        }

        if (message.author.id !== this.bot.config.admin) {
            return;
        }

        let manager = this.getServerManagerFromMessage(message),
            config  = manager.config;
        if (config.tags === undefined) {
            config.tags = {};
        }

        manager.config.tags[matches[1]] = matches[2];
        manager.saveConfig();

        this.createMessage(message.channel, ':thumbsup::skin-tone-2:');
    }
}

module.exports = SetTagCommand;
