import React, {Component, PropTypes} from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemAdd from './ItemAdd.jsx';
import Item from './Item.jsx';

import * as HighlightType from '../../constants/HighlightTypes';

import {searchr, filterr, searchrIndex, searchrByIndex, lengthr} from '../../lib/CollectionUtils.js';


export default class ItemsList extends Component {
  constructor() {
    super();
    this.state = {cards: [], focusId: null, editId: null, filter: 'all', highlightStyle: HighlightType.NONE};
    //this.moveCard      = this.moveCard.bind(this);
    this.dropItem      = this.dropItem.bind(this);
    this.highlightItem = this.highlightItem.bind(this);
  }

  static propTypes = {
    items      : React.PropTypes.array.isRequired,
    checkTodo  : PropTypes.func.isRequired,
    swapTodos  : PropTypes.func.isRequired,
    updateTodo : PropTypes.func.isRequired,
    makeChildOf: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.setState({
      items: this.props.items
    });
  }

  dropItem(id) {
    if (this.state.focusId !== null && this.state.focusId !== id) {
      console.log(`drop ${id} ${this.state.highlightStyle} ${this.state.focusId}`);
      switch (this.state.highlightStyle) {
        case HighlightType.CURRENT:
          this.props.makeChildOf(id, this.state.focusId);
          break;
        case HighlightType.ABOVE:
        case HighlightType.BELOW:
          //this.props.swapTodos(dragId, hoverId);
          break;
      }

      // console.log(this.props.items);
      this.highlightItem(id, HighlightType.CURRENT);
    }
  }

  render() {
    return <div className="todos" ref="self" onKeyDown={this._keyPressHandler.bind(this)}>
      <ul className="filters">
        {['all', 'completed', 'active'].map((title, key) =>
          <li key={key} className={this.state.filter === title ? 'active' : ''}>
            {this.state.filter === title ?
              title :
              <a href="#"
                onClick={() => {this._handleFilter(title)}}
                onKeyPress={() => {this._handleFilter(title)}}>
                {title}
              </a>
            }
          </li>
        )}
      </ul>
      <div className="all-items">
        {this._getItems(this._filter(this.props.items))}
      </div>
    </div>
  }

  highlightItem(focusId, type) {
    // small optimization
    if (focusId === this.state.id && type == this.state.highlightStyle) return;
    this.setState(Object.assign(this.state, {highlightStyle: type, focusId}));
  }

  _getItems(items) {
    return items.map(
      (i, j) => <div key={j} className="items">
        <Item
          className={this._stylesForItem(i)}
          todo={i}
          index={j}
          moveCard={this.moveCard}
          dropItem={this.dropItem}
          focus={this.state.focusId == i.id}
          highlight={this.highlightItem}
          //setFocus={(id) => this.setState(Object.assign(this.state, {focusId: id}))}
          onFocusOut={() => this._handleItemFocus(null)}
          onFocus={() => this._handleItemFocus(i.id)}
          onChange={() => this.props.checkTodo(i.id)}>
        {i.id == this.state.editId ?
          <ItemAdd
            value={i.text}
            onUpdate={this._handleUpdateItem.bind(this, i.id)}
            onFocusOut={this._handleCancelUpdate.bind(this, i.id)} />
          : <label onClick={this._handleItemFocus.bind(this, i.id)}>{i.text} - {i.id} - {j}</label>
        }
        </Item>
        {i.children != undefined && i.children.length > 0 ? this._getItems(i.children) : ''}
      </div>
    );
  }

  _filter(items) {
    return filterr(items, (i) => {
      switch(this.state.filter) {
        case 'active':
          return !i.done;
        case 'completed':
          return i.done;
        default:
          return true;
      }
    });
  }

  _handleFilter(filter) {
    this.setState(Object.assign(this.state, {filter}));
  }

  _handleItemFocus(id) {
    this.setState(Object.assign(this.state, {focusId: id}));
  }

  _handleCancelUpdate(id) {
    this.setState(Object.assign(this.state, {editId: null}));
  }

  _handleUpdateItem(id, text) {
    console.log(this.state.editId);
    this.props.updateTodo(this.state.editId, text);
    this.setState(Object.assign(this.state, {editId: null, focusId: this.state.editId}));
  }

  _findIndexById(id) {
    return searchrIndex(this.props.items, function (i) { return i.id == id});
  }

  _findIdByIndex(index) {
    return searchrByIndex(this.props.items, index).id;
  }

  _keyPressHandler(e) {
    const key = e.key;

    if (key == 'ArrowUp' || key == 'ArrowDown') {
      // arrows handling
      if (this.state.focusId == null) return;
      let focusIndex = this._findIndexById(this.state.focusId);

      if (key == 'ArrowUp') focusIndex--;
      if (key == 'ArrowDown') focusIndex++;

      if (focusIndex >= 0 && focusIndex < lengthr(this.props.items)) {
        this.setState(Object.assign(this.state, {focusId: this._findIdByIndex(focusIndex)}));
      }
    } else if (key == 'Enter') {
      this.setState(Object.assign(this.state, {editId: this.state.focusId}));
      e.stopPropagation();
      e.preventDefault();
    }
  }

  _stylesForItem(i) {
    let styles = ['item'];
    if (i.done) styles.push('complete');
    if (i.id == this.state.focusId) {
      switch (this.state.highlightStyle) {
        case HighlightType.ABOVE:
          styles.push('item-above');
          break;
        case HighlightType.BELOW:
          styles.push('item-below');
          break;
        default:
          styles.push('item-selected');
      }
    }
    return styles.join(' ');
  }
}

export default DragDropContext(HTML5Backend)(ItemsList)
