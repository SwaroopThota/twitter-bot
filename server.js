const { default: axios } = require("axios");
const client = require("./twitterClient");
const schedule = require("node-schedule");
const url = "https://programming-quotes-api.herokuapp.com/quotes/random";

console.log("server started");
const tweet = async () => {
  try {
    const res = await axios.get(url);
    const quote = `${res.data.en}\n    -${res.data.author}`;
    await client.v2.tweet(quote);
    console.log("You just tweeted '" + quote + "'");
  } catch (err) {
    console.error(err);
  }
};

schedule.scheduleJob("0 0 * * *", () => {
  tweet();
});
