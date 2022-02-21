import express from 'express';
import ContractionsToLexicon from 'apos-to-lex-form';
import NaturalLanguageProcessor from 'natural';
import SpellingCorrector from 'spelling-corrector';
import StopWord from 'stopword';

const router = express.Router();

const spellCorrector = new SpellingCorrector();
spellCorrector.loadDictionary();

router.post('/sentimentAnalyzer', function(req, res, next) {
  const { review } = req.body;
  /* NORMALIZATION */

  // negation handling
  // convert apostrophe=connecting words to lex form
  const lexedReview = ContractionsToLexicon(review);

  // casing
  const casedReview = lexedReview.toLowerCase();

  // removing
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  // tokenize review
  const { WordTokenizer } = NaturalLanguageProcessor;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  // spell correction
  tokenizedReview.forEach((word, index) => {
    tokenizedReview[index] = spellCorrector.correct(word);
  })

  // remove stopwords
  const filteredReview = StopWord.removeStopwords(tokenizedReview);

  const { SentimentAnalyzer, PorterStemmer } = NaturalLanguageProcessor;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

  const analysis = analyzer.getSentiment(filteredReview);

  res.status(200).json({ analysis });
});

module.exports = router;