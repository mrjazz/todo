import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';


const cardSource = {
  beginDrag(props) {
    return {
      id: props.todo.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    if (hoverClientY > hoverMiddleY *.25 && hoverClientY < hoverMiddleY * 1.25) {
      props.setFocus(props.todo.id);
      return;
    }

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY *.25) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY * 1.25) {
      return;
    }

    // Reset focus by reorder
    props.setFocus(null);

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};


export default class Item extends Component {

  static propTypes = {
    onFocus: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    moveCard: PropTypes.func.isRequired,
    setFocus: PropTypes.func.isRequired
  };

  _focus(elm) {
  	//console.info(elm, this.props.focus);
    if (elm != null && this.props.focus) {
    	elm.focus();
    }
  }

  render() {
    const { todo, isDragging, draggingItem, connectDragSource, connectDropTarget } = this.props;
    const opacity = draggingItem !== null && draggingItem.id == todo.id ? 0.4 : 1;

    return connectDragSource(
      connectDropTarget(
        <div style={{opacity}}>
          <input
            type="checkbox"
            name="checkbox"
            ref={ this._focus.bind(this) }
            checked={todo.done}
            onBlur={this.props.onFocusOut}
            onFocus={this.props.onFocus}
            onChange={this.props.onChange} />
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
