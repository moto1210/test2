const index = require("./index.js");

function handle_Task(event, client, status_tData) {
    const userId = event.source.userId;
    if (userId == null) return Promise.resolve(null); 
    const userRef = admin.firestore().collection("user").doc(userId);
  
    const user = userRef.get();
    if (!user.exists) {
      admin.firestore().collection("user").doc(userId).set({});
    }
    const planname = event.message.text;
//   const userId = event.source.userId;
//   if (!userStates[userId]) {
//       userStates[userId] = { stage: 'idle' };
//   }
  switch (status_tData.stage) {
      case "subject":
        userRef
        .collection("status_t")
        .doc("statusid")
        .set({
          stage: "info",
          paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
        });
          return client.replyMessage(event.replyToken, { type: 'text', text: '課題名を入力してください。' });
      case "info":
          // 課題の内容を保存
        userRef
        .collection("status_t")
        .doc("statusid")
        .set({
            stage: "wait_date",
            paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
          });
          return client.replyMessage(event.replyToken, { type: 'text', text: '提出日時を入力してください。' });
      case "wait_date":
        userRef
        .collection("status_t")
        .doc("statusid")
        .set({
          stage: "subject",
          paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
        });
          // ここで課題データを保存するロジックを追加
          return client.replyMessage(event.replyToken, { type: 'text', text: "成功" });
      default:
          return client.replyMessage(event.replyToken, { type: 'text', text: 'エラーが発生しました。' });
  }
}

module.exports = { handle_Task };