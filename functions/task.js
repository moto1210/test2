function handle_Task() {
    console.log('こんにちわわ');
  }
  //     const userId = event.source.userId;
  //     if (!userStates[userId]) {
  //         userStates[userId] = { stage: 'idle' };
  //     }
  
  //     switch (userStates[userId].stage) {
  //         case 'idle':
  //             userStates[userId] = { stage: 'waiting_for_subject' };
  //             return client.replyMessage(event.replyToken, { type: 'text', text: '科目名を入力してください。' });

  //         case 'waiting_for_subject':
  //             userStates[userId] = { stage: 'waiting_for_assignment', subject: event.message.text };
  //             return client.replyMessage(event.replyToken, { type: 'text', text: '課題の内容を入力してください。' });
  
  //         case 'waiting_for_assignment':
  //             userStates[userId] = { ...userStates[userId], stage: 'waiting_for_due_date', assignment: event.message.text };
  //             return client.replyMessage(event.replyToken, { type: 'text', text: '提出日時を入力してください。' });
  
  //         case 'waiting_for_due_date':
  //             // ここで課題データを保存するロジックを追加
  //             userStates[userId] = { stage: 'idle' };
  //             return client.replyMessage(event.replyToken, { type: 'text', text: '課題が追加されました。' });
  
  //         default:
  //             return client.replyMessage(event.replyToken, { type: 'text', text: 'エラーが発生しました。' });
  //     }
  // }
  
  module.exports = { handle_Task };