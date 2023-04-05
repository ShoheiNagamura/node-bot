const https = require("https")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3001
const TOKEN = "rlWgREj4WwvTHV37sQEzUWv1KomK1mPnp7QtrpM7ZCZ+ck6ra73RdGyr+Cv+LWxeZ8CT9x3XAD+jx+GI9ml73d++x/GiIh6PIjF27ZFp/vs9JDAfR/Zkcc5uDxV3qpOhzwHbiURqkTdS7uEHJrNgTgdB04t89/1O/w1cDnyilFU=";

const cron = require('node-cron');
const request = require('request');

const axios = require('axios');
const csvtojson = require('csvtojson')


// const spreadsheetId = '1aYhwJAmP6dafQCxPcOV0iGFPmAEZwfpzVtvNvWsYgPo'; //追記
// const range = 'Sheet1!A1:B2'; //追記


app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// スプレッドシートのデータを保持する変数
let sheetData;

//定期通知関数
function sendNotification() {
    sheetData = "";
    console.log('test定期実行1');

    // sheetData が未定義の場合、スプレッドシートのデータを取得して sheetData に代入する
    if (!sheetData) {
        axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRFI98A5rPx4jcdCl4kqV3GVW5FDaIPjwoQACm3Wtnvbx0h3-QGUY7iB46_giXpAOd13gBm7Q1G92CJ/pub?output=csv')
            .then(function (response) {
                // 読み込んだデータをJSONに変換して sheetData に代入する
                csvtojson({
                    noheader: false,  // 1行目がヘッダーの場合はfalse
                    output: "csv"
                })
                    .fromString(response.data)
                    .then((csvRow) => {
                        sheetData = csvRow;
                    })
            })
            .catch(function (error) {
                console.log(error);
            });
        return;
    }

    console.log(sheetData[0][2]);
    const options = {
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
        },
        json: {
            to: 'U702207f57cdec590f64165c6c227900d',
            messages: [
                {
                    type: 'text',
                    text: sheetData[0][2]
                }
            ]
        }
    };

    request(options, (error, response, body) => {
        console.log(response.body);
        if (error) {
            console.error(error);
        }
    });



    // ②
    // console.log('test定期実行1');
    // axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRFI98A5rPx4jcdCl4kqV3GVW5FDaIPjwoQACm3Wtnvbx0h3-QGUY7iB46_giXpAOd13gBm7Q1G92CJ/pub?output=csv')
    //     .then(function (response) {
    //         // 読み込んだデータをJSONに変換
    //         csvtojson({
    //             noheader: true,  // 1行目がヘッダーの場合はfalse
    //             output: "csv"
    //         })
    //             .fromString(response.data)
    //             .then((csvRow) => {
    //                 console.log(csvRow[0][2]);
    //                 const options = {
    //                     url: 'https://api.line.me/v2/bot/message/push',
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                         'Authorization': 'Bearer ' + TOKEN,
    //                     },
    //                     json: {
    //                         to: 'U702207f57cdec590f64165c6c227900d',
    //                         messages: [
    //                             {
    //                                 type: 'text',
    //                                 text: csvRow[0][2]
    //                             }
    //                         ]
    //                     }
    //                 };
    //                 request(options, (error, response, body) => {
    //                     console.log(response.body);
    //                     if (error) {
    //                         console.error(error);
    //                     }
    //                 });
    //             })
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });


    // ①
    // axios でスプレッドシートのURLからCSV形式で取得
    // axios.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRFI98A5rPx4jcdCl4kqV3GVW5FDaIPjwoQACm3Wtnvbx0h3-QGUY7iB46_giXpAOd13gBm7Q1G92CJ/pub?output=csv')
    //     .then(function (response) {
    //         // 読み込んだデータをJSONに変換
    //         csvtojson({
    //             noheader: true,  // 1行目がヘッダーの場合はfalse
    //             output: "csv"
    //         })
    //             .fromString(response.data)
    //             .then((csvRow) => {
    //                 // console.log(csvRow[0]);
    //                 console.log(csvRow[0][2]);
    //             })
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     })
    //     .finally(function () {

    //     });




    // const options = {
    //     url: 'https://api.line.me/v2/bot/message/push',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': 'Bearer ' + TOKEN,
    //     },
    //     json: {
    //         to: 'U702207f57cdec590f64165c6c227900d',
    //         messages: [
    //             {
    //                 type: 'text',
    //                 text: csvRow[0][2]
    //                 // text: '定期通知です。'
    //             }
    //         ]
    //     }
    // };
    // request(options, (error, response, body) => {
    //     console.log(response.body);
    //     if (error) {
    //         console.error(error);
    //     }
    // });
}

// 定期関数呼び出し
cron.schedule('*/30 * * * * *', () => {
    sendNotification();
}, {
    timezone: 'Asia/Tokyo'
});



// app.get("/", (req, res) => {
//     res.sendStatus(200)
// })

// app.post("/webhook", function (req, res) {
//     res.send("HTTP POST request sent to the webhook URL!")
//     // ユーザーがボットにメッセージを送った場合、返信メッセージを送る
//     if (req.body.events[0].type === "message") {

//         const userMessage = req.body.events[0].message.text;

//         // ユーザーから送られたメッセージによって返信内容を生成
//         let replyMessages = [];
//         if (userMessage === "こんにちは") {
//             replyMessages.push({
//                 "type": "text",
//                 "text": "こんにちは！"
//             });
//         } else if (userMessage === "おはよう") {
//             replyMessages.push({
//                 "type": "text",
//                 "text": "おはようございます！"
//             });
//         } else {
//             replyMessages.push({
//                 "type": "text",
//                 "text": "よくわかりません。"
//             });
//         }

//         // 文字列化したメッセージデータ
//         const dataString = JSON.stringify({
//             replyToken: req.body.events[0].replyToken,
//             messages: replyMessages
//         })


//         // // 文字列化したメッセージデータ
//         // const dataString = JSON.stringify({
//         //     replyToken: req.body.events[0].replyToken,
//         //     messages: [
//         //         {
//         //             "type": "text",
//         //             "text": "Hello, user"
//         //         },
//         //         {
//         //             "type": "text",
//         //             "text": "May I help you?"
//         //         }
//         //     ]
//         // })

//         // リクエストヘッダー
//         const headers = {
//             "Content-Type": "application/json",
//             "Authorization": "Bearer " + TOKEN
//         }

//         // リクエストに渡すオプション
//         const webhookOptions = {
//             "hostname": "api.line.me",
//             "path": "/v2/bot/message/reply",
//             "method": "POST",
//             "headers": headers,
//             "body": dataString
//             // "data": dataString
//         }

//         // リクエストの定義
//         const request = https.request(webhookOptions, (res) => {
//             res.on("data", (d) => {
//                 process.stdout.write(d)
//             })
//         })

//         // エラーをハンドル
//         request.on("error", (err) => {
//             console.error(err)
//         })

//         // データを送信
//         request.write(dataString)
//         request.end()
//     }
// })

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})