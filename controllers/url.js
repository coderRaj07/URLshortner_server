const URL = require("../models/url");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const { nanoid } = await import('nanoid');
  const shortID = nanoid(8);
  console.log("shortID", shortID);

  // Set expiration duration based on the query parameter
  const expirationDuration = req.query.expiration === 'true' ? 30 : null;

  const creationTime = new Date();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    expirationDuration: expirationDuration,
    createdAt: creationTime,
  });

  return res.json({ id: shortID });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  if (!result) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
