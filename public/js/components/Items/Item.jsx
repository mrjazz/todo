import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import * as HighlightType from '../../constants/HighlightTypes';
import Todo from '../../models/todo';

import {flipTodo} from '../../actions/todos';
import moment from 'moment';

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
    props.onDrop(monitor.getItem().id);
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
      props.highlight(hoverTodo.id, HighlightType.HOVER);
    }
  }
};


export default class Item extends Component {

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static propTypes = {
    todo: PropTypes.instanceOf(Todo).isRequired,
    focus: PropTypes.bool.isRequired, // is true when need set focus on Item
    visible: PropTypes.bool.isRequired,
    highlight: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onFlipTodo: PropTypes.func.isRequired,
    onCheckTodo: PropTypes.func.isRequired,
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
    const { todo, draggingItem, connectDragSource, connectDropTarget } = this.props;
    const opacity = draggingItem !== null && draggingItem.id == todo.id ? 0.4 : 1;

    // {todo.dateStart.toString()} - {todo.dateEnd.toString()}

    return connectDragSource(
      connectDropTarget(
        <div style={{opacity}} className={this.props.className}>
          {this._getIcon()}
          <input
            type="checkbox"
            name="checkbox"
            checked={todo.done}
            ref={this._focus.bind(this)}
            onKeyDown={this.props.onKeyDown}
            onBlur={this.props.onFocusOut}
            onFocus={this.props.onFocus}
            onChange={this.props.onCheckTodo}
          />
          {this.props.visible ? <label className={todo.done ? 'complete' : ''} onClick={this.props.onFocus}>{todo.text} - {todo.id}</label> : ''}
          {this.getPreviewIcon(todo)}
          {this.getDateControl(todo)}
          {this.getPreview(todo)}
          {this.props.children}
        </div>
      )
    );
  }

  getPreview(todo) {
    if (todo.note && todo.previewNote) {
      return <div>preview</div>;
    }
  }

  getPreviewIcon(todo) {
    if (todo.note && !todo.previewNote) {
      return <i className="icon-note"></i>;
    }
  }

  getDateControl(todo) {
    const dateStart = todo.dateStart ? moment(todo.dateStart).fromNow().toString() : '';
    const dateEnd = todo.dateEnd ? moment(todo.dateEnd).fromNow().toString() : '';
    return <span className="date" onClick={this.props.onFocus}>
            <div className="start">{dateStart}</div><div className="end">{dateEnd}</div>
          </span>
  }

  _getIcon() {
    const todo = this.props.todo;

    if (todo.children.length == 0) {
      return <i className="icon-empty"></i>;
    }

    if (todo.open) {
      return <i className="icon-open" onClick={this.props.onFlipTodo}></i>;
    } else {
      return <i className="icon-closed" onClick={this.props.onFlipTodo}></i>;
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
