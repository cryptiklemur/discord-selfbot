const AbstractCommand = require('./AbstractCommand');

class EvalCommand extends AbstractCommand {
    get regex() { return /^eval (--hide )?([\S\s]+)$/i; }

    handle(message, matches) {
        if (this.isPrivate(message)) {
            return;
        }

        if (message.author.id !== this.bot.config.admin) {
            return;
        }

        if (matches[1]) {
            this.deleteMessage(message);
        }

        this.createMessage(message.channel, 'Executing code')
            .then(msg => {
                let response,
                    channel = message.channel,
                    server  = channel.guild,
                    author  = message.author;

                try {
                    response = eval(matches[2]);
                } catch (error) {
                    response = error.message;
                }

                if (Array.isArray(response) || typeof response === 'object') {
                    response = JSON.stringify(response);
                }

                this.editMessage(msg, "\nResult for evaluated code: \n\n```\n" + response + "\n```")
                    .catch(error => {
                        console.error(error);
                        console.error("Failed updating message for eval");
                        this.createMessage(channel, "Error with eval. Check logs.");
                    });
            })
    }
}

module.exports = EvalCommand;
