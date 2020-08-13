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
    link: {
      color: props.theme.palette.common.white
    }
  });

  const classes = useStyles();

  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

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
              <ListItemLink href="/dashboard" key={"dash"}>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Dashboard"} />
              </ListItemLink>
              <ListItemLink href="/menu" key={"menu_a"}>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText primary={"Meniurile mele"} />
              </ListItemLink>
              <ListItemLink href="/my-account" key={"my_acc"}>
                <ListItemIcon>
                  <Mail />
                </ListItemIcon>
                <ListItemText  primary={"Contul meu"} />
              </ListItemLink>
            </List>
          </div>
        </Drawer>
      </AppBar>
    </HideOnScroll>
    </>
  );
};

export default withStyles(null, { withTheme: true })(MobileNavBar);
