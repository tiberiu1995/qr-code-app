import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { TableRow, TableCell, useMediaQuery } from "@material-ui/core/";
import { Box } from '@material-ui/core';
import { ArrowDropDown } from "@material-ui/icons";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

const DND_ITEM_TYPE = "row";

const Row = ({ media, row, index, moveRow, style }) => {
  const lt600 = useMediaQuery('(max-width:599px)');

  
  const data = () => {
   if(!lt600) 
    return row.cells.map((cell) => 
         <TableCell align="center" {...cell.getCellProps()}>
           {cell.render("Cell")}
         </TableCell>
     );
    else
     return row.cells.map((cell) => ["name", "category", "title", "cat_no", "item_no", "move", "picture"].includes(cell.column.id) &&
     <TableCell align="center" padding={media.mobile ? "none" : "none" } {...cell.getCellProps()}>
       {cell.render("Cell")}
     </TableCell>);
  }

  return (
    <TableRow style={{...style}}>
      { data() }
    </TableRow>
  );
};


const mapStateToProps = (state) => ({
  media: state.media
});


export default 
  compose(
    connect(mapStateToProps)
    )(injectIntl(Row));

{/*<TableCell colSpan={3}>
        <Box display="flex" justifyContent="space-between">
        { row.cells.map((cell) => {
          return ["name", "category"].includes(cell.column.id) ? 
            <Box {...cell.getCellProps()}>
              {cell.render("Cell")}
            </Box> : ''
        })
        }
        </Box>
        <Box display="flex" justifyContent="space-between">
        { row.cells.map((cell) => {
          return ["picture", "move"].includes(cell.column.id) ? 
            <Box {...cell.getCellProps()}>
              {cell.render("Cell")}
            </Box> : ''
        })
      }
        </Box>
      </TableCell> */}

{/*const dropRef = React.useRef(null)
  const dragRef = React.useRef(null)

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: DND_ITEM_TYPE, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = 1

  preview(drop(dropRef))
  drag(dragRef)*/
///*ref={dragRef}*/
}      