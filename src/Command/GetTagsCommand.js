const AbstractCommand = require('./AbstractCommand');

class GetTagsCommand extends AbstractCommand {
    get regex() { return  /^tag(s)?$/i; }

    handle(message, matches) {
        if (this.isPrivate(message)) {
            return;
        }

        let config = this.getServerConfigFromMessage(message);
        if (config.tags === undefined) {
            return this.createMessage(message.channel, 'There are no tags for this server.');
        }

        this.createMessage(message.channel, "Current Tags: " + Object.keys(config.tags).join(', '));
    }
}

module.exports = GetTagsCommand;
