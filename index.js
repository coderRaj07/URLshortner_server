const http = require("http");
const express = require("express");
const favicon = require('express-favicon');
const dotenv = require("dotenv");
const cron = require("node-cron");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

dotenv.config();

const app = express();
const PORT = 8001;

connectToMongoDB(process.env.DB).then(() =>
  console.log("Mongodb connected")
);

app.use(favicon(__dirname + 'icons8-favicon-16.png'));
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

// Define function for cron job logic
const handleCronJob = async () => {
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
};

app.post("/cronjobs/start", (req, res) => {
  // You can use this endpoint to trigger the cron job manually if needed
  handleCronJob();
  res.json({ message: "Cron job started" });
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server Started at PORT:${PORT}`);
});
