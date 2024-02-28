const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const User = require('./model/Users')
dotenv.config({ path: './config/config.env' });

const app = express();
const botToken = process.env.BOT_TOKEN;  // Please Put your own BOT_TOKEN
const bot = new TelegramBot(botToken, { polling: true });

app.post(`/telegram/${botToken}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const name = msg.from.username || msg.from.first_name;
    
    bot.sendMessage(chatId, 'Welcome! Please provide your city and country:');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id;
    const text = msg.text;
    
    const user = await User.findOne({ telegramId });
    
    if (!user && text.includes(',')) {
        const [city, country] = text.split(',').map(s => s.trim());
        
        const newUser = new User({
            telegramId,
            name: msg.from.first_name,
            city,
            country
        });
        
        try {
            await newUser.save();
            bot.sendMessage(chatId, 'Thank you! Your information has been saved.');
        } catch (error) {
            console.error('Error saving user information:', error);
            bot.sendMessage(chatId, 'Oops! Something went wrong. Please try again later.');
        }
    } else {
        bot.sendMessage(chatId, 'Please provide your city and country in the correct format (e.g., City, Country).');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
