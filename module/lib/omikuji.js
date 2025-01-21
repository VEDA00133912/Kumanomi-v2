const { Omikuji } = require('../../file/setting/mongodb');
const schedule = require('node-schedule');

const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉", "凶", "大凶"];
const specialFortune = "くまのみ大大吉";

schedule.scheduleJob({ hour: 0, minute: 0, tz: 'Asia/Tokyo' }, async () => {
    try {
        await Omikuji.deleteMany();
        console.log('おみくじの結果をリセットしました');
    } catch (error) {
        console.error('おみくじリセットエラー:', error);
    }
});

async function getRandomFortune(userId) {
    try {
        const existingFortune = await Omikuji.findOne({ userId });
        if (existingFortune) {
            return { result: existingFortune.result, alreadyDrawn: true };
        }

        let result;
        const random = Math.random();
        if (random < 0.01) {
            result = specialFortune;
        } else {
            result = fortunes[Math.floor(Math.random() * fortunes.length)];
        }

        const newFortune = new Omikuji({ userId, result });
        await newFortune.save();

        return { result, alreadyDrawn: false };
    } catch (error) {
        console.error('おみくじ取得エラー:', error);
        throw new Error('おみくじの取得に失敗しました。');
    }
}

module.exports = {
    getRandomFortune,
    specialFortune,
};