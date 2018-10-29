const TelegramBot = require('node-telegram-bot-api');
const Pib = require('./models/Pib');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pibs123', { useNewUrlParser: true });

const token = '737953505:AAF-zJxTAb8-iav2v3EfAyF_KwnZqEGT9HI';

 const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, function(msg, match){
    bot.sendMessage(msg.chat.id, msg.from.first_name + ' ' + msg.from.last_name + ', hello!');
    bot.sendMessage(msg.chat.id, 'Write /help');
});

bot.onText(/\/help/, function(msg, match){
    bot.sendMessage(msg.chat.id, '/create <date>^<text>');
    bot.sendMessage(msg.chat.id, '/all');
    bot.sendMessage(msg.chat.id, '/delete <id>');
   
});

bot.onText(/\/create (.+)/, async function(msg, match){
   let authorId = msg.from.id;
   let chatId = msg.chat.id;
   let fullText = match[1].split('^');
   let date = new Date(fullText[0]);
   let text = fullText[1];
   date.setUTCHours(date.getUTCHours() + 3);
   let pib = await Pib.create({
       text: text,
       authorId: authorId,
       chatId: chatId,
       date: date,
       checked: false
   });
   bot.sendMessage(chatId, 'Pib created!');

});

bot.onText(/\/all/,async function(msg, match){
    let pibs = await Pib.find({checked: false, authorId: msg.from.id});
    bot.sendMessage(msg.chat.id, pibs+':(');
});
bot.onText(/\/delete (.+)/,async function(msg, match){
    await Pib.findByIdAndRemove(match[1]);
    bot.sendMessage(msg.chat.id, 'Removed!');
});

setInterval(async function(){
    let date = new Date();
    date.setUTCHours(date.getUTCHours() + 3);
    let pibs = await Pib.find({checked: false, date: {$lte: date}});
    await Pib.update({_id: pibs},{checked: true},{multi:true});
    for(const pib of pibs){
        bot.sendMessage(pib.chatId, pib.text)
    }
}, 5000);

