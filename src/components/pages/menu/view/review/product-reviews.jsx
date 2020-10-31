import React, { useRef, useState, useEffect } from "react";
import moment from 'moment';
import { Box, Grid, Divider, Typography } from "@material-ui/core";
import { animateScroll } from "react-scroll";
import { compose } from 'recompose';
import { withRouter } from "react-router-dom";
import Form from "./form.jsx";
import { fetchData } from "../../../../utils/fetch.js";
import { Button } from "@material-ui/core";
import Rating from '@material-ui/lab/Rating';
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from "@material-ui/icons/";
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

const scrollToRef = (ref) => animateScroll.scrollTo(ref.offsetTop);
//window.scrollTo(0, ref.offsetTop);

const useStyle = makeStyles(theme => ({
  [theme.breakpoints.up('sm')]: {
    modal: {
      '&.MuiGrid-container': {
        maxHeight: 200,
        overflow: 'scroll'
      }
    }
  }
}));


const Reviews = (props) => {
  const item_id = props.item.id;
  const [reviews, setReviews] = useState([]);
  //const [show, setShow] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(5);
  const {menu_title} = props;
  const classes = useStyle();

  useEffect(() => {
    const obj = {item_id: item_id, page: page, count: count};
    props.show && fetchReviews(obj);
  },[]);

  const fetchReviews = async (obj) => {
    let data = await fetchData(obj, "review/get.php");
    setReviews(data);
  }

  const avgRating = reviews.length && (reviews.map(el => parseInt(el.rating)).reduce((a,b) => a+b, 0)/reviews.length);
    
  const averageRating = (
      <Rating size="small" name="read-only" precision={0.5} value={avgRating} readOnly />
  )


  const submit = async (props) => {
    const obj = {item: props, item_id};
    let data = await fetchData(obj, "review/new.php");
    data.success === true && setReviews(data.data);
  }

  return (
     <Modal
        backdrop="static"
        className={"justify-content-center "+(!props.media.mobile && "d-flex")}
        show={props.show}
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        onHide={props.onCancel}
        size="lg"
        centered
      >
        <Modal.Header className="p-3" closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Reviews</Modal.Title>
        </Modal.Header>
        <ModalBody className="p-3">
            <Box>
      { reviews.length ?
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
      </>
      : ''}
      <Box 
        display={ (!menu_title || props.show) ? "inherit" : "none"}
        className="mx-auto" style={{ maxWidth: 600 }}>
        <Form key="pr00" submit={submit}/>
        <br/>
        <Divider />
        <br/>
          <Grid className={classes.modal} container cols={1} spacing={0}>
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
                  Page {page + 1}/{Math.ceil(reviews.length/count)}
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
    </Box>
        </ModalBody>
      </Modal>
  );
};

const mapStateToProps = (state) => ({
  media: state.media
})

export default 
compose(
  connect(mapStateToProps),
  withRouter
)(Reviews);
