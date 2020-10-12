import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { withTranslate } from "react-redux-multilingual";
import {
  Typography,
  ListItemText,
  ListItem,
  List,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  Button,
  useMediaQuery,
  withStyles,
  Drawer,
  makeStyles,
  ListItemIcon,
  Divider,
  AppBar,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import { Mail } from "react-feather";
import MobileNavBar from "./MobileNavBar";
import DesktopNavBar from "./DesktopNavBar";



const NavBar = (props) => {

  const theme = props.theme;
  const desktop = useMediaQuery('(min-width:900px)');
  const tablet = useMediaQuery('(min-width:500px) and (max-width:899px)');
  const mobile = useMediaQuery('(max-width:499px)');
  //const up_sm = useMediaQuery(theme.breakpoints.up("sm"));


  return (
    desktop ? 
      <DesktopNavBar/> :
      <MobileNavBar/>
  )

};

export default withStyles(null, { withTheme: true })(NavBar);
