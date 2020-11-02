import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Edit, Delete, Remove } from "@material-ui/icons/";
import { Box, Tooltip } from "@material-ui/core";

import { useDrag, useDrop } from "react-dnd";
import { TableRow, TableCell } from "@material-ui/core/";
import { HelpOutline } from '@material-ui/icons';
import { Add } from '@material-ui/icons';

const DND_ITEM_TYPE = "row";

const useStyles = makeStyles(theme => ({
  edit: {
      color: '#4caf50',
  },
  delete: {
    color: '#f44336',
  },
  cardContent: {
    flex: '1 1 auto'
  }
}));


const MediaCard = (props) => {
  const classes = useStyles();
  const moveRow = props.moveRow;
  const opacity = 1;


  let picture;
  try {
    picture = props.data.picture;
  } catch (e) {
    picture =
      "";
  }

  return (
    <Card className="mb-2 p-0">
      <CardActionArea className="d-flex justify-content-between">
        <CardMedia
          className="d-block"
          style={{ height: 100, width: 100 }}
          image={picture}
          title=""
        />
        <CardContent className={"d-block "+classes.cardContent}>
          <Typography
            className="text-center"
            gutterBottom
            variant="subtitle1"
            component="h5" >
            {props.data.name}
          </Typography>
          <Box className="float-right">
            {/* <Tooltip title={
              <>
               <Typography component="span">
                Drag and drop {props.data.name} to change its position in the menu
              </Typography>
              </>
            }>
              <HelpOutline/>
            </Tooltip> */}
            {props.edit ? 
              <Edit
                className={classes.edit}
                size="small"
                color="primary"
                onClick={(e) => props.edit(props.data.id)}
              />: ""}
            { props.remove ?
              <Remove
                className={classes.delete}
                size="small"
                color="primary"
                onClick={(e) => props.remove(props.data.id)}
              />: ''
            }
            { props.add ?
              <Add
                className={classes.edit}
                size="small"
                color="primary"
                onClick={(e) => props.add(props.data.id)}
              />: ''
            }
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MediaCard;
