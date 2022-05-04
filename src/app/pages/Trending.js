import React, { useState, useEffect } from 'react'

export default function Trending() {
  const [loading, setLoading] = useState(false);
  const [trendingTwitterTopics, setTrendingTwitterTopics] = useState([]);

  const getTrends = async () => {
    setLoading(true);
    getTrendingTopics()
      .then((trends) => setTrendingTwitterTopics(trends[0]))
      .then(() => setLoading(false));
  };

  useEffect(() => {
    getTrends();
  }, []);

  if (loading || trendingTwitterTopics.length === 0) {
    return (
      <div className="page-header">
        <h3 className="page-title align-text-center">
          Loading...
        </h3>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
      <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-format-list-bulleted"></i>
          </span> Trending Twitter Topics </h3>
      </div>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-description"> Location: United States</p>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Number</th>
                      <th>Topic/Keywords</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trendingTwitterTopics.map((topic, i) => {
                      return(
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{topic}</td>
                          <td><label className="badge badge-success">Trending</label></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


async function getTrendingTopics() {
  const options = {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' })
  }

  const responseData = await fetch('/trending', options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      
      throw new Error('Exceeded Twitter API Rate Limit');
    })
    .then((trends) => {
      return Object.values(trends);
    })
    .catch((error) => {
      console.error('Error:', error);
      return null;
    })

  return responseData;
};