var config = {
    channels: ["#treestompz"],
    server: "irc.esper.net",
    botName: "treebot"
};

var shell = require('shelljs');
var irc = require('irc');

var bot = new irc.Client(config.server, config.botName, {
    channels: config.channels
});

bot.addListener("message#", function(sender, channel, text, message) {
    var cmds = text.split(" ");
    if(cmds[0].lastIndexOf(config.botName, 0) != 0) {
        return;
    }
    if(cmds[1] == "stop") {
        if(cmds.length != 3) {
            bot.say(channel, sender + ", please use: stop <screen>");
            return;
        }
        shell.exec("screen -S " + cmds[2] + " -X stuff \"`printf \"stop\r\"`\";", function(code, output) {
            if(code == 0) {
                bot.say(channel, "Stopping " + cmds[2] + "...");
            }
            else if(code == 1) {
                bot.say(channel, sender+": " + output);
            }
        });
    }
})