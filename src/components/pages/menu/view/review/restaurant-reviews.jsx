import React, { useRef, useState, useEffect } from "react";
import moment from 'moment';
import { Box, Grid, Divider, Typography } from "@material-ui/core";
import { animateScroll } from "react-scroll";
import { compose } from 'recompose';
import { withRouter } from "react-router-dom";
import { Star, KeyboardBackspace } from "@material-ui/icons";
import Form from "./form.jsx";
import { fetchData } from "../../../../utils/fetch.js";
import Card from './../item-card.jsx';
import { Button } from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons/";
const scrollToRef = (ref) => animateScroll.scrollTo(ref.offsetTop);
//window.scrollTo(0, ref.offsetTop);


const Reviews = (props) => {
  const [reviews, setReviews] = useState([]);
  const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(5);
  const {menu_title} = props;

  const goBack = () => props.history.goBack();


  const executeScroll = (ref) => scrollToRef(ref);


  useEffect(() => {
    const obj = {title: menu_title, page: page, count: count};
    fetchReviews(obj);
  },[]);

  const fetchReviews = async (obj) => {
    let data = await fetchData(obj, "review/get.php");
    setReviews(data);
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
  const avgRating = reviews.length && (reviews.map(el => parseInt(el.rating)).reduce((a,b) => a+b, 0)/reviews.length);
    
  const averageRating = (
      <Rating size="small" name="read-only" precision={0.5} value={avgRating} readOnly />
  )


  const submit = async (props) => {
    const obj = {menu: props, menu_title};
    let data = await fetchData(obj, "review/new.php");
    data.success === true && setReviews(data.data);
  }

  return (
    <Box>
        <Typography variant="h5">
          Reviews
        </Typography>
      { (menu_title && reviews.length) ?
      <>  
        <Box display="flex" alignItems="center" >
          <Typography variant="h5">
            {avgRating.toFixed(2)}
          </Typography>
          {averageRating}
          <Typography>
            {reviews.length+' reviews'}
          </Typography>
        </Box> 
        <Button variant="contained" color="primary" onClick={()=>{setShow(!show)}}>
          {show ? "Hide reviews" : "Show reviews"}
        </Button>
      </>
      : ''}
      { show &&
        <Box display={ (!menu_title || show) ? "inherit" : "none"} className="mx-auto">
        <Form key="rr00" submit={submit}/>
        <br/>
        <Divider />
        <br/>
          <Grid container cols={1} spacing={0}>
            { reviews.length>0 ?
              <>
              {reviews
                .filter((el,i) => i>= page*count && i < Math.min((page+1)*count, reviews.length))
                .map((el, i) => (
                  <Grid item xs={12} key={"tile"+i} >
                    <Box display="flex" >
                      <Box 
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                          height: 40, 
                          minWidth: 40, 
                          margin: 5,
                          borderRadius: 50,
                          background: '#444444'}}>
                        <Typography style={{color: 'white'}}>
                          {el.name[0].toUpperCase()}
                        </Typography>
                      </Box>
                      <Box mb={4} >
                        <Typography display="inline">
                          {el.name}
                        </Typography>
                        <Box display="flex">
                          <Rating size="small" name="read-only" value={parseInt(el.rating)} readOnly />  
                          <Typography style={{fontSize: 12, marginLeft: 4}}>
                          {moment(parseInt(el.date)*1000).format("DD/MM/YYYY")}
                          </Typography>
                        </Box>
                        <Typography>
                          {el.text}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
              ))}
              <Grid item xs={12} align="center">
                <Button
                  style={{padding: 10}}
                  onClick={() => {setPage(0)}}
                  disabled={(page==0)}>
                  <FirstPage />
                </Button>
                <Button
                  onClick={() => {setPage(page-1);}}
                  disabled={(page===0)}>
                  <NavigateBefore />
                </Button> 
                <span className="mx-2">
                  Page {page + 1}/{Math.floor(reviews.length/count)+1}
                </span>           
                <Button
                  onClick={() => { setPage(page+1) }}
                  disabled={(reviews.length <= (page+1)*count)} >
                  <NavigateNext />
                </Button>
                <Button
                  onClick={() => { setPage(Math.floor(reviews.length/count)) }}
                  disabled={(reviews.length <= (page+1)*count)}>
                  <LastPage />
                </Button> 
              </Grid>
              </>
              
               :
              <Box mx={2}>Inca nu exista recenzii</Box>
            }
          </Grid>
      </Box>
      }
    </Box>
  );
};

export default 
compose(
    withRouter
)(Reviews);
