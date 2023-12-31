const express = require("express");
const cron = require("node-cron");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb+srv://coderRaj07:H9Ta3ijJ1g5KggRQ@awscrudserverless.aecl4g4.mongodb.net/AWSCRUDserverless").then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log(`Server Started at PORT:${PORT}`);
  cron.schedule("*/5 * * * *", async () => {
    const now = new Date();
    const urls = await URL.find({ expirationDuration: { $ne: null } });

    urls.forEach(async (url) => {
      const creationTime = url.createdAt;
      if (now - creationTime > 30 * 60 * 1000) {
        // Delete the URL if it's 30 minutes or older
        await URL.deleteOne({ _id: url._id });
        console.log(`Expired URL ${url.shortId} deleted`);
      }
    });
  });
});
