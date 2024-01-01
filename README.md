# 🌐 URL Shortener

Welcome to our URL Shortener! This lightweight and efficient tool allows you to shorten your long URLs, making them more manageable and easier to share. Plus, it comes with a few extra features to enhance your experience.

## 🛠 Installation

To get started, follow these simple steps:

1. Install the application using npm:
   ```bash
   npm i
   ```

2. Run the application locally on port 8001:
   ```bash
   npm start
   ```

The application is now running locally on `http://localhost:8001`. You can use this local server for testing and development purposes.

## 🚀 Testing on Production

To test the URL Shortener on the production environment, use the following base URL instead of the local development server:

```
https://rich-pink-dhole-cuff.cyclic.app
```

Replace the local development server URLs mentioned in the subsequent sections with this production URL.

## 🔗 Shortening URLs

### Shorten a URL

To shorten a URL, send a POST request to the following endpoint:

**Endpoint:**
```
http://localhost:8001/url
```

or for production testing:

```
https://rich-pink-dhole-cuff.cyclic.app/url
```

**Request Body:**
```json
{
  "url": "your_long_url_here"
}
```

This will return a short ID, which you can use to access the redirected URL.

### 🌐 Accessing Redirected URL

To visit the redirected URL, use the following format:

```
http://localhost:8001/:shortId
```

or for production testing:

```
https://rich-pink-dhole-cuff.cyclic.app/:shortId
```

Replace `:shortId` with the actual short ID obtained from the shortening process.

## ⏳ URL Expiration

You can set an expiration for your short URLs. If you want a link valid for 30 minutes, follow these steps:

**Endpoint:**
```
http://localhost:8001/url?expiration=true
```

or for production testing:

```
https://rich-pink-dhole-cuff.cyclic.app/url?expiration=true
```

**Request Body:**
```json
{
  "url": "your_long_url_here"
}
```

Access the redirected URL using the format mentioned earlier.

## 🔄 Automatic Cleanup

Internally, the application utilizes cron jobs to clean up expired URLs every 1 minute. This ensures that your short URLs stay relevant and clutter-free.

## 💾 Storage and Tracking

- Short IDs are stored in MongoDB for efficient retrieval.
- To track when a URL is visited, MongoDB find queries are used, and the timestamp of the visit is pushed to the record.

Enjoy using our URL Shortener! If you have any questions or feedback, feel free to reach out. Happy shortening! 🚀
