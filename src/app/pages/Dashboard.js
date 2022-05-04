import React, { useEffect, useRef, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useParams } from 'react-router';

export default function Dashboard() {
  const { keyword = '' } = useParams();
  const [tweetSentimentData, setTweetSentimentData] = useState();
  const [loading, setLoading] = useState(false);
  const positive = '#1bcfb4';
  const neutral = '#fed713';
  const negative = '#fe7c96';

  const chartRef = useRef();

  const getTweetAnalysis = async () => {
    setLoading(true);
    analyzeTweets(keyword)
      .then((analysis) => setTweetSentimentData(analysis))
      .then(() => setLoading(false));
  };

  useEffect(() => {
    if (keyword !== 'hello world') {
      getTweetAnalysis();
    }
  }, [keyword]);

  if (loading) {
    return (
      <div className="page-header">
        <h3 className="page-title align-text-center">
          Loading...
        </h3>
      </div>
    );
  };

  if (keyword === 'hello world') {
    return (
      <div className="page-header">
        <h3 className="page-title align-text-center">
          Type in a keyword, hit enter, and watch us do our magic <span role="img" aria-label="magic-ball">🔮</span>
        </h3>
      </div>
    );
  };

  if (!tweetSentimentData) {
    return (
      <div className="page-header">
        <h3 className="page-title align-text-center">
          Sorry, we hit a few bumps. Please try again!
        </h3>
      </div>
    );
  }

  const positivePercentage = Math.floor((tweetSentimentData.splits[0] / tweetSentimentData.splits[3]) * 100);
  const negativePercentage = Math.floor((tweetSentimentData.splits[2] / tweetSentimentData.splits[3]) * 100);
  const neutralPercentage = Math.ceil((tweetSentimentData.splits[1] / tweetSentimentData.splits[3]) * 100);

  const pieChartOptions = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: false,
  };

  const barChartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          display:false,
          min: 0,
          stepSize: 20,
          max: 80
        },
        gridLines: {
          drawBorder: false,
          color: 'rgba(235,237,242,1)',
          zeroLineColor: 'rgba(235,237,242,1)'
        }
      }],
      xAxes: [{
        gridLines: {
          display:false,
          drawBorder: false,
          color: 'rgba(0,0,0,1)',
          zeroLineColor: 'rgba(235,237,242,1)'
        },
        ticks: {
          padding: 20,
          fontColor: "#9c9fa6",
          autoSkip: true,
        },
        categoryPercentage: 0.5,
        barPercentage: 0.5
      }]
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };
  
  const barChartData = {
    labels: ['Last Week', 'Last Day', 'Last 12 Hours', 'Last Hour', 'Last 30 Mins', 'Last 10 Mins', 'Last 5 Mins', 'Last Min'],
    datasets: [
      {
        label: "Positive",
        borderColor: positive,
        backgroundColor: positive,
        hoverBackgroundColor: positive,
        legendColor: positive,
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        data: tweetSentimentData.positiveData
      },
      {
        label: "Neutral",
        borderColor: neutral,
        backgroundColor: neutral,
        hoverBackgroundColor: neutral,
        legendColor: neutral,
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        data: tweetSentimentData.neutralData
      },
      {
        label: "Negative",
        borderColor: negative,
        backgroundColor: negative,
        hoverBackgroundColor: negative,
        legendColor: negative,
        pointRadius: 0,
        fill: false,
        borderWidth: 1,
        data: tweetSentimentData.negativeData
      }
    ]
  };

  const pieChartData = {
    datasets: [{
      data: [positivePercentage, neutralPercentage, negativePercentage],
        backgroundColor: [
          positive,
          neutral,
          negative
        ],
        hoverBackgroundColor: [
          positive,
          neutral,
          negative
        ],
        borderColor: [
          positive,
          neutral,
          negative
        ],
        legendColor: [
          positive,
          neutral,
          negative
        ]
    }],
    labels: [
      'Positive',
      'Neutral',
      'Negative',
    ]
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span> {'Analysis: '} <span className={`text-${tweetSentimentData.sentiment === 'Positive' ? 'success' : tweetSentimentData.sentiment === 'Neutral' ? 'warning' : 'danger'}`}>{String(keyword)}</span>
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      <div className="row">
        <div className="col-md-4 stretch-card grid-margin">
          <div className={`card bg-gradient-${tweetSentimentData.sentiment === 'Positive' ? 'success' : tweetSentimentData.sentiment === 'Neutral' ? 'warning' : 'danger'} card-img-holder text-white`}>
            <div className="card-body">
              <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
              <h4 className="font-weight-normal mb-3">Sentiment <i className="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{tweetSentimentData.sentiment}</h2>
              <h6 className="card-text">Highest level of sentiment from 1000 tweets pulled</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-dark card-img-holder text-white">
            <div className="card-body">
              <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
              <h4 className="font-weight-normal mb-3">Polarity <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{tweetSentimentData.sentiment_score}</h2>
              <h6 className="card-text">Sum of polarity levels per tweet</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-primary card-img-holder text-white">
            <div className="card-body">
              <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
              <h4 className="font-weight-normal mb-3">Outreach <i className="mdi mdi-diamond mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{tweetSentimentData.outreach.toLocaleString('en-US')}</h2>
              <h6 className="card-text">Number of Followers per User</h6>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-7 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="clearfix mb-4">
                <h4 className="card-title float-left">Sentiment Statistics</h4>
                <div id="visit-sale-chart-legend" className="rounded-legend legend-horizontal legend-top-right float-right">
                  <ul>
                    <li>
                      <span className="legend-dots bg-success">
                      </span>Positive
                    </li>
                    <li>
                      <span className="legend-dots bg-warning">
                      </span>Neutral
                    </li>
                    <li>
                      <span className="legend-dots bg-danger">
                      </span>Negative
                    </li>
                  </ul>
                </div>
              </div>
              <Bar ref={chartRef} className="chartLegendContainer" data={barChartData} options={barChartOptions} id="sentimentStatisticsChart"/>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Sentiment Breakdown</h4>
              <Doughnut data={pieChartData} options={pieChartOptions} />
              <div id="traffic-chart-legend" className="rounded-legend legend-vertical legend-bottom-left pt-4">
                <ul>
                  <li>
                    <span className="legend-dots bg-success"></span>Positive
                    <span className="float-right">{positivePercentage}%</span>
                  </li>
                  <li>
                    <span className="legend-dots bg-warning"></span>Neutral
                    <span className="float-right">{neutralPercentage}%</span>
                  </li>
                  <li>
                    <span className="legend-dots bg-danger"></span>Negative
                    <span className="float-right">{negativePercentage}%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Latest Tweets</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> User </th>
                      <th> Tweet </th>
                      <th> Tweeted </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img src={tweetSentimentData.latestTweets[0].profileImageUrl} className="mr-2" alt="face" /> @{tweetSentimentData.latestTweets[0].screenName} </td>
                      <td> {truncateString(tweetSentimentData.latestTweets[0].tweet)} </td>
                      <td> {tweetSentimentData.latestTweets[0].latestTweeted} </td>
                    </tr>
                    <tr>
                    <td>
                        <img src={tweetSentimentData.latestTweets[1].profileImageUrl} className="mr-2" alt="face" /> @{tweetSentimentData.latestTweets[1].screenName} </td>
                      <td> {truncateString(tweetSentimentData.latestTweets[1].tweet)} </td>
                      <td> {tweetSentimentData.latestTweets[1].latestTweeted} </td>
                    </tr>
                    <tr>
                    <td>
                        <img src={tweetSentimentData.latestTweets[2].profileImageUrl} className="mr-2" alt="face" /> @{tweetSentimentData.latestTweets[2].screenName} </td>
                      <td> {truncateString(tweetSentimentData.latestTweets[2].tweet)} </td>
                      <td> {tweetSentimentData.latestTweets[2].latestTweeted} </td>
                    </tr>
                    <tr>
                    <td>
                        <img src={tweetSentimentData.latestTweets[3].profileImageUrl} className="mr-2" alt="face" /> @{tweetSentimentData.latestTweets[3].screenName} </td>
                      <td> {truncateString(tweetSentimentData.latestTweets[3].tweet)} </td>
                      <td> {tweetSentimentData.latestTweets[3].latestTweeted} </td>
                    </tr>
                    <tr>
                    <td>
                        <img src={tweetSentimentData.latestTweets[4].profileImageUrl} className="mr-2" alt="face" /> @{tweetSentimentData.latestTweets[4].screenName} </td>
                      <td> {truncateString(tweetSentimentData.latestTweets[4].tweet)} </td>
                      <td> {tweetSentimentData.latestTweets[4].latestTweeted} </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

async function analyzeTweets(keyword) {
  const options = {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', 'keyword': keyword })
  }

  const responseData = await fetch('/analyze', options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      
      throw new Error('Exceeded Twitter API Rate Limit');
    })
    .then(({ sentiment, sentiment_score, outreach, splits, latestTweets, positiveData, negativeData, neutralData }) => {
      const tweetSentimentData = {
        keyword,
        sentiment,
        sentiment_score,
        outreach,
        splits,
        latestTweets,
        positiveData,
        negativeData,
        neutralData
      };

      return tweetSentimentData;
    })
    .catch((error) => {
      console.error('Error:', error);
      return null;
    })

  return responseData;
};

const truncateString = (str, num = 55) => {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
};
