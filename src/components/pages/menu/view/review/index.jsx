import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import moment from 'moment';
import { Box, Grid, Divider } from "@material-ui/core";
import { animateScroll } from "react-scroll";
import { compose } from 'recompose';
import { withRouter } from "react-router-dom";
import { Star, KeyboardBackspace } from "@material-ui/icons";
import Form from "./form.jsx";
import { fetchData } from "../../../../utils/fetch.js";
import {StarBorder } from "@material-ui/icons";
import Card from './../item-card.jsx';
import { Button } from "@material-ui/core";
import AverageRating from './../rating-stars';
import Rating from '@material-ui/lab/Rating';

const scrollToRef = (ref) => animateScroll.scrollTo(ref.offsetTop);
//window.scrollTo(0, ref.offsetTop);


const Reviews = (props) => {
  const item_id = props.match.params.item;
  const [reviews, setReviews] = useState([]);
  const {item, style} = !props.menu_title && props.location.state;
  const {menu_title} = props;

  const goBack = () => props.history.goBack();


  const executeScroll = (ref) => scrollToRef(ref);


  useEffect(() => {
    const obj = menu_title ? {title : menu_title} : {item_id: item_id};
    fetchReviews(obj);
  },[]);

  const fetchReviews = async (obj) => {
    let data = await fetchData(obj, "review/get.php");
    setReviews(data);
    console.log(data);
  }

  // const averageRating = () => {
  //   let rating = Math.round(reviews.length && reviews.map(el => parseInt(el.rating)).reduce((a,b) => a+b, 0)/reviews.length);
  //   return (
  //     <>
  //     { [...Array(rating).keys()].map((_i) => (
  //         <Star key={'avg'+_i} fontSize={"small"} />
  //             ))
  //     }
  //     { [...Array(5-rating).keys()].map((_i) => (
  //         <StarBorder key={'avg'+(rating+_i)} fontSize={"small"} />
  //             ))
  //     }
  //   </>
  //   )
  // }

  const averageRating = () => {
    const value = reviews.length && reviews.map(el => parseInt(el.rating)).reduce((a,b) => a+b, 0)/reviews.length;
    return (
      <Rating name="read-only" precision={0.5} value={value} readOnly />
    )
  }

  const fetchProduct = async () => {

  }

  const submit = async (props) => {
    const obj = menu_title ? {menu: props, menu_title} : {item: props, item_id};
    let data = await fetchData(obj, "review/new.php");
    console.log(data);
  }

  return (
    <div >
      <Box className="mx-auto" style={{ maxWidth: 600 }}>
        {!menu_title &&
          <Button color="primary" onClick={goBack}>
            <KeyboardBackspace/>
          </Button>
        }
        {!menu_title && <Card data={item} style={style}/>}
        <Box mx={2} display="flex" alignItems="center" >
          {averageRating()}
          {'  din '+reviews.length+' recenzii'}
        </Box>  
        <Divider />
        <Form submit={submit}/>
        <br/>
        <Divider />
        <br/>
          <Grid container cols={1} spacing={0}>
            { reviews.length>0 ?
              reviews.map((el, i) => (
                <Grid item xs={12} key={"tile"+i} >
                  <Box mx={2}>
                  {el.name}
                  <br/>
                  {'Pe '+moment(parseInt(el.date)*1000).format("DD/MM/YYYY")}
                  <br/>
                  <Rating name="read-only" value={el.rating} readOnly />  
                  <br/>
                  {el.text}
                  <br/>
                  <br/>
                  </Box>
                  <Divider />
                </Grid>
              )) :
              <Box mx={2}>Inca nu exista recenzii</Box>
            }
          </Grid>
      </Box>
    </div>
  );
};

export default 
compose(
    withRouter
)(Reviews);
