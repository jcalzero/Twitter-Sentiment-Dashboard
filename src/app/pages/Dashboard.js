import React, { useRef, useState } from 'react';
import {Bar, Doughnut} from 'react-chartjs-2';
import { useParams } from 'react-router';

function Dashboard() {
  const { keyword = '' } = useParams();

  const chartRef = useRef();

  const positive = '#1bcfb4';
  const neutral = '#fed713';
  const negative = '#fe7c96';

  const sentimentArr = ['positive', 'neutral', 'negative'];
  const sentiment = sentimentArr[Math.floor(Math.random() * 3)];

  const [trafficOptions] = useState({
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true
    },
    legend: false,
  });
  const [visitSaleOptions] = useState({
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
  });
  
  const [visitSaleData] = useState({
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
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
        data: [20, 40, 15, 35, 25, 50, 30, 20]
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
        data: [40, 30, 20, 10, 50, 15, 35, 40]
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
        data: [70, 10, 30, 40, 25, 50, 15, 30]
      }
    ]
  });

  const [trafficData] = useState({
    datasets: [{
      data: [30, 30, 40],
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
  });

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span> {'Sentiment Results: '} <span className={`text-${sentiment === 'positive' ? 'success' : sentiment === 'neutral' ? 'warning' : 'danger'}`}>{String(keyword)}</span>
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
          <div className={`card bg-gradient-${sentiment === 'positive' ? 'success' : sentiment === 'neutral' ? 'warning' : 'danger'} card-img-holder text-white`}>
            <div className="card-body">
              <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
              <h4 className="font-weight-normal mb-3">Overall Sentiment <i className="mdi mdi-chart-line mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">{sentiment.toUpperCase()}</h2>
              <h6 className="card-text">Highest level of sentiment from 100 tweets pulled</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-dark card-img-holder text-white">
            <div className="card-body">
              <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
              <h4 className="font-weight-normal mb-3">Level of Polarity <i className="mdi mdi-bookmark-outline mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">3.41</h2>
              <h6 className="card-text">How polarized are the tweets</h6>
            </div>
          </div>
        </div>
        <div className="col-md-4 stretch-card grid-margin">
          <div className="card bg-gradient-primary card-img-holder text-white">
            <div className="card-body">
              <img src={require("../../assets/images/dashboard/circle.svg")} className="card-img-absolute" alt="circle" />
              <h4 className="font-weight-normal mb-3">Possible Outreach <i className="mdi mdi-diamond mdi-24px float-right"></i>
              </h4>
              <h2 className="mb-5">955,741</h2>
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
              <Bar ref={chartRef} className="chartLegendContainer" data={visitSaleData} options={visitSaleOptions} id="visitSaleChart"/>
            </div>
          </div>
        </div>
        <div className="col-md-5 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Sentiment Breakdown</h4>
              <Doughnut data={trafficData} options={trafficOptions} />
              <div id="traffic-chart-legend" className="rounded-legend legend-vertical legend-bottom-left pt-4">
                <ul>
                  <li>
                    <span className="legend-dots bg-success"></span>Positive
                    <span className="float-right">30%</span>
                  </li>
                  <li>
                    <span className="legend-dots bg-warning"></span>Neutral
                    <span className="float-right">30%</span>
                  </li>
                  <li>
                    <span className="legend-dots bg-danger"></span>Negative
                    <span className="float-right">40%</span>
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
              <h4 className="card-title">Recent Tickets</h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> Assignee </th>
                      <th> Subject </th>
                      <th> Status </th>
                      <th> Last Update </th>
                      <th> Tracking ID </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <img src={require("../../assets/images/faces/face1.jpg")} className="mr-2" alt="face" /> David Grey </td>
                      <td> Fund is not recieved </td>
                      <td>
                        <label className="badge badge-gradient-success">DONE</label>
                      </td>
                      <td> Dec 5, 2017 </td>
                      <td> WD-12345 </td>
                    </tr>
                    <tr>
                      <td>
                        <img src={require("../../assets/images/faces/face2.jpg")} className="mr-2" alt="face" /> Stella Johnson </td>
                      <td> High loading time </td>
                      <td>
                        <label className="badge badge-gradient-warning">PROGRESS</label>
                      </td>
                      <td> Dec 12, 2017 </td>
                      <td> WD-12346 </td>
                    </tr>
                    <tr>
                      <td>
                        <img src={require("../../assets/images/faces/face3.jpg")} className="mr-2" alt="face" /> Marina Michel </td>
                      <td> Website down for one week </td>
                      <td>
                        <label className="badge badge-gradient-info">ON HOLD</label>
                      </td>
                      <td> Dec 16, 2017 </td>
                      <td> WD-12347 </td>
                    </tr>
                    <tr>
                      <td>
                        <img src={require("../../assets/images/faces/face4.jpg")} className="mr-2" alt="face" /> John Doe </td>
                      <td> Loosing control on server </td>
                      <td>
                        <label className="badge badge-gradient-danger">REJECTED</label>
                      </td>
                      <td> Dec 3, 2017 </td>
                      <td> WD-12348 </td>
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

export default Dashboard;
