'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require("fs");
const lit = require("./lit");
const admin = require("firebase-admin"); //いじらなくていい
const moment = require("moment");
//const task = require("./task.js");
// const userStates = {};

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
  const status_tDoc = await userRef.collection("status_t").doc("statusid").get();
  const status_tData = status_tDoc.data();

  const inputText = event.message.text;

  if (event.message.text === '課題') {
  await userRef
  .collection("status_t")
  .doc("statusid")
  .set({
    stage: "subname",
    paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
  });
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text:  "課題名を入力"  //実際に返信の言葉を入れる箇所
  });
  }


  if (status_tData.stage === "subname"){
    const newsubPlanRef = await userRef.collection("subplan").add({
      sub: inputText,
      date_p: null,
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    const newsubPlanId = newsubPlanRef.id;

    const subplanDoc = await userRef.collection("subplan").doc(newsubPlanId).get();
    const subplanData = subplanDoc.data();
    await userRef
    .collection("status_t")
    .doc("statusid")
    .set({
      stage: "subdate",
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    await userRef
    .collection("use_id")
    .doc("useid")
    .set({
      id: newsubPlanId,
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text:  subplanData.sub + "の提出期限を入力　例「5日12時」"  //実際に返信の言葉を入れる箇所
    });
  }
  if (status_tData.stage === "subdate"){
    const useidDoc = await userRef.collection("use_id").doc("useid").get();
    const useid = useidDoc.data();

    await userRef.collection("subplan").doc(useid.id).update({
      date_p: inputText,
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    const subplanDoc = await userRef.collection("subplan").doc(useid.id).get();
    const subplanData = subplanDoc.data();
    await userRef
    .collection("status_t")
    .doc("statusid")
    .set({
      stage: "subname",
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    await userRef
    .collection("status_t")
    .doc("statusid")
    .set({
      stage: "subname",
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text:  subplanData.sub + "　" + subplanData.date_p  //実際に返信の言葉を入れる箇所
    });
  }

  if (event.message.text === "予定"){
  await userRef
  .collection("status")
  .doc("statusid")
  .set({
    status: "planing",
    paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
  });
  return client.replyMessage(event.replyToken, {
      type: 'text',
      text:  "イベント名を入力"  //実際に返信の言葉を入れる箇所
  });
  }
  if(statusData.status === "planing"){
    const newPlanRef = await userRef.collection("plan").add({
      planname: inputText,
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    const newPlanId = newPlanRef.id;
    const planDoc = await userRef.collection("plan").doc(newPlanId).get();
    const planData = planDoc.data();

    await userRef
    .collection("status")
    .doc("statusid")
    .set({
      status: "dateing",
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text:  planData.planname + "の日程を入力　例「5日12時」"  //実際に返信の言葉を入れる箇所
    });
  }
  if (statusData.status === "dateing"){
    const newDateRef = await userRef.collection("date").add({
      date: inputText,
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    const newDateId = newDateRef.id;
    const dateDoc = await userRef.collection("date").doc(newDateId).get();
    const dateData = dateDoc.data();
    await userRef
    .collection("status")
    .doc("statusid")
    .set({
      status: "setting",
      paymentDate: admin.firestore.Timestamp.fromDate(moment().toDate()),
    });
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: dateData.date + "に通知をおくるね！！"//実際に返信の言葉を入れる箇所
    })
  }
  if (event.message.text === "もとた"){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "予定：もとたに１票いれる" //実際に返信の言葉を入れる箇所
    })
  }
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: "予定また課題と入力してください" //実際に返信の言葉を入れる箇所
  })
}
exports.app = functions.https.onRequest(app);