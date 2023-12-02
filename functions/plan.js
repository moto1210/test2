function processPlan(event){
    if (event.message.text === "明日") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const month = tomorrow.getMonth() + 1;
        const day = tomorrow.getDate();
        
        const responseText = `${month}月${day}日9時`;
        return client.replyMessage(event.replyToken, {
        type: 'text',
        text: responseText,
        });
        }
}

    return Promise.resolve(null);