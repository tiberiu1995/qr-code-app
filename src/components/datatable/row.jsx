import React, { Component, Fragment, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {TableRow, TableCell} from "@material-ui/core/";

const DND_ITEM_TYPE = 'row'

const Row = ({ row, index, moveRow }) => {
  /*const dropRef = React.useRef(null)
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

  return (
    <TableRow /*ref={dropRef}*/ /*style={{ opacity }}*/>
      {row.cells.map(cell => {
        return cell.column.id==='move' ? 
          <TableCell key={cell.value+cell.column.id} /*ref={dragRef}*/ {...cell.getCellProps()}>{cell.render('Cell')}</TableCell> :
          <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
      })}
      
    </TableRow>
  )
}

export default Row;