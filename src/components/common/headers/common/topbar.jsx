import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import { connect } from "react-redux";
import Cookies from "js-cookie";
import { setUser, setToken, setMessage, filterName } from "../../../../actions";
import SignOutForm from "../../../pages/profile/signout";
import { withFirebase } from "../../../firebase";
import { injectIntl } from "react-intl";
//import { getUser } from '../../../../actions';

// const withTranslate = (id) => {
//   const intl = useIntl();
//   return (
//     intl.formatMessage({ id: id })
//   );
//   };

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = { ...{ jsoned: "" } };
  }

  componentDidMount() {}

  openSearch() {
    document.getElementById("search-overlay").style.display = "block";
  }

  render() {
    const { intl } = this.props;
    return (
      <div className="top-header main-menu">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-right menu-right row ">
              <ul className="col-lg-12 row header-dropdown icon-nav">
                <li className="mobile-wishlist compare-mobile">
                  <Link to={`${process.env.PUBLIC_URL}/menu`}>
                    <i className="fa fa-" aria-hidden="true" />
                    Meniu
                  </Link>
                </li>
                <li className="mobile-wishlist compare-mobile">
                  <Link to={`${process.env.PUBLIC_URL}/menu`}>
                    <i className="fa fa-" aria-hidden="true" />
                    Categorii
                  </Link>
                </li>
                <li className="onhover-dropdown mobile-account">
                  <i className="fa fa-user" aria-hidden="true"></i>
                  {/*intl.formatMessage({id: 'my.account'})}({Cookies.get('token')})
                                        {                                      
                                          this.props.email ?
                                          <ul className="onhover-show-div">
                                            <li>
                                                <a href="/orders">{intl.formatMessage({id: 'my.orders'})}</a>
                                            </li>
                                            <li>
                                                <SignOutForm/>
                                            </li>
                                          </ul>                                        
                                          :
                                          <div className="onhover-show-div row">
                                            <div className="mr-2">
                                              <Link className="btn" to={`${process.env.PUBLIC_URL}/register`}>{intl.formatMessage({id: 'register'})}</Link>    
                                            </div>
                                            <div className="ml-2">
                                              <Link className="btn" to={`${process.env.PUBLIC_URL}/login`}>{intl.formatMessage({id: 'log_in'})}</Link>
                                            </div>
                                          </div>
                                          
                                        */}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.account.email,
  message: state.account.message,
});

export default compose(
  withRouter,
  withFirebase,
  connect(mapStateToProps, { filterName })
)(injectIntl(TopBar));
