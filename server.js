const express = require('express');
const aposToLexForm = require('apos-to-lex-form');
const natural = require('natural');
const stopword = require('stopword');

// Port
const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/",express.static(__dirname + "/src"));

app.post("/analyze", (request, response)=>{
  const { sentence } = request.body;

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

// Listen
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));
