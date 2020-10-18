import React, { Component, Fragment } from "react";
import SimpleReactValidator from "simple-react-validator";
import { compose } from "recompose";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { withFirebase } from "../../../firebase";
//import Product from '../menu/product';
import { Typography, Box, Tooltip, Fab, Fade, Button, Divider, Paper } from "@material-ui/core";
import { Grid } from "@material-ui/core/";
import GridImage from "./image-grid.jsx";
import Card from "./item-card.jsx";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { ArrowDropUp, RateReviewSharp } from "@material-ui/icons/";
import { animateScroll } from "react-scroll";
import { fetchMenuView, fetchMenu, fetchMenuDesign, fetchData } from '../../../utils/fetch';
import Reviews from './review';
import CustomTabs from './tabs.jsx';

const Item = ({el, style, children, onClick}) => {
  return <Box onClick={onClick} my={1} display="flex">
        <Paper elevation={2} style={{height: 75, borderRadius: 20, zIndex: 50, alignSelf: 'center'}} >
          <img  src={el.picture} alt={el.name} style={{borderRadius: 20, background: '#e2e2e2'}} height="75" width="75" />
        </Paper >
        <Paper 
          elevation={2} 
          style={{
            borderRadius: 20,
            display: 'flex', 
            flexDirection: 'column', 
            background: '#ffffff', 
            justifyContent: 'center', 
            padding: '8px 16px 8px 32px', 
            left: -20, 
            marginRight: -20, 
            minHeight: 90, 
            position: 'relative', 
            width: '100%' }}>
        {children}
        </Paper>
      </Box>
}

export default Item;

