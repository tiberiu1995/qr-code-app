import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Edit, Delete} from '@material-ui/icons/';
import { Box } from '@material-ui/core';


import { useDrag, useDrop } from 'react-dnd';
import {TableRow, TableCell} from "@material-ui/core/";

const DND_ITEM_TYPE = 'row'


const useStyles = makeStyles({
    name: {
        color: props => props.name.color,
        size: props => props.name.size,
        font: props => props.name.font,
        textAlign: 'center'
    },
    size: {
        color: props => props.size.color,
        size: props => props.size.size,
        font: props => props.size,
    },
    ingredients: {
        color: props => props.ingredients.color,
        size: props => props.ingredients.size,
        font: props => props.ingredients.font,
    },
  });


const MediaCard = (props) => {
  const classes = useStyles(props.style);


  let picture;
  try {
     picture = props.data.pictures;
  }
  catch(e) {
    picture = "https://eatforum.org/content/uploads/2018/05/table_with_food_top_view_900x700.jpg";
  }

  return (
    <Card className="my-4 p-0" style={{borderRadius: 20}}>
      <CardActionArea className="d-flex" style={{ height: 120}}>
        <CardMedia className="d-block col-lg-3"
          style={{ height:  120, width: 160}}
          image={ picture }
          title="Contemplative Reptile"
        />
        <CardContent className="d-block col-lg-9">
          <Typography className={classes.name} gutterBottom variant="h5" component="h2">
            {props.data.name}
          </Typography>
          <Typography className={classes.ingredients} gutterBottom variant="p" component="p">
            {props.data.ingredients}
          </Typography>
          <Typography className={classes.size} gutterBottom variant="p" component="p">
            {props.data.size}
          </Typography>
        </CardContent>

      </CardActionArea>
    </Card>
  );
}

export default MediaCard