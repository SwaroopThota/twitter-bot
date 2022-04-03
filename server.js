const { default: axios } = require("axios");
const client = require("./twitterClient");
const schedule = require("node-schedule");
const url = "https://programming-quotes-api.herokuapp.com/quotes/random";
const imgUrl = "https://source.unsplash.com/random/1920x1080?nature";
const Jimp = require("jimp");
const fs = require("fs");
const titles = ["Great", "So true!", "Niiice!", "Good", "Damn", "Well said!"];

console.log("server started");
const tweet = async () => {
  try {
    const res = await axios.get(url);
    const quote = `${res.data.en}\r\n    -${res.data.author}`;
    const image = await Jimp.read(imgUrl);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
    image.blur(1);
    image.brightness(-0.2);
    image.print(
      font,
      400,
      0,
      {
        text: res.data.en,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      1200,
      1080
    );
    const authorHeight =
      Jimp.measureTextHeight(font, res.data.en, 1200) / 2 + 100;
    image.print(
      font,
      400,
      authorHeight,
      {
        text: "- " + res.data.author,
        alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
      },
      1200,
      1080
    );
    await image.writeAsync("./img.jpg");
    const mediaId = await client.v1.uploadMedia("img.jpg");
    const title = titles[parseInt(Math.random() * titles.length)];
    await client.v1.tweet(title, { media_ids: mediaId });
    fs.unlinkSync("./img.jpg");
    console.log("You just tweeted '" + quote + "' with a title ", title);
  } catch (err) {
    console.error(err);
  }
};

schedule.scheduleJob("0 0 * * *", () => {
  tweet();
});
