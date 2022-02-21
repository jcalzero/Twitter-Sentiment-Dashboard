import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';

class Navbar extends Component {

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }

  

  render () {
    return (
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <img src={require('../../assets/images/TwitSent.png')} alt="logo" width={50} length={50}/>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={ () => document.body.classList.toggle('sidebar-icon-only') }>
            <span className="mdi mdi-menu"></span>
          </button>
          <div className="search-field d-none d-md-block w-100">
            <form className="d-flex align-items-center h-100" onSubmit={this.handleSubmit}>
              <div className="input-group">
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text border-0 mdi mdi-magnify"></i>
                </div>
                <Form inline>
                  <Form.Control type="text" placeholder="Search keywork" className="bg-transparent border-0" />
                </Form>
                {/* <input type="text" className="form-control bg-transparent border-0" placeholder="Search keyword"/> */}
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
