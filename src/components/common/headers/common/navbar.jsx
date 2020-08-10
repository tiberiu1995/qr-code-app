import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { withTranslate } from 'react-redux-multilingual';
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
  withStyles, } from '@material-ui/core';
import { useTheme } from '@material-ui/styles';

const NavBar = (props) => {

  const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    function handleListKeyDown(event) {
      if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
      }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
      if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
      }

      prevOpen.current = open;
    }, [open]);

    const theme = props.theme;
    const up_sm = useMediaQuery(theme.breakpoints.up('sm'));


    return (
          up_sm &&
          <List component="nav">
            <ListItem component="div">
              <ListItemText inset>
                <Typography color="inherit" variant="h5">
                  <Link className="text-light" to={`${process.env.PUBLIC_URL}/dashboard`}>
                      <i className="fa fa-sliders text-light mx-1" aria-hidden="true"/>
                      Dashboard
                   </Link>
               </Typography>
              </ListItemText>
              <ListItemText inset>
                <Typography color="inherit" variant="h5">             
                  <Link className="text-light" to={`${process.env.PUBLIC_URL}/menu`}>
                      <i className="fa fa-tasks text-light mx-1" aria-hidden="true"/>
                      Administrare meniuri
                  </Link>
                </Typography>
              </ListItemText>
              <ListItemText inset>
                <Typography color="inherit" variant="h5">
                  <Link className="text-light" to={`${process.env.PUBLIC_URL}/my-account`}>
                      <i className="fa fa-user text-light mx-1" aria-hidden="true"/>
                      Contul meu
                  </Link>
                </Typography>
              </ListItemText>
            </ListItem >
          </List>
        )
}


export default withStyles(null, { withTheme: true })(NavBar);