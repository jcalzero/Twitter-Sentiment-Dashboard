import ContractionsToLexicon from 'apos-to-lex-form';
import NaturalLanguageProcessor from 'natural';
import StopWord from 'stopword';

function SentimentAnalyzer (keyword) {
  // negation handling
  // convert apostrophe=connecting words to lex form
  const lexedReview = ContractionsToLexicon(keyword);

  // casing
  const casedReview = lexedReview.toLowerCase();

  // removing
  const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');

  // tokenize review
  const { WordTokenizer } = NaturalLanguageProcessor;
  const tokenizer = new WordTokenizer();
  const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);

  // remove stopwords
  const filteredReview = StopWord.removeStopwords(tokenizedReview);

  const { SentimentAnalyzer, PorterStemmer } = NaturalLanguageProcessor;
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

  const analysis = analyzer.getSentiment(filteredReview);

  return analysis;
};

export default SentimentAnalyzer;