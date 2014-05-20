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

bot.addListener('error', function(message) {
    console.log('error: ', message);
});

bot.addListener("message#", function(sender, channel, text, message) {
    var cmds = text.split(" ");
    if(cmds[0].lastIndexOf(config.botName, 0) != 0) {
        return;
    }
    if(cmds[1] == "join") {
        if(sender != "treestompz") { return; }
        if(cmds.length != 3) {
            bot.say(channel, sender + ", please use: join <channel>");
            return;
        }
        bot.join(cmds[2]);
    } else if(cmds[1] == "stop") {
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
    } else if(cmds[1] == "list") {
        shell.exec("screen -ls", function(code, output) {
            var letters = output.split("");
            var screens = [];
            for(var i = 0; i < letters.length; i++) {
                var letter = parseInt(letters[i]);
                // If it is a number
                if(!isNaN(letter)) {
                    // If the next letter is a .
                    if(letters[i + 1] == ".") {
                        // What comes next is the screen name   
                        i += 2;
                        var screenname = "";
                        while(letters[i] != "(") {
                            screenname += letters[i];
                            i++;
                        }
                        screens.push(" " + screenname.trim());
                    }
                }
            }
            bot.say(channel, "Screens:" + screens);
        });
    }
})