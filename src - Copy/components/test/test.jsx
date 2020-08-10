import React, { Component, useState, useCallback } from 'react'
import Card from './Card'
import update from 'immutability-helper'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const style = {
  width: 400,
}
export class Container extends Component {
  constructor(props) {
        super(props)
        this.edit = false;
        this.state = {
        }
  }

  render() {
    return (
      <Card/> 
      )
    }
}
