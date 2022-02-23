const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const stopword = require('stopword');
const path = require('path');

// Port
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/",express.static(__dirname + "/build"));

app.post("/analyze", (request, response)=>{
  let { sentence } = request.body;

  // remove @'s
  sentence = sentence.replace(/(?:@)[\n\S]+/g, '');

  // remove @RTs
  sentence = sentence.replace(/RT/g, '');

  // remove hashtags
  sentence = sentence.replace(/(?:#)[\n\S]+/g, '');

  // remove links with http
  sentence = sentence.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');

  // remove links with http
  sentence = sentence.replace(/(?:www.)[\n\S]+/g, '');

  // remove emojis
  sentence = sentence.replace(/[^\sA-Z]/gi, '').replace(/ +/g, ' ');

  // trim whitespace
  sentence = sentence.trim();

  // negation handling
  // convert apostrophe=connecting words to lex form
  const lexedReview = aposToLexForm(sentence);

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

  // Stemming
  const Sentianalyzer =
  new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const analysis_score = Sentianalyzer.getSentiment(filteredReview);

  response.status(200).json({
      message: "Data received",
      sentiment_score: analysis_score
  })
});

// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));
