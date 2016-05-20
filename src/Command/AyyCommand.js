const AbstractCommand = require('./AbstractCommand'),
      _ = require('lodash');

class AyyCommand extends AbstractCommand {
    get regex() { return  /^ayy+$/i; }
    
    get prefixed() { return false; }

    handle(message) {
        this.reply(message, 'lmao');
    }
}

module.exports = AyyCommand;
