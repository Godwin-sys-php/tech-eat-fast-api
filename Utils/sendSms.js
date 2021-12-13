const fetch = require("node-fetch");
const crypto = require("crypto");

module.exports = (phoneNumber, content) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const appId = "seVEq0IM";
  const apiKey = "nBHHcEPG";
  const apiSecret = "XTDat3ZN";

  const sign = crypto.createHash('md5').update(apiKey + apiSecret + timestamp).digest("hex");

  return fetch("http://api.onbuka.com/v3/sendSms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      sign: sign,
      Timestamp: timestamp,
      "Api-Key": apiKey,
    },
    body: JSON.stringify({
      appId: appId,
      numbers:  phoneNumber,
      content: content,
      senderId: "TechEatFast"
    }),
  }).then(res => res.json()).then(data => {
    console.log(data);
  })
}