'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require("fs");
const plan = require("./plan");
const lit = require("./lit");
const task = require("./task");

const config = {
    channelSecret: 'badbdad140490d078833ba25e0bb1981',
    channelAccessToken: 'OrKaiJAsL79wS/IZkFn5iq7Hc2nqffm7Jxpuw59Pb0DRv7R11MU2NXI4EeyY2tE32oQUzVBV1hTKPa3H6BDtDE78K0Z7LwAfU7K03w0bZOyJ6/msk5PKDxyuuInAqMNGZoPePUAKDwyC9Xn3q8B9LQdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)'));
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

let count = 0;
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  if (event.message.text === "課題"){
    return task.processTask();
  }
  
  if(event.message.text === "予定"){
    count = 1;
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "予定を入力してください。例「12日15時」「15時」「明日」キャンセルの場合「キャンセル」" //実際に返信の言葉を入れる箇所
      })
  }
  if (event.message.text === "明日" && count === 1) {
    count = 0;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    
    const responseText = `${month}月${day + 1}日21時`;
    return client.replyMessage(event.replyToken, {
    type: 'text',
    text: responseText,
    });
    }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text //実際に返信の言葉を入れる箇所
    });
}

exports.app = functions.https.onRequest(app);



