import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './subcomponents/Navbar';
import Sidebar from './subcomponents/Sidebar';
import Footer from './subcomponents/Footer';

class App extends Component {
  state = {}
  componentDidMount() {
    this.onRouteChanged();
  }
  render () {
    let navbarComponent = <Navbar/> ;
    let sidebarComponent = <Sidebar/>;
    let footerComponent = <Footer/>;

    return (
      <div className="container-scroller">
        { navbarComponent }
        <div className="container-fluid page-body-wrapper">
          { sidebarComponent }
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes/>
            </div>
            { footerComponent }
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    window.scrollTo(0, 0);
    this.setState({
      isFullPageLayout: false
    })
    document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
  }
}

export default withRouter(App);
