import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import * as HighlightType from '../../constants/HighlightTypes';
import Todo from '../../models/todo';

import {checkTodo, flipTodo} from '../../actions/todos';


const dropSource = {
  beginDrag(props) {
    return {
      id: props.todo.id,
      hoverId: props.todo.id
    };
  },

  endDrag(props, monitor) {
    // console.log(monitor.getItem());
    // console.log('end ' + props.todo.id + ' - ' + monitor.getItem().id);
    props.dropItem(monitor.getItem().id);
  }
};

const dropTarget = {
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

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  // static propTypes = {
  //   todo : PropTypes.instanceOf(Todo).isRequired,
  //   focus : PropTypes.bool.isRequired, // is true when need set focus on Item
  //   highlight: PropTypes.func.isRequired,
  //   onChange : PropTypes.func.isRequired,
  //   connectDragSource: PropTypes.func.isRequired,
  //   connectDropTarget: PropTypes.func.isRequired
  //   //moveCard: PropTypes.func.isRequired
  // };

  constructor() {
    super();
    this._flipItem  = this._flipItem.bind(this);
    this._checkTodo = this._checkTodo.bind(this);
  }

  _focus(elm) {
    if (elm !== null && this.props.focus) {
      elm.focus();
    }
  }

  _flipItem() {
    this.context.store.dispatch(flipTodo(this.props.todo.id));
  }

  _checkTodo() {
    this.context.store.dispatch(checkTodo(this.props.todo.id));
  }

  render() {
    const { todo, draggingItem, connectDragSource, connectDropTarget } = this.props;
    const opacity = draggingItem !== null && draggingItem.id == todo.id ? 0.4 : 1;

    return connectDragSource(
      connectDropTarget(
        <div style={{opacity}} className={this.props.className}>
          {this._getIcon()}
          <input
            type="checkbox"
            name="checkbox"
            checked={todo.done}
            ref={ this._focus.bind(this) }
            onFocus={this.props.onFocus}
            onChange={this._checkTodo}/>
          {this.props.children}
        </div>
      )
    );
  }

  _getIcon() {
    const todo = this.props.todo;

    if (todo.children.length == 0) {
      return <i className="icon-empty"></i>;
    }

    if (todo.open) {
      return <i className="icon-open" onClick={this._flipItem}></i>;
    } else {
      return <i className="icon-closed" onClick={this._flipItem}></i>;
    }

  }
}

Item = DropTarget('todoItem', dropTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(Item) || Item;

Item = DragSource('todoItem', dropSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  draggingItem: monitor.getItem(),
  isDragging: monitor
}))(Item) || Item;

export default Item;
