import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import * as HighlightType from '../../constants/HighlightTypes';


const cardSource = {
  beginDrag(props) {
    return {
      id: props.todo.id,
      hoverId: props.todo.id
    };
  },

  endDrag(props, monitor) {
    // console.log(monitor.getItem());
    console.log('end ' + props.todo.id + ' - ' + monitor.getItem().id);
    props.dropItem(monitor.getItem().id);
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragId = monitor.getItem().id;
    const hoverTodo = props.todo;

    // Don't replace items with themselves
    if (dragId === hoverTodo.id) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverHeight = (hoverBoundingRect.bottom - hoverBoundingRect.top);

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    //console.log(hoverClientY, hoverHeight);

    if (hoverClientY < hoverHeight * 0.35) {
      props.highlight(hoverTodo.id, HighlightType.ABOVE);
    } else if (hoverClientY > hoverHeight * 0.65) {
      props.highlight(hoverTodo.id, HighlightType.BELOW);
    } else {
      props.highlight(hoverTodo.id, HighlightType.CURRENT);
    }
  }
};


export default class Item extends Component {

  static propTypes = {
    highlight: PropTypes.func.isRequired,
    onChange : PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
    //moveCard: PropTypes.func.isRequired
  };

  _focus(elm) {
    if (elm !== null && this.props.focus) {
      elm.focus();
    }
  }

  render() {
    const { todo, isDragging, draggingItem, connectDragSource, connectDropTarget } = this.props;
    const opacity = draggingItem !== null && draggingItem.id == todo.id ? 0.4 : 1;

    return connectDragSource(
      connectDropTarget(
        <div style={{opacity}} className={this.props.className}>
          <input
            type="checkbox"
            name="checkbox"
            ref={ this._focus.bind(this) }
            checked={todo.done}
            onBlur={this.props.onFocusOut}
            onFocus={this.props.onFocus}
            onChange={this.props.onChange}/>
          {this.props.children}
        </div>
      )
    );
  }
}

Item = DropTarget('card', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Item) || Item;

Item = DragSource('card', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  draggingItem: monitor.getItem(),
  isDragging: monitor
}))(Item) || Item;

export default Item;
