import React, { Component} from "react";
import SimpleReactValidator from "simple-react-validator";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../../../firebase";
//import Product from '../menu/product';
import { Typography, Box, Tooltip, Fab, Fade, Button, Divider, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  paperLeft: {
    height: 75, 
    borderRadius: 20, 
    zIndex: 50, 
    alignSelf: 'center',
    '& img': {
      height: 75,
      width: 75
    }
  },
  paperRight: {
    borderRadius: 20,
    display: 'flex', 
    flexDirection: 'column', 
    background: '#ffffff', 
    justifyContent: 'center', 
    padding: '4px 16px 4px 32px', 
    left: -20, 
    marginRight: -20, 
    minHeight: 90, 
    position: 'relative', 
    width: '100%',
  },
  [theme.breakpoints.up(400)]: {
    paperLeft: {
      height: 90,
      '& img': {
        height: 90,
        width: 90
      }
    },
    paperRight: {
      minHeight: 115
    }
  },
  [theme.breakpoints.up('sm')]: {
    paperLeft: {
      height: 125,
      '& img': {
        height: 125,
        width: 125
      }
    },
    paperRight: {
      minHeight: 150
    }
  }
}))


const Item = ({el, style, children, onClick, media, className}) => {
  const classes = useStyles();
  return <Box onClick={onClick} m={2} className={className} display="flex">
        <Paper elevation={2} className={classes.paperLeft} >
          <img src={el.picture} alt={el.name} style={{borderRadius: 20, background: '#e2e2e2'}}/>
        </Paper >
        <Paper 
          elevation={2} 
          className={classes.paperRight}>
        {children}
        </Paper>
      </Box>
}
/*
const mapStateToProps = (state) => ({
  media: state.media
});*/

export default Item;

