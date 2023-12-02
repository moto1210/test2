'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require("fs");

const WIDTH = 2500;
const HEIGHT = 1686;
const config = {
    channelSecret: 'badbdad140490d078833ba25e0bb1981',
    channelAccessToken: 'OrKaiJAsL79wS/IZkFn5iq7Hc2nqffm7Jxpuw59Pb0DRv7R11MU2NXI4EeyY2tE32oQUzVBV1hTKPa3H6BDtDE78K0Z7LwAfU7K03w0bZOyJ6/msk5PKDxyuuInAqMNGZoPePUAKDwyC9Xn3q8B9LQdB04t89/1O/w1cDnyilFU='
};

const client = new line.Client(config);

client.createRichMenu({
  "size": {
      "width": WIDTH,
      "height": HEIGHT
  },
  "selected": false,
  "name": "よりみちプログラミング",
  "chatBarText": "メニュー",
  "areas": [
      {
          "bounds": {
              "x": 0,
              "y": 0,
              "width": WIDTH / 2,
              "height": HEIGHT
          },
          "action": {
              "type": "message",
              "text": "課題"
          },
      },
      {
          "bounds": {
              "x": (WIDTH / 2) * 1,
              "y": 0,
              "width": WIDTH / 2,
              "height": HEIGHT
          },
          "action": {
              "type": "message",
              "text": "予定"
          },
      },
  ]
})
.then(async (richMenuId) => {
  const buffer = await fs.createReadStream('./../assets/image_02.png');
  await client.setRichMenuImage(richMenuId, buffer);
  await client.setDefaultRichMenu(richMenuId);
})
.catch(e => {
    console.error('Error:', e.message);
})