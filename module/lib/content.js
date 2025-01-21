function checkMessageContent(targetMessage) {
    const issues = [];
  
    if (targetMessage.poll) {
      issues.push('投票');
    }
  
    if (!targetMessage.content) {
      if (targetMessage.embeds.length > 0) {
        issues.push('埋め込みメッセージ');
      }
      if (targetMessage.attachments.size > 0) {
        issues.push('添付ファイル');
      }
    }
  
    return issues;
  }
  
  module.exports = { checkMessageContent };  