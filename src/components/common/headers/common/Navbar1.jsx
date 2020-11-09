import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles, ListItem, ListItemText, useMediaQuery, useScrollTrigger, Slide, Drawer } from '@material-ui/core';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { useState } from 'react';
import { Box } from '@material-ui/core';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  link: {
    color: '#000000',
  },
  drawer: {
   '& .MuiListItemText-root a': {
      color: theme.palette.text.primary,
    }
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menu: {
    [theme.breakpoints.down('lmd')]: {
      flexDirection: 'column',
    },
    [theme.breakpoints.up('md')]: {
      '& .MuiListItemText-root': {
        flex: '0 auto',
        margin: [[0, 16]]
      },
    }
  }
}));

const HideOnScroll = (props) => {
  const { children, window } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}


const NavBar = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false)
  const desktop = useMediaQuery('(min-width:900px)');
  const {formatMessage} = props.intl;

  const handleProfileMenuOpen = (event) => {
    props.history.push('/my-account/profile');
    //setAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const generateMenu = (array, style) => (
    <ListItem component="div" className={classes.menu+" "+style.className} > 
    { array.map((el,i) => (
        <ListItemText key={'nb'+i}>
          <Typography variant="subtitle1" align="center">
            <Link className={clsx(classes.link)} to={`${process.env.PUBLIC_URL}/${el.url}`} >
              {formatMessage({id: el.id || el.url})}
            </Link>
          </Typography>
        </ListItemText>
    ))
    }
    </ListItem>
  )

  const arr1 = [
    {id: 'menu_admin', url: 'menu'}, 
    {id: 'profile', url: 'my-account/profile'}, 
    {id: 'plan', url: 'my-account/plan'}, 
    {id: 'settings', url: 'my-account/settings'}];
  const arr2 = [ {id: 'menu_admin', url: 'menu'} ];
  const arr3 = [ {url: 'home'}, ];
  const arr6 = [
     {id: 'menu_admin', url: 'menu'}, 
    {url: 'log-in'}, 
    {url: 'register'}];
  
  return (
    <div className={classes.grow}>
      <HideOnScroll {...props}>
      <AppBar position="sticky">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" style={{flex: '1 1 auto'}}>
            <Box display="flex">
              <IconButton
                edge="start"
                className={classes.menuButton+" "+classes.sectionMobile}
                color="inherit"
                onClick={toggleDrawer}
                aria-label="open drawer">
                <MenuIcon />
              </IconButton>
              <img src="https://bathtimestories.com/wp-content/uploads/2020/07/smartphone.png" height="50"/>
              { props.token ? 
                ( props.history.location.pathname.indexOf("account")>=0 ?
                    generateMenu(arr1, {className: classes.sectionDesktop}) :
                    generateMenu(arr2, {className: classes.sectionDesktop})
                ) : 
                generateMenu(arr3, {className: classes.sectionDesktop})
              }
            </Box>
            { 
              <Box display="flex">  
              { props.token ?
                <>
                  <Typography style={{alignSelf: 'center'}}  className={classes.link} variant="subtitle2" align="center">  
                    { formatMessage({id: 'greeting'}) }, {props.name}
                  </Typography> 
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit">
                    <AccountCircle />
                  </IconButton>
                </> :
                generateMenu([{url: 'log-in'}, {url: 'register'}], {className: classes.sectionDesktop})
              }
              {/* { props.history.location.pathname.indexOf("account")>=0 } */}
              
            </Box>
            }
          </Box>
        </Toolbar>
        <Drawer open={open} onClose={toggleDrawer} className={classes.drawer}>
           <div
             //className={clsx(classes.list)}
             role="presentation"
             onClick={toggleDrawer}
             onKeyDown={toggleDrawer}
           >
            { props.token ? 
              ( props.history.location.pathname.indexOf("account")>=0 ?
                generateMenu(arr1, {className: classes.sectionMobile}) :
                generateMenu(arr2, {className: classes.sectionMobile})
              ) : 
              generateMenu(arr6, {className: classes.sectionMobile})
            }
             {/* { props.history.location.pathname.indexOf("account")>=0 || 
              menu({className: classes.sectionMobile},'right',props.email) } */}
           </div>
         </Drawer>
      </AppBar>
      </HideOnScroll>
    </div>
  );
}

const mapStateToProps = (state) => ({
    //symbol: state.data.symbol,
    name: state.account.name,
    email: state.account.email,
    token: state.account.token
});
  
  export default compose(
    withRouter,
    connect(mapStateToProps),
    withStyles(null, { withTheme: true })
  )(injectIntl(NavBar));
  