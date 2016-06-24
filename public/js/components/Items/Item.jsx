import { findDOMNode } from 'react-dom';
import React, { Component, PropTypes } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import * as HighlightType from '../../constants/HighlightTypes';
import Markdown from '../Markdown';

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

  // static contextTypes = {
  //   store: PropTypes.object.isRequired
  // };

  static propTypes = {
    todo: PropTypes.object.isRequired,
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

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.todo !== this.props.todo ||
      nextProps.className !== this.props.className ||
      nextProps.draggingItem !== this.props.draggingItem;
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
          {this.props.visible ? <label
            className={todo.done ? 'complete' : ''}
            onClick={this.props.onFocus}
            dangerouslySetInnerHTML={{__html: this.getLabel(todo)}}></label> : ''}
          {this.getDateControl(todo)}
          {this.getPreview(todo)}
          {this.props.children}
        </div>
      )
    );
  }

  getLabel(todo) {
    // return todo.text + this.getPreviewIcon(todo);
    return getTodoLabel(todo.text) + this.getPreviewIcon(todo);
  }

  getPreview(todo) {
    if (this.props.visible && todo.note && todo.previewNote) {
      return <div className="wrap">
        <div className="block"></div>
        <div className="control note">
          <Markdown text={todo.note}/>
        </div>
      </div>;
    }
  }

  getPreviewIcon(todo) {
    if (todo.note && !todo.previewNote) {
      return "<i class='icon-note'></i>";
    }
    return '';
  }

  getDateControl(todo) {
    if (!todo.dateStart && !todo.dateEnd) return "";
    const dateStart = todo.dateStart ? moment(todo.dateStart).fromNow().toString() : '';
    const dateEnd = todo.dateEnd ? moment(todo.dateEnd).fromNow().toString() : '';
    const dateType = getDateTypeForItem(todo.dateStart, todo.dateEnd);

    // console.log(dateType);
    return <span onClick={this.props.onFocus} className="date">
            {dateType == ItemDateType.STANDARD ?
              <div className={getStyleForDate(dateType)}>
                <div className="start">{dateStart}</div><div className="end">{dateEnd}</div>
              </div> :
              <div className={getStyleForDate(dateType)}>
                <div className="due">{dateEnd}</div>
              </div>}
          </span>;
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

export const ItemDateType = {
  'STANDARD'    : 0,
  'EXPIRED'     : 1,
  'TODAY'       : 2,
  'IN_PROGRESS' : 3
};

export function getDateTypeForItem(dateStart, dateEnd) {  
  if (!dateEnd) return ItemDateType.STANDARD;
  const today = moment();
  if (moment(today).isSameOrAfter(dateEnd)) {
    return ItemDateType.EXPIRED;
  } else if (moment(dateEnd).isSameOrAfter(moment().startOf('day')) && moment(dateEnd).isSameOrBefore(moment().endOf('day'))) {
    return ItemDateType.TODAY;
  } else if (moment(today).isSameOrAfter(dateStart) && moment(today).isSameOrBefore(dateEnd)) {
    return ItemDateType.IN_PROGRESS;
  }

  return ItemDateType.STANDARD;
}

export function getStyleForDate(type) {
  switch (type) {
    case ItemDateType.EXPIRED:
      return "expired";
    case ItemDateType.TODAY:
      return "today";
    case ItemDateType.IN_PROGRESS:
      return "in-progress";
    default:
      return "";
  }

  return styles;
}

export function getTodoLabel(label) {
  return label
    .replace(/(#\S*)/g, (x) => `<span class="context">${x}</span>`)
    .replace(/(@\S*)/g, (x) => `<span class="contact">${x}</span>`);
}
