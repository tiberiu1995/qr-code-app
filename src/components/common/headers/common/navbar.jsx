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
  Toolbar,
  useScrollTrigger,
  Slide,
} from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import clsx from "clsx";
import { Mail, Menu } from "react-feather";
//import { Menu } from './../../../products/products';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const NavBar = (props) => {
  const [open, setOpen] = useState(false)
  const theme = props.theme;
  const desktop = useMediaQuery('(min-width:900px)');
  const tablet = useMediaQuery('(min-width:500px) and (max-width:899px)');
  const mobile = useMediaQuery('(max-width:499px)');
  //const up_sm = useMediaQuery(theme.breakpoints.up("sm"));
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
    [props.theme.breakpoints.up('lg')]: {
      link: {
        color: props.theme.palette.common.white
      },
    },
    [props.theme.breakpoints.down('lg')]: {
      listContainer: {
        '& .MuiListItem-root': {
          flexDirection: 'column'
        }
      }
    },
    desktopNavbar: {
      '& .MuiListItemText-root': {
        flex: '0 auto',
        margin: [[0 ,16]]
      },
    }
  });

  const classes = useStyles();


  const {formatMessage} = props.intl

  const menu = () => (
    props.email ? loggedMenu() : notLoggedMenu() )

  const loggedMenu = () => (
    <ListItem component="div">
      <ListItemText>
        <Typography variant="subtitle1" align="center">
          <Link className={clsx(classes.link)}
            to={`${process.env.PUBLIC_URL}/dashboard`} 
            >
            <i
              // className={"fa fa-sliders mx-1 "+clsx(classes.link)}
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
            {/* <i className={"fa fa-tasks mx-1 "+clsx(classes.link)}  aria-hidden="true" /> */}
            {formatMessage({id: 'menu_admin'})}
          </Link>
        </Typography>
      </ListItemText>
      <ListItemText>
        <Typography variant="subtitle1" align="center">
          <Link className={clsx(classes.link)}
            to={`${process.env.PUBLIC_URL}/my-account`}
          >
            {/* <i className={"fa fa-user mx-1 "+clsx(classes.link)} aria-hidden="true" /> */}
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
            // className={"fa fa-sliders mx-1 "+clsx(classes.link)}
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
          {/* <i className={"fa fa-tasks mx-1 "+clsx(classes.link)}  aria-hidden="true" /> */}
          {formatMessage({id: 'pricing'})}
        </Link>
      </Typography>
    </ListItemText>
    <ListItemText>
      <Typography variant="subtitle1" align="center">
        <Link className={clsx(classes.link)}
          to={`${process.env.PUBLIC_URL}/log-in`}
        >
          {/* <i className={"fa fa-user mx-1 "+clsx(classes.link)} aria-hidden="true" /> */}
          {formatMessage({id: 'log_in'})}
        </Link>
      </Typography>
    </ListItemText>
  </ListItem>   
  );
 
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <HideOnScroll {...props}>
      <AppBar position="sticky">
        <Toolbar className={clsx(classes.desktopNavbar)}>
        { !desktop ?  
          <Button onClick={toggleDrawer}>
            <Menu color="white" style={{height: 50}}/>
          </Button>
          : menu()
        }
        </Toolbar>
        { !desktop &&
          <Drawer open={open} onClose={toggleDrawer}>
           <div
             //className={clsx(classes.list)}
             role="presentation"
             onClick={toggleDrawer}
             onKeyDown={toggleDrawer}
           >
             <List className={clsx(classes.listContainer)}>
             {menu()}
             </List>
           </div>
         </Drawer>
        }
      </AppBar>
    </HideOnScroll>
  )
};

const mapStateToProps = (state) => ({
  //symbol: state.data.symbol,
  email: state.account.email,
  token: state.account.token
});

export default compose(
  connect(mapStateToProps),
  withStyles(null, { withTheme: true })
)(injectIntl(NavBar));
