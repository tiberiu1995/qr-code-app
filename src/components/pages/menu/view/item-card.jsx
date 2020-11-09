import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Box, Fade } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { compose } from 'redux';


const useStyles = makeStyles(theme => ({
  name: props => props.name,
  size: props => props.size,
  ingredients: props => props.ingredients,
  alergens: props => props.alergens,
  calories: props => props.calories,
  cardMedia: { 
    flex: '0 0 auto', 
    height: 110, 
    width: 110, 
    backgroundSize: "contain",
    [theme.breakpoints.up('450')]:{
          width: 125, 
          height: 125, 
    },
    [theme.breakpoints.up('500')]:{
          width: 140, 
          height: 140, 
    },
    [theme.breakpoints.up('600')]:{
          width: 150, 
          height: 150, 
    },
  },
  card: {
    borderRadius: 20, 
    position: "relative", 
    zIndex: 150,
    margin: [[0, 16, 16, 16]],
    '& > button': {
      cursor: 'initial',
    },
    '&:first-child': {
      marginTop: 16
    },
    [theme.breakpoints.up('600')]: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 568
    }
  },
  cardContent: {
    flex: '1 1 auto',
    padding: '4px 4px 4px 16px',
  }
}));

const MediaCard = (props) => {
  const classes = useStyles(props.style);
  const [showReviews, setShowReviews] = useState(false);
  const item_id = props.match.params.item;

  let picture;
  try {
    picture = props.data.picture;
  } catch (e) {
    picture =
      "";
  }

  return (
    <Fade timeout={{
      appear: 1000,
      enter: 1000+props.id*1000,
      exit: 0,
     }} in={props.data.name !== ''}>
      <Card className={classes.card} >
        <CardActionArea className="d-flex justify-content-between">
          <CardMedia
            className={"d-block "+classes.cardMedia}
            image={picture}
            title=""
          />
          <CardContent className={classes.cardContent}>
            <Typography
              className={classes.name}
              gutterBottom
              variant="h5"
              component="h2">
              {props.data.name}
            </Typography>
            { props.review }
            <Typography
              className={classes.ingredients}
              gutterBottom>
              {props.data.ingredients}
            </Typography>
            <Typography className={classes.size} gutterBottom component="p">
              {props.data.size.map(el => el.size=="{}" ? el.price : el.size+" "+el.price).join(" | ")}
            </Typography>
            { props.getExtra }
          </CardContent>
        </CardActionArea>
      </Card>

      {/* {showReviews && (
        <Fade in={showReviews}>
          <Card
            className="p-0"
            style={{
              borderRadius: "0 0 20px 20px",
              position: "relative",
              marginTop: "-3em",
              zIndex: 150,
            }}
          >
            <CardActionArea className="d-flex">
              <CardContent>
                {reviews.map((i) => (
                  <>
                    <Typography
                      className={classes.size}
                      gutterBottom
                      component="p"
                    >
                      {i.name}
                    </Typography>
                    {[...Array(i.rating).keys()].map((_i) => (
                      <Star fontSize={"small"} />
                    ))}
                    <Typography
                      className={classes.size}
                      gutterBottom
                      component="p"
                    >
                      {i.text}
                    </Typography>
                  </>
                ))}
              </CardContent>
              <CardContent className="d-flex">
                <Close
                  onClick={(e) => setShowReviews(false)}
                  fontSize={"large"}
                  color="primary"
                />
              </CardContent>
            </CardActionArea>
          </Card>
        </Fade>
      )} */}
      {/* <RateReviewTwoTone
        onClick={(e) => setShowReviews(true)}
        fontSize={"large"}
        color="primary"
        style={{ position: "absolute", zIndex: 100, margin: "-1em", left: 60 }}
      /> */}
    </Fade>
  );
};

export default 
  compose(
    withRouter
  )(MediaCard);
