const express = require("express");
const aposToLexForm = require("apos-to-lex-form");
const natural = require("natural");
const stopword = require("stopword");
const path = require("path");
const axios = require("axios");
require("dotenv").config();

// Port
const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(__dirname + "/build"));

const baseTwitterSearchUrl = "https://api.twitter.com/1.1/search/tweets.json";
const baseTwitterTrendsUrl = "https://api.twitter.com/1.1/trends/place.json";

app.get("/analyze", (request, response) => {
    const keyword = request.headers.keyword;

    const tweetersList = [];
    let tweets = [];

    let totalOutreach = 0;
    let numPositive = 0;
    let numNeutral = 0;
    let numNegative = 0;

    (async() => {
        try {
            tweets = await getNonRetweetedTweetsByKeyword(keyword);

            // Analyze
            const Sentianalyzer = new natural.SentimentAnalyzer(
                "English",
                natural.PorterStemmer,
                "afinn"
            );
            const analysisOfTweets = [];
            let positiveArr = [0, 0, 0, 0, 0, 0, 0, 0];
            let negativeArr = [0, 0, 0, 0, 0, 0, 0, 0];
            let neutralArr = [0, 0, 0, 0, 0, 0, 0, 0];

            tweets.forEach((tweet) => {
                totalOutreach += tweet.user.followers_count;
                const cleanedTweet = clean(tweet.text);
                const analysisScore = Sentianalyzer.getSentiment(cleanedTweet);
                let sentiment = "";

                analysisOfTweets.push(analysisScore);

                if (analysisScore > 0) {
                    numPositive++;
                    sentiment = "Positive";
                } else if (analysisScore === 0) {
                    numNeutral++;
                    sentiment = "Neutral";
                } else if (analysisScore < 0) {
                    numNegative++;
                    sentiment = "Negative";
                }

                positiveArr,
                negativeArr,
                (neutralArr = parseTweetElapsedSentimentForBarChart(
                    tweet.created_at,
                    sentiment,
                    positiveArr,
                    negativeArr,
                    neutralArr
                ));

                tweetersList.push({
                    screenName: tweet.user.screen_name,
                    tweet: tweet.text,
                    latestTweeted: parseTwitterDate(tweet.created_at),
                    profileImageUrl: tweet.user.profile_image_url,
                });
            });

            response.status(200).json({
                message: "Data received",
                sentiment: getSentimentAnalysis(numPositive, numNegative),
                sentiment_score: overallSentimentScore(analysisOfTweets),
                outreach: totalOutreach,
                splits: [
                    numPositive,
                    numNeutral,
                    numNegative,
                    numPositive + numNeutral + numNegative,
                ],
                latestTweets: [
                    tweetersList[0],
                    tweetersList[1],
                    tweetersList[2],
                    tweetersList[3],
                    tweetersList[4],
                ],
                positiveData: positiveArr,
                negativeData: negativeArr,
                neutralData: neutralArr,
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({ error: "Exceeded Twitter Rate Limit" });
        }
    })();
});

app.get("/trending", (request, response) => {
    const trendingList = [];

    (async() => {
        try {
            const responseData = await axios({
                method: "GET",
                url: `${baseTwitterTrendsUrl}?id=23424977`,
                headers: {
                    Authorization: `Bearer ${process.env.BEARER_KEY}`,
                },
            });

            responseData.data[0].trends.forEach((trend) => {
                trendingList.push(trend.name);
            });

            response.status(200).json({
                trends: trendingList,
            });
        } catch (error) {
            response.status(500).json({ error: "Exceeded Twitter Rate Limit" });
        }
    })();
});

// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Listen
app.listen(PORT, console.log(`Server is running on port ${PORT}...`));

const getNonRetweetedTweetsByKeyword = async(keyword) => {
    let nextResults = "";
    const tweets = [];
    const searchParams = `${keyword} -filter:retweets`;

    do {
        const response = await axios({
            method: "GET",
            url: tweets.length === 0 ?
                `${baseTwitterSearchUrl}?q=${encodeURIComponent(
              searchParams
            )}&include_entities=0&lang=en&count=100` :
                `${baseTwitterSearchUrl}${nextResults}`,
            headers: {
                Authorization: `Bearer ${process.env.BEARER_KEY}`,
            },
        });

        response.data.statuses.forEach((tweet) => {
            tweets.push(tweet);
        });

        nextResults = response.data.search_metadata.next_results;
    } while (tweets.length !== 500 && nextResults);

    return tweets;
};

const clean = (tweet) => {
    // remove @'s
    tweet = tweet.replace(/(?:@)[\n\S]+/g, "");

    // remove @RTs
    tweet = tweet.replace(/RT/g, "");

    // remove hashtags
    tweet = tweet.replace(/(?:#)[\n\S]+/g, "");

    // remove links with http
    tweet = tweet.replace(/(?:https?|ftp):\/\/[\n\S]+/g, "");

    // remove links with http
    tweet = tweet.replace(/(?:www.)[\n\S]+/g, "");

    // remove emojis
    tweet = tweet.replace(/[^\sA-Z]/gi, "").replace(/ +/g, " ");

    // trim whitespace
    tweet = tweet.trim();

    // negation handling
    // convert apostrophe=connecting words to lex form
    const lexedReview = aposToLexForm(tweet);

    // casing
    const casedReview = lexedReview.toLowerCase();

    // removing
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, "");

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

    for (var i = 0; i < analysisScores.length; i++) {
        if (analysisScores[i]) {
            (sum += analysisScores[i]), 10;
        }
    }

    return (Math.round(sum) / analysisScores.length).toFixed(2);
};

const getSentimentAnalysis = (numPositive, numNegative) => {
    if (numPositive === numNegative) {
        return "Neutral";
    } else if (numPositive > numNegative) {
        return "Positive";
    }

    return "Negative";
};

const parseTwitterDate = (tdate) => {
    var systemDate = new Date(Date.parse(tdate));
    var userDate = new Date();
    var diff = Math.floor((userDate - systemDate) / 1000);
    if (diff <= 1) {
        return "just now";
    }
    if (diff < 20) {
        return diff + " seconds ago";
    }
    if (diff < 40) {
        return "half a minute ago";
    }
    if (diff < 60) {
        return "less than a minute ago";
    }
    if (diff <= 90) {
        return "one minute ago";
    }
    if (diff <= 3540) {
        return Math.round(diff / 60) + " minutes ago";
    }
    if (diff <= 5400) {
        return "1 hour ago";
    }
    if (diff <= 86400) {
        return Math.round(diff / 3600) + " hours ago";
    }
    if (diff <= 129600) {
        return "1 day ago";
    }
    if (diff < 604800) {
        return Math.round(diff / 86400) + " days ago";
    }
    if (diff <= 777600) {
        return "1 week ago";
    }
    return "on " + systemDate;
};

const parseTweetElapsedSentimentForBarChart = (
    tdate,
    sentiment,
    positiveArr,
    negativeArr,
    neutralArr
) => {
    const systemDate = new Date(Date.parse(tdate));
    const userDate = new Date();
    const diff = Math.floor((userDate - systemDate) / 1000);
    let done = false;

    if (diff <= 60) {
        sentiment === "Positive" ?
            positiveArr[7]++
            :
            sentiment === "Negative" ?
            negativeArr[7]++
            :
            neutralArr[7]++;
        done = true;
    }
    if (!done && diff <= 300) {
        sentiment === "Positive" ?
            positiveArr[6]++
            :
            sentiment === "Negative" ?
            negativeArr[6]++
            :
            neutralArr[6]++;
        done = true;
    }
    if (!done && diff <= 600) {
        sentiment === "Positive" ?
            positiveArr[5]++
            :
            sentiment === "Negative" ?
            negativeArr[5]++
            :
            neutralArr[5]++;
        done = true;
    }
    if (!done && diff <= 1800) {
        sentiment === "Positive" ?
            positiveArr[4]++
            :
            sentiment === "Negative" ?
            negativeArr[4]++
            :
            neutralArr[4]++;
        done = true;
    }
    if (!done && diff <= 3600) {
        sentiment === "Positive" ?
            positiveArr[3]++
            :
            sentiment === "Negative" ?
            negativeArr[3]++
            :
            neutralArr[3]++;
        done = true;
    }
    if (!done && diff <= 43200) {
        sentiment === "Positive" ?
            positiveArr[2]++
            :
            sentiment === "Negative" ?
            negativeArr[2]++
            :
            neutralArr[2]++;
        done = true;
    }
    if (!done && diff <= 86400) {
        sentiment === "Positive" ?
            positiveArr[1]++
            :
            sentiment === "Negative" ?
            negativeArr[1]++
            :
            neutralArr[1]++;
        done = true;
    }
    if (!done && diff <= 604800) {
        sentiment === "Positive" ?
            positiveArr[0]++
            :
            sentiment === "Negative" ?
            negativeArr[0]++
            :
            neutralArr[0]++;
        done = true;
    }

    return positiveArr, negativeArr, neutralArr;
};