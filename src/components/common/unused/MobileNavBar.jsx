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
  Box,
  useScrollTrigger,
  Slide,
  CssBaseline,
  AppBar,
  Toolbar,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import { Mail, Menu } from "react-feather";
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';


function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });


  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const MobileNavBar = (props) => {
  const [open, setOpen] = useState(false);


  const toggleDrawer = () => {
    setOpen(!open);
  };

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
  });

  const classes = useStyles();

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  const {formatMessage} = props.intl;

  const loggedMenu = () => (
    <ListItem component="div">
    <ListItemText>
      <Typography variant="subtitle1" align="center">
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/dashboard`} 
          >
          <i
            className={"fa fa-sliders mx-1 "+clsx(classes.link)}
            aria-hidden="true"
          />
          {formatMessage({id: 'dashboard'})}
        </Link>
      </Typography>
    </ListItemText>
    <ListItemText>
      <Typography variant="subtitle1" align="center"> 
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/menu`} 
          >
          <i className={"fa fa-tasks mx-1 "+clsx(classes.link)}  aria-hidden="true" />
          {formatMessage({id: 'menu_admin'})}
        </Link>
      </Typography>
    </ListItemText>
    <ListItemText>
      <Typography variant="subtitle1" align="center">
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/my-account`}
        >
          <i className={"fa fa-user mx-1 "+clsx(classes.link)} aria-hidden="true" />
          {formatMessage({id: 'my.account'})}
        </Link>
      </Typography>
    </ListItemText>
  </ListItem>
  );
  const notLoggedMenu = () => (
    <ListItem component="div">
    <ListItemText>
      <Typography variant="subtitle1" align="center">
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/home`} 
          >
          <i
            className={"fa fa-sliders mx-1 "+clsx(classes.link)}
            aria-hidden="true"
          />
          {formatMessage({id: 'home'})}
        </Link>
      </Typography>
    </ListItemText>
    <ListItemText>
      <Typography variant="subtitle1" align="center"> 
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/pricing`} 
          >
          <i className={"fa fa-tasks mx-1 "+clsx(classes.link)}  aria-hidden="true" />
          {formatMessage({id: 'pricing'})}
        </Link>
      </Typography>
    </ListItemText>
    <ListItemText>
      <Typography variant="subtitle1" align="center">
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/log-in`}
        >
          <i className={"fa fa-user mx-1 "+clsx(classes.link)} aria-hidden="true" />
          {formatMessage({id: 'log_in'})}
        </Link>
      </Typography>
    </ListItemText>
  </ListItem>   
  );

  return (
    <>
    <CssBaseline />
    <HideOnScroll {...props}>
      <AppBar >
        <Toolbar >
        <Button onClick={toggleDrawer}>
          <Menu color="white" style={{height: 50}}/>
        </Button>
        </Toolbar>

        <Drawer open={open} onClose={toggleDrawer}>
          <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <List>
            { props.email ? loggedMenu() : notLoggedMenu()  }
            </List>
          </div>
        </Drawer>
      </AppBar>
    </HideOnScroll>
    </>
  );
};

const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  email: state.account.email,
  token: state.account.token
});

export default compose(
  connect(mapStateToProps),
  withStyles(null, { withTheme: true })
)(injectIntl(MobileNavBar));
