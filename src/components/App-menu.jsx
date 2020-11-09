import React, { Component, useEffect } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withFirebase } from "./firebase";
import { injectIntl } from "react-intl";
import { setToken, setUser, setUid  } from "../actions";
import { Link, withRouter } from "react-router-dom";

// Custom Components
import HeaderOne from "./common/headers/header-one";
import FooterOne from "./common/footers/footer-one";

// ThemeSettings
import ThemeSettings from "./common/theme-settings";
import CookieConsent, { Cookies } from "react-cookie-consent";
import Cookie from "js-cookie";
import { uuid } from "uuidv4";
import { Box } from '@material-ui/core';
import { useMediaQuery } from '@material-ui/core/';
import { TabletMac } from "@material-ui/icons";
import { setMedia, } from './../actions/index';

const App = (props) => {
  const desktop = useMediaQuery('(min-width:900px)');
  const tablet = useMediaQuery('(min-width:500px) and (max-width:899px)');
  const lt600 = useMediaQuery('(max-width:599px)');
  const mobile = useMediaQuery('(max-width:499px)');
  setMedia({desktop: desktop, tablet: tablet, lt600: lt600, mobile: mobile});


  useEffect(()=>{ },[]);


  return (
    <div>    
      <Box>
        {props.children}
      </Box>
      <ThemeSettings />
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  withRouter,
  connect(mapStateToProps)
)(injectIntl(App));
