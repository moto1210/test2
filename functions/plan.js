//予定を管理する関数
async function handle_plan(event, client, admin) {
    const userId = event.source.userId;
    const userRef = admin.firestore().collection("users").doc(userId);
    const statusDoc = await userRef.collection("status").doc("statusid").get();
    let statusData = statusDoc.exists ? statusDoc.data() : { status: 'none' };

    switch (statusData.status) {
        case 'none':
            await userRef.collection("status").doc("statusid").set({
                status: "planing",
                paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
            });
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: "イベント名を入力"  // ユーザーにイベント名の入力を促す
            });

        case 'planing':
            const newPlanRef = await userRef.collection("plan").add({
                planname: event.message.text,
                paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
            });
            await userRef.collection("status").doc("statusid").set({
                status: "dateing",
                paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
            });
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: event.message.text + "の日程を入力　例「5日12時」"  // ユーザーに日程の入力を促す
            });

        case 'dateing':
            await userRef.collection("date").add({
                date: event.message.text,
                paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
            });
            await userRef.collection("status").doc("statusid").set({
                status: "setting",
                paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
            });
            return client.replyMessage(event.replyToken, {
                type: 'text',
                text: event.message.text + "に通知をおくるね！"  // ユーザーに通知を送ることを伝える
            });

        // 他のステータスに応じた処理が必要な場合はここに追加
    }
}

module.exports = { handle_plan };
