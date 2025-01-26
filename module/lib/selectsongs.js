const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const config = require('../../file/setting/url.json');
const { selectionMap } = require('../../file/setting/select.js');

module.exports = {
  async getRandomSongs(interaction, commandName, folder, option, count, embedColor) {
    const apiUrl = `${config.main_API}/randomsongs/${folder}/${option}/${count}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.status !== 200) {
        return interaction.editReply(
          `<:error:1299263288797827185> ランダム選曲に失敗しました`
        );
      }

      const selectedSongs = data.songs;

      if (!selectedSongs || selectedSongs.length === 0) {
        return interaction.editReply(
          '<:error:1299263288797827185> 指定されたオプションに対応する曲が見つかりませんでした'
        );
      }

      const optionLabel = selectionMap[option] || option;
      const embed = new EmbedBuilder()
        .setTitle(`ランダム選曲の結果 (${optionLabel}・${selectedSongs.length} 曲)`)
        .setDescription(`${selectedSongs.join('\n')}`)
        .setTimestamp()
        .setFooter({
          text: `Kumanomi | ${commandName}`,
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setColor(embedColor);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const slashcommandError = require('../../error/slashcommand');
      slashcommandError(interaction.client, interaction, error);
    }
  },
};