import { AccountBox } from "@material-ui/icons";
import React, { Component } from "react";
import { Link } from "react-router-dom";

import { SlideUpDown } from "../../../services/script";
import LogoImage from "../headers/common/logo";
import { Box } from '@material-ui/core';

class FooterOne extends Component {
  componentDidMount() {
    var contentwidth = window.innerWidth;
    if (contentwidth < 750) {
      SlideUpDown("footer-title");
    } else {
      var elems = document.querySelectorAll(".footer-title");
      [].forEach.call(elems, function (elemt) {
        let el = elemt.nextElementSibling;
        el.style = "display: block";
      });
    }
  }

  render() {
    return (
      <footer className="footer-light">
        <Box className="light-layout" p={2}>
          <ul>
            <li className="d-flex flex-column text-center">
              <Link to="/privacy">Privacy</Link>
              <Link to="/terms">Terms</Link>
              <Link to="https://icons8.com">icons8</Link>
            </li>
          </ul>
          </Box>
      </footer>
    );
  }
}

export default FooterOne;
