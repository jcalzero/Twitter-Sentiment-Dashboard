import React, { Component } from 'react';
import SentimentAnalyzer from '../../functions/SentimentAnalyzer';

class Navbar extends Component {
  state = {
    message: ""
  }

  submitHandler(event) {
    event.preventDefault();
  }

  analyzeTweets(keyword) {
    const analysis = SentimentAnalyzer(keyword);

    if (analysis < 0) {
      alert('Negative');
    };
    if (analysis === 0) {
      alert('Neutral');
    }
    if (analysis > 0) {
      alert('Positive');
    }
  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  

  render () {
    return (
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row flex-nowrap justify-content-start">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <img src={require('../../assets/images/TwitSent.png')} alt="logo" width={50} length={50}/>
        </div>
        <div className="navbar-menu-wrapper d-flex w-100 align-items-stretch">
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
            <span className="mdi mdi-menu"></span>
          </button>
          <div className="search-field d-md-block w-100">
            <form className="d-flex align-items-center h-100" onSubmit={this.submitHandler}>
              <div className="input-group">
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text border-0 mdi mdi-magnify"></i>
                </div>
                <input
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      this.setState({ message: e.target.value },
                      () => {
                          this.analyzeTweets(this.state.message);
                      });
                    }
                  }}
                  type="text"
                  className="form-control bg-transparent border-0"
                  placeholder="Search keyword"
                />
              </div>
            </form>
          </div>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={this.toggleOffcanvas}>
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>
    );
  }
}

export default Navbar;
