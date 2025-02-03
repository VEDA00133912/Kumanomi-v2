const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, userMention } = require("discord.js");
const cooldown = require('../../event/other/cooldown');
const buttonPages = require('../../event/interactionCreate/pagination');
const { createEmbed } = require('../../lib/embed');
const config = require('../../../file/setting/config.json');

module.exports = {
       data: new SlashCommandBuilder()
             .setName('help')
             .setDescription('くまのみBOTのヘルプを表示します。')
             .setContexts(InteractionContextType.Guild)
             .setIntegrationTypes(ApplicationIntegrationType.GuildInstall),

       async execute(interaction) {
        if (cooldown(this.data.name, interaction)) return;

              const commands = await interaction.client.application.commands.fetch();
              const commandMap = new Map(commands.map(cmd => [cmd.name, cmd.id]));

               const embed1 = createEmbed(interaction)
                   .setDescription('**くまのみぼっと｜ヘルプ**')
                   .setThumbnail(interaction.client.user.displayAvatarURL())
                   .addFields(
                     { name: 'くまのみぼっとについて', value: '暇な音ゲーマーの作ってる多機能botです' },
                     { name: '新機能のおしらせチャンネルについて', value: 'サポートサーバーのアナウンスチャンネルをフォローすることでおしらせを受け取れます' },
                     { name: 'helpの操作方法', value: 'ボタンを押すことでコマンド一覧等が見れます' },
                     { name: 'サイト', value: '[くまのみぼっと公式サイト](https://veda00133912.github.io/kumanomi-site/)' },
                     { name: 'サポート等', value: '<:twitter:1282701797353459799> [twitter](https://twitter.com/ryo_001339)  <:discord:1282701795000320082> [Discord](https://discord.gg/j2gM7d2Drp)  <:github:1282850416085827584> [Github](https://github.com/VEDA00133912/KumanomiBOT)' },
                     { name: '制作者', value: `${userMention(config.ownerId)} (ryo_001339)` }
                   );

               const getCommandField = (name, description) => {
                   const commandId = commandMap.get(name);
                   return { name: `</${name}:${commandId}>`, value: description };
               };
              const infoCommandId = commandMap.get('info') || 'unknown_id';
              const searchCommandId = commandMap.get('search') || 'unknown_id';
              const selectCommandId = commandMap.get('select') || 'unknown_id';
             
               const embed2 = createEmbed(interaction)
               .setDescription('**くまのみBOT｜ヘルプ**')
               .setThumbnail(interaction.client.user.displayAvatarURL())
               .addFields(
                getCommandField('help', 'helpメッセージを表示するコマンド'),
                getCommandField('icon', '指定した人のアイコンを表示するコマンド'),
                getCommandField('5000choyen', '5000兆円欲しい!!ジェネレータ'),
                getCommandField('delete', 'メッセージ削除コマンド'),
                getCommandField('setting-expand', 'メッセージリンクの自動展開設定コマンド'),
                getCommandField('setting-slowmode', '低速モードの設定コマンド'),
                getCommandField('spoofing', '他ユーザーに自由になりすましできるコマンド')
            );

            const embed3 = createEmbed(interaction)
            .setDescription('くまのみBOT｜ヘルプ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: `</select taiko:${selectCommandId}>`, value: '太鼓の達人ランダム選曲コマンド' },
                { name: `</select prsk:${selectCommandId}>`, value: 'プロセカランダム選曲コマンド' },
                { name: `</select chunithm:${selectCommandId}>`, value: 'チュウニズムランダム選曲コマンド' },
                { name: `</select ongeki:${selectCommandId}>`, value: 'オンゲキランダム選曲コマンド' },
                { name: `</select maimai:${selectCommandId}>`, value: 'maimaiランダム選曲コマンド' },
                { name: `</select polaris:${selectCommandId}>`, value: 'ポラリスコードランダム選曲コマンド' },
                { name: `</select yumesute:${selectCommandId}>`, value: 'ユメステランダム選曲コマンド' },
            )

            const embed4 = createEmbed(interaction)
            .setDescription('くまのみBOT｜ヘルプ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                getCommandField('ban', 'BANコマンド'),
                getCommandField('kick', 'キックコマンド'),
                getCommandField('unban', 'BAN解除コマンド'),
                getCommandField('hiroyuki', 'ひろゆきボイスのmp3で出力するコマンド'),
                getCommandField('gaster', 'ガスター語変換コマンド'),
                getCommandField('rune', 'ルーン文字変換コマンド'),
                getCommandField('translate', '他言語翻訳コマンド')
            )

            const embed5 = createEmbed(interaction)
            .setDescription('くまのみBOT｜ヘルプ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                getCommandField('spoofing', '他のユーザーになりすましてメッセージ送信するコマンド'),
                getCommandField('dice', '多面ダイスコマンド'),
                getCommandField('embedbuilder', '埋め込みを作成するコマンド'),
                getCommandField('emozip', 'サーバー内の絵文字をzip形式で出力するコマンド'),
                getCommandField('omikuji', 'おみくじを引くコマンド'),
                getCommandField('invite', 'BOTの招待リンク表示コマンド'),
                getCommandField('generater', '画像ジェネレーターコマンド'),
            )
            
            const embed6 = createEmbed(interaction)
            .setDescription('くまのみBOT｜ヘルプ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                getCommandField('ticket', 'チケット用ボタン作成コマンド'),
                getCommandField('timer', 'タイマーコマンド'),
                getCommandField('totsu-shi', '突然の死ジェネレーターコマンド'),
                getCommandField('hash', 'ハッシュ化コマンド'),
                { name: `</info server:${infoCommandId}>`, value: 'サーバー情報表示コマンド' },
                { name: `</info user:${infoCommandId}>`, value: 'ユーザー情報表示コマンド' },
                { name: `</info system:${infoCommandId}>`, value: 'BOTのサーバー情報表示コマンド' },
            )

            const embed7 = createEmbed(interaction)
            .setDescription('くまのみBOT｜ヘルプ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                getCommandField('ping', 'BOTのping値を表示するコマンド'),
                getCommandField('qr', 'URLをQRコードに変換するコマンド'),
                getCommandField('nitro', '偽Nitroリンクを生成するコマンド'),
                getCommandField('top', 'チャンネルの一番最初のメッセージを表示するコマンド'),
                getCommandField('yahoonews', 'Yahooニュースをランダムに表示するコマンド'),
                { 'name': `</search redirect:${searchCommandId}>`, 'value': 'URLのリダイレクト先調査コマンド' },
                { 'name': `</search npm:${searchCommandId}>`, 'value': 'NPMパッケージ検索コマンド' },
            )

            const embed8 = createEmbed(interaction)
            .setColor('#70db9b')
            .setDescription('くまのみBOT｜ヘルプ')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .addFields(
                { name: '**Make it a Quote(モノクロ)**', value: 'モノクロのMiQ画像を生成するコンテキストメニュー' },
                { name: '**Make it a Quote(カラー)**', value: 'カラーのMiQ画像を生成するコンテキストメニュー' },
                { name: '**日本語に翻訳**', value: 'DeepLで日本語に翻訳するコンテキストメニュー' },
                { name: '**英語に翻訳**', value: 'DeepLで英語に翻訳するコンテキストメニュー' },
                getCommandField('admin-leave', '[管理者専用]サーバー退出コマンド'),
                getCommandField('admin-serverlist', '[管理者専用]参加サーバー一覧表示コマンド')
            )
            const pages = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8];
            await buttonPages(interaction, pages);
    },
};