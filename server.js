const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const stopword = require('stopword');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Port
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/",express.static(__dirname + "/build"));

const baseTwitterSearchUrl = 'https://api.twitter.com/1.1/search/tweets.json';
const defaultFetchOptions = {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${process.env.BEARER_KEY}`,
    },
};

app.post("/analyze", (request, response)=>{
  let { keyword } = request.body;
  let tweets = [];

  let totalOutreach = 0;
  let numPositive = 0;
  let numNeutral = 0;
  let numNegative = 0;

  (async () => {
    try {
      tweets = await getNonRetweetedTweetsByKeywordsAndDate(keyword);

      // Analyze
      const Sentianalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
      const analysisOfTweets = [];

      tweets.forEach((tweet) => {
        totalOutreach += tweet.user.followers_count;
        const cleanedTweet = clean(tweet.text);
        const analysisScore = Sentianalyzer.getSentiment(cleanedTweet);
        analysisOfTweets.push(analysisScore);

        if (analysisScore > 0) {
          numPositive++;
        } else if (analysisScore === 0) {
          numNeutral++;
        } else if (analysisScore < 0) {
          numNegative++;
        }
      });

      response.status(200).json({
          message: "Data received",
          sentiment_score: overallSentimentScore(analysisOfTweets),
          outreach: totalOutreach,
          splits: [numPositive, numNeutral, numNegative, numPositive + numNeutral + numNegative]
      })
    } catch (error) {
      response.status(501);
      throw error;
    }
  })();
});

// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));

const getNonRetweetedTweetsByKeywordsAndDate = async (keyword) => {
  const dateSince = new Date(new Date().setDate(new Date().getDate() - 1));
  const dateSinceFormatted = `${dateSince.getFullYear()}-${dateSince.getMonth() + 1}-${dateSince.getDate()}`;
  const queryParam = `${keyword} -filter:retweets since:${dateSinceFormatted}`;

  let nextResults = '';
  const tweets = [];

  do {
    const response = await axios({
      method: 'GET',
      url: tweets.length === 0 ? `${baseTwitterSearchUrl}?q=${encodeURIComponent(queryParam)}&include_entities=0&lang=en&count=100` : `${baseTwitterSearchUrl}${nextResults}`,
      headers: {
        'Authorization': `Bearer AAAAAAAAAAAAAAAAAAAAACX7MwEAAAAApW9W9OthXQYXlV%2FFLFw1BpGNbY8%3DSzFihuUZxyo83CLgPf86SltJSDxuNLrKlbLNo1cIjJRwN3xtK2`,
      },
    });
  
    response.data.statuses.forEach((tweet) => {
      tweets.push(tweet);
    })
    
    nextResults = response.data.search_metadata.next_results;
  } while (tweets.length !== 200 && nextResults)

  return tweets;
};

const clean = (tweet) => {
  // remove @'s
  tweet = tweet.replace(/(?:@)[\n\S]+/g, '');

  // remove @RTs
  tweet = tweet.replace(/RT/g, '');

  // remove hashtags
  tweet = tweet.replace(/(?:#)[\n\S]+/g, '');

  // remove links with http
  tweet = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

  // remove links with http
  tweet = tweet.replace(/(?:www.)[\n\S]+/g, '');

  // remove emojis
  tweet = tweet.replace(/[^\sA-Z]/gi, '').replace(/ +/g, ' ');

  // trim whitespace
  tweet = tweet.trim();

  // negation handling
  // convert apostrophe=connecting words to lex form
  const lexedReview = aposToLexForm(tweet);

  // casing
  const casedReview = lexedReview.toLowerCase();

  // removing
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  // tokenize review
  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  // remove stopwords
  const filteredReview = stopword.removeStopwords(tokenizedReview);

  return filteredReview;
};

const overallSentimentScore = (analysisScores) => {
  let sum = 0;

  for(var i = 0; i < analysisScores.length; i++){
    if (analysisScores[i]) {
      sum += analysisScores[i], 10;
    }
  }

  return ((Math.round(sum * 100) / 100).toFixed(2));
};
