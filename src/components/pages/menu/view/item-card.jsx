import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  Edit,
  Delete,
  RateReview,
  RateReviewTwoTone,
  Close,
  Star,
} from "@material-ui/icons/";
import { Box, Fade } from "@material-ui/core";

import { useDrag, useDrop } from "react-dnd";
import { TableRow, TableCell } from "@material-ui/core/";
import { Link, withRouter } from "react-router-dom";
import { compose } from 'redux';


const useStyles = makeStyles({
  name: props => props.name,
  size: props => props.size,
  ingredients: props => props.ingredients,
  alergens: props => props.alergens,
  calories: props => props.calories,
});

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
      enter: 1000+props.id*2500,
      exit: 0,
     }} in={props.data.name !== ''}>
      <Card
        className="my-4 p-0"
        style={{ borderRadius: 20, position: "relative", zIndex: 150 }}
      >
        <CardActionArea className="d-flex">
          {!props.disableImages && <CardMedia
            className="d-block col-4 col-sm-4"
            style={{ height: 100, backgroundSize: "contain" }}
            image={picture}
            title=""
          />
          }
          <CardContent className="d-block col-8 col-sm-8">
            <Typography
              className={classes.name}
              gutterBottom
              variant="h5"
              component="h2"
            >
              {props.data.name}
            </Typography>
            <Typography
              className={classes.ingredients}
              gutterBottom
              component="p"
            >
              {props.data.ingredients
                ? "Ingrediente: " + props.data.ingredients
                : ""}
            </Typography>
            <Typography className={classes.alergens} gutterBottom component="p">
              {props.data.alergens ? "Alergeni: " + props.data.alergens : ""}
            </Typography>
            <Typography className={classes.calories} gutterBottom component="p">
              {props.data.calories ? "Calorii: " + props.data.calories : ""}
            </Typography>
            <Typography className={classes.size} gutterBottom component="p">
              {props.data.size}
            </Typography>
            { !props.disableReviews && !item_id ? 
                ( !props.isPreview ? 
                  <Link to={{
                    pathname: `${props.location.pathname}reviews/${props.data.id}/`,
                    state: ({
                      item: props.data,
                      style: props.style
                    })
                    }}>
                    Vezi recenzii
                  </Link> :
                  'Vezi recenzii'
                ) : ''
            }
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
