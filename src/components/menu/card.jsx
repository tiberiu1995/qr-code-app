import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { ItemTypes } from '../../ItemTypes'
import Button from "react-bootstrap/Button";
export const Card = ({ id, data, edit, index, getContent, moveCard }) => {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()
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
      moveCard(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.CARD, id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
      <tr ref={ref} key={data.id}>
        <td><img width="90%" src={data.pictures[0] ? data.pictures[0].img : ''}/></td>
        <td>{getContent(data.name)}</td>
        <td>{getContent(data.description)}</td>
        <td>{getContent(data.category)}</td>
        <td>{getContent(data.size)}</td>
        <td>{getContent(data.ingredients)}</td>
        <td><Button onClick={(e) => edit(e,data)}>Edit</Button></td>
      </tr>
  )
}
