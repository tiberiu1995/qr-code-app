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
import { HelpOutline, BlurOn } from '@material-ui/icons';
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
  const dropRef = React.useRef(null);
  const dragRef = React.useRef(null);

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: DND_ITEM_TYPE, index: props.index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = 1;

  preview(drop(dropRef));
  drag(dragRef);

  let picture;
  try {
    picture = props.data.picture;
  } catch (e) {
    picture =
      "";
  }

  return (
    <Card ref={dragRef} className="mb-2 p-0">
      <CardActionArea className="d-flex justify-content-between">
        <CardMedia
          className="d-block"
          style={{ height: 100, width: 100 }}
          image={picture}
          title=""
        />
        <CardContent ref={dropRef} className={"d-block "+classes.cardContent}>
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
            {props.data.selected}/{props.data.total}
            { props.edit 
              ? <Edit
                className={classes.edit}
                size="small"
                color="primary"
                onClick={(e) => props.edit(props.data.id)}/>
              : '' }
            { props.remove 
              ? <Remove
                className={classes.delete}
                size="small"
                color="primary"
                onClick={(e) => props.remove(props.data.id)}/> 
              : '' }
            { props.add 
              ? <Add
                  className={classes.edit}
                  size="small"
                  color="primary"
                  onClick={(e) => props.add(props.data.id)}/> 
              : '' }
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MediaCard;
