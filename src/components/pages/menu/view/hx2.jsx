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
  box: {
    width: '40%',
    display: 'flex'
  },
  paperLeft: {
    borderRadius: 20, 
    zIndex: 50, 
    alignSelf: 'center',
    '& img': {
      width: '100%'
    },
    '& .MuiTypography-root': {
      position: 'absolute'
    }
  },
  [theme.breakpoints.up('sm')]: {
    paperLeft: {
      '& img': {
      }
    },
  }
}))


const Item = ({el, style, children, onClick, media}) => {
  const classes = useStyles();
  return <Box className={classes.box} onClick={onClick} m={2} display="flex">
        <Paper elevation={2} className={classes.paperLeft} >
          <img src={el.picture} alt={el.name} style={{borderRadius: 20, background: '#e2e2e2'}}/>
          {children}
        </Paper >  
      </Box>
}
/*
const mapStateToProps = (state) => ({
  media: state.media
});*/

export default Item;

