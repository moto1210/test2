'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require("fs");
const lit = require("./lit");
const admin = require("firebase-admin"); //いじらなくていい
const moment = require("moment");
const task = require("./task.js");
const userStates = {};

const config = {
    channelSecret: 'badbdad140490d078833ba25e0bb1981',
    channelAccessToken: 'OrKaiJAsL79wS/IZkFn5iq7Hc2nqffm7Jxpuw59Pb0DRv7R11MU2NXI4EeyY2tE32oQUzVBV1hTKPa3H6BDtDE78K0Z7LwAfU7K03w0bZOyJ6/msk5PKDxyuuInAqMNGZoPePUAKDwyC9Xn3q8B9LQdB04t89/1O/w1cDnyilFU='
};

const app = express();

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

//ここまでは変わらず

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }
  const userId = event.source.userId;
  if (userId == null) return Promise.resolve(null); 
  const userRef = admin.firestore().collection("user").doc(userId);

  const user = await userRef.get();
  if (!user.exists) {
    await admin.firestore().collection("user").doc(userId).set({});
  }
  const statusDoc = await userRef.collection("status").doc("statusid").get();
  const statusData = statusDoc.data();

  const planname = event.message.text;

  if (event.message.text === '課題') {
    return task.handle_Task(event, client, userStates);
  }
  if (statusData.status === null){
    await userRef
    .collection("status")
    .doc("statusid")
    .set({
      status: "setting",
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    }
    else if (event.message.text === "予定" && statusData.status == "setting"){
        await userRef
        .collection("plan")
        .add({
          planname: planname,
          paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
        });
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: statusData.status + "の日程を入力"  //実際に返信の言葉を入れる箇所
        });
  }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: "予定また課題と入力してください" //実際に返信の言葉を入れる箇所
  })
}

exports.app = functions.https.onRequest(app);
