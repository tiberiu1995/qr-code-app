import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { IntlActions } from "react-redux-multilingual";
import Pace from "react-pace-progress";

// Import custom components
import store from "../../../store";
import NavBar from "./common/navbar";
import SideBar from "./common/sidebar";
import TopBar from "./common/topbar";
import LogoImage from "./common/logo";
import { changeCurrency } from "../../../actions";
import { connect } from "react-redux";

class HeaderOne extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }
  /*=====================
         Pre loader
         ==========================*/
  componentDidMount() {
    /*setTimeout(function() {
            document.querySelector(".loader-wrapper").style = "display: none";
        }, 2000);*/

    this.setState({ open: true });
  }

  componentWillMount() {
    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 300) {
      if (window.innerWidth < 576) {
        document.getElementById("sticky").classList.remove("fixed");
      } else document.getElementById("sticky").classList.add("fixed");
    } else {
      document.getElementById("sticky").classList.remove("fixed");
    }
  };

  changeLanguage(lang) {
    store.dispatch(IntlActions.setLocale(lang));
  }

  openNav() {
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
    }
  }
  openSearch() {
    document.getElementById("search-overlay").style.display = "block";
  }

  closeSearch() {
    document.getElementById("search-overlay").style.display = "none";
  }

  load = () => {
    this.setState({ isLoading: true });
    fetch().then(() => {
      // deal with data fetched
      this.setState({ isLoading: false });
    });
  };

  render() {
    return (
      <div>
        <header id="sticky" className="sticky">
          {this.state.isLoading ? <Pace color="#27ae60" /> : null}
          <div className="mobile-fix-option"></div>
          {/*Top Header Component*/}
          <div className="main-menu text-light">
            <div className="menu-left">
              {/*<div className="navbar">
								<a href="javascript:void(0)" onClick={this.openNav}>
									<div className="bar-style"> <i className="fa fa-bars sidebar-bar" aria-hidden="true"></i></div>
								</a>
								<SideBar/>
							</div>*/}
              <div className="brand-logo">
                <LogoImage logo={this.props.logoName} />
              </div>
            </div>
            <div className="menu-left">
              {/*Top Navigation Bar Component*/}
              <NavBar />
              <div>
                <div className="icon-nav"></div>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default connect(null, { changeCurrency })(HeaderOne);
