function handle_Task(event, client, userStates) {
  const userId = event.source.userId;
  if (!userStates[userId]) {
      userStates[userId] = { stage: 'idle' };
  }

  switch (userStates[userId].stage) {
      case 'idle':
          userStates[userId] = { stage: 'waiting_for_subject' };
          return client.replyMessage(event.replyToken, { type: 'text', text: '科目名を入力してください。' });

      case 'waiting_for_subject':
          // 科目名を保存
          userStates[userId] = { ...userStates[userId], stage: 'waiting_for_assignment', subject: event.message.text };
          return client.replyMessage(event.replyToken, { type: 'text', text: '課題の内容を入力してください。' });

      case 'waiting_for_assignment':
          // 課題の内容を保存
          userStates[userId] = { ...userStates[userId], stage: 'waiting_for_due_date', assignment: event.message.text };
          return client.replyMessage(event.replyToken, { type: 'text', text: '提出日時を入力してください。' });

      case 'waiting_for_due_date':
          // 提出日時を保存し、課題データを保存するロジックを追加
          userStates[userId] = { ...userStates[userId], due_date: event.message.text, stage: 'idle' };
          // ここで課題データを保存するロジックを追加
          return client.replyMessage(event.replyToken, { type: 'text', text: '課題が追加されました。' });

      default:
          return client.replyMessage(event.replyToken, { type: 'text', text: 'エラーが発生しました。' });
  }
}

module.exports = { handle_Task };