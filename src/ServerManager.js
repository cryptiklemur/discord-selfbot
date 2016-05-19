const fs = require('fs');

class ServerManager {
    constructor(client, guild) {
        this.client = client;
        this.guild  = guild;
        this.configFileName = this.client.config.config_dir + '/' + guild.id + '.json';

        this.loadConfig();
    }

    loadConfig() {
        return new Promise(resolve => {
            fs.readFile(this.configFileName, (err, data) => {
                if (err) {
                    this.config = {
                        id:       this.guild.id,
                        joinDate: Date.now(),
                        enabled:  false
                    };

                    this.saveConfig();
                } else {
                    this.config = JSON.parse(data);
                }

                resolve(this.config);
            });
        });
    }

    isEnabled() {
        return this.config && this.config.enabled;
    }

    saveConfig() {
        fs.writeFile(this.configFileName, JSON.stringify(this.config, null, 4));
    }
}

module.exports = ServerManager;
