const AbstractCommand = require('./AbstractCommand'),
      _ = require('lodash');

class GetTagCommand extends AbstractCommand {
    get regex() { return  /^tag ([A-Za-z0-9-_]+)$/i; }

    handle(message, matches) {
        if (this.isPrivate(message)) {
            return;
        }

        let config = this.getServerConfigFromMessage(message);
        if (config.tags === undefined) {
            return this.createMessage(message.channel, 'There are no tags for this server.');
        }

        if (!config.tags[matches[1]]) {
            return this.createMessage(message.channel, 'There is no tag with that name.');
        }

        this.createMessage(message.channel, config.tags[_.trim(matches[1])]);
    }
}

module.exports = GetTagCommand;
