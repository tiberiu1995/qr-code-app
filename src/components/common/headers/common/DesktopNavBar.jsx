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
import { compose } from 'recompose';
import { withFirebase } from './../../../firebase/context';
import { connect } from 'react-redux';


const DesktopNavBar = (props) => {

  const useStyles = makeStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: "auto",
    },
    MuiAppBar: {
      colorPrimary: props.theme.palette.primary.main,
    },
    link: {
      color: props.theme.palette.common.white
    },
    overrides: {
      MuiListItemText: {
        inset: {
          color: 'pink',
          backgroundColor : 'pink'
        }
      },
      '.MuiListItemText-root': {
          color: 'pink',
          backgroundColor : 'pink'
        },
        '.MuiPaper-root': {
          height: 200
        }
      }

  });

  const classes = useStyles();

  const theme = props.theme;

  return (
      <AppBar >
      <List component="nav">
        { props.email ?
          <ListItem component="div">
          <ListItemText>
            <Typography variant="h5" align="center">
              <Link className={clsx(classes.link)}
                to={`${process.env.PUBLIC_URL}/dashboard`} 
                >
                <i
                  className={"fa fa-sliders mx-1 "+clsx(classes.link)}
                  aria-hidden="true"
                />
                Dashboard
              </Link>
            </Typography>
          </ListItemText>
          <ListItemText>
            <Typography variant="h5" align="center"> 
              <Link className={clsx(classes.link)}
                to={`${process.env.PUBLIC_URL}/menu`} 
                >
                <i className={"fa fa-tasks mx-1 "+clsx(classes.link)}  aria-hidden="true" />
                Administrare meniuri
              </Link>
            </Typography>
          </ListItemText>
          <ListItemText>
            <Typography variant="h5" align="center">
              <Link className={clsx(classes.link)}
                to={`${process.env.PUBLIC_URL}/my-account`}
              >
                <i className={"fa fa-user mx-1 "+clsx(classes.link)} aria-hidden="true" />
                Contul meu
              </Link>
            </Typography>
          </ListItemText>
        </ListItem>
        :
        <ListItem component="div">
        <ListItemText>
          <Typography variant="h5" align="center">
            <Link className={clsx(classes.link)}
              to={`${process.env.PUBLIC_URL}/home`} 
              >
              <i
                className={"fa fa-sliders mx-1 "+clsx(classes.link)}
                aria-hidden="true"
              />
              Home
            </Link>
          </Typography>
        </ListItemText>
        <ListItemText>
          <Typography variant="h5" align="center"> 
            <Link className={clsx(classes.link)}
              to={`${process.env.PUBLIC_URL}/pricing`} 
              >
              <i className={"fa fa-tasks mx-1 "+clsx(classes.link)}  aria-hidden="true" />
              Pricing
            </Link>
          </Typography>
        </ListItemText>
        <ListItemText>
          <Typography variant="h5" align="center">
            <Link className={clsx(classes.link)}
              to={`${process.env.PUBLIC_URL}/log-in`}
            >
              <i className={"fa fa-user mx-1 "+clsx(classes.link)} aria-hidden="true" />
              Log In
            </Link>
          </Typography>
        </ListItemText>
      </ListItem>      
      }
      </List>
      </AppBar>
  )
};

const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  email: state.account.email,
  token: state.account.token
});

export default compose(
  connect(mapStateToProps),
  withStyles(null, { withTheme: true }))(DesktopNavBar);

