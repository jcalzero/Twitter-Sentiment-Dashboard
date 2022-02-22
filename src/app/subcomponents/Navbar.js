import React from 'react';
import { useHistory } from 'react-router';

function Navbar() {
  const history = useHistory();

  function submitHandler(event) {
    event.preventDefault();
  }

  function analyzeTweets(keyword) {
    const sentence = keyword;

    history.push({
      pathname: `/dashboard/${keyword}`
    });

    const options = {
      method: 'POST',
      body: JSON.stringify({ sentence }),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
  
    fetch('/analyze', options)
      .then(res => res.json())
      .then (({ sentiment_score }) => {
        if (sentiment_score < 0) {
          console.log('Negative');
        };
        if (sentiment_score === 0) {
          console.log('Neutral');
        }
        if (sentiment_score > 0) {
          console.log('Positive');
        }
      })
      .catch(err => {
        console.log('There was an error processing your request!');
      })
  }

  function toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  
  return (
    <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row flex-nowrap justify-content-start">
      <div className="text-center navbar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center">
        <img src={require('../../assets/images/TwitSent.png')} alt="logo" width={50} length={50}/>
      </div>
      <div className="navbar-menu-wrapper d-flex w-100 align-items-stretch">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
          <span className="mdi mdi-menu"></span>
        </button>
        <div className="search-field d-md-block w-100">
          <form className="d-flex align-items-center h-100" onSubmit={submitHandler}>
            <div className="input-group">
              <div className="input-group-prepend bg-transparent">
                <i className="input-group-text border-0 mdi mdi-magnify"></i>
              </div>
              <input
                onKeyPress={(event) => {
                  if (event.key === "Enter") {
                    analyzeTweets(event.target.value);
                  }
                }}
                type="text"
                className="form-control bg-transparent border-0"
                placeholder="Search keyword"
              />
            </div>
          </form>
        </div>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={toggleOffcanvas}>
          <span className="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
