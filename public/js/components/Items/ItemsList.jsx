import React, {Component, PropTypes} from 'react';

import update from 'react/lib/update';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import ItemAdd from './ItemAdd.jsx';
import Item from './Item.jsx';


export default class ItemsList extends Component {
  constructor() {
    super();
    this.state = {cards: [], focusId: null, editId: null, filter: 'all'};
    this.moveCard = this.moveCard.bind(this);
  }

  static propTypes = {
    items      : React.PropTypes.array.isRequired,
    checkTodo  : PropTypes.func.isRequired,
    swapTodos  : PropTypes.func.isRequired,
    updateTodo : PropTypes.func.isRequired
  }

  componentWillMount() {
    this.setState({
      items: this.props.items
    });
  }

  moveCard(dragIndex, hoverIndex) {
    const cards = this.props.items;
    const dragCard = cards[dragIndex];
    this.props.swapTodos(dragIndex, hoverIndex);
  }

  render() {
    // <p>{this.state.editId} - {this.state.focusId}</p>
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
      {this._filter(this.props.items).map(
        (i, j) => <div key={j} className={this._stylesForItem(i)}>
          <Item
            todo={i}
            index={j}
            moveCard={this.moveCard}    
            focus={this.state.focusId == i.id}
            onFocusOut={() => this.setState(Object.assign(this.state, {focusId: null}))}
            onFocus={() => this.setState(Object.assign(this.state, {focusId: i.id}))}            
            onChange={() => this.props.checkTodo(j)}>
          {i.id == this.state.editId ?
            <ItemAdd
              value={i.text}
              onUpdate={this._handleUpdateItem.bind(this, i.id)}
              onFocusOut={this._handleCancelUpdate.bind(this, i.id)} />
            : <label onClick={this._handleItemFocus.bind(this, i.id)}>{i.text}</label>
          }
          </Item>
        </div>
      )}
    </div>
  }

  _filter(items) {      
    return items.filter((i) => {
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
    this.props.updateTodo(this.state.editId, text);
    this.setState(Object.assign(this.state, {editId: null, focusId: this.state.editId}));
  }

  _findIndexById(id) {
    for(var i in this.props.items) {
      if (this.props.items[i].id == id) return i;
    }
    return -1;
  }

  _findIdByIndex(index) {
    return this.props.items[index].id;
  }

  _keyPressHandler(e) {
    const key = e.key;    

    if (key == 'ArrowUp' || key == 'ArrowDown') {

      // arrows handling
      if (this.state.focusId == null) return;
      let focusIndex = this._findIndexById(this.state.focusId);

      if (key == 'ArrowUp') focusIndex--;
      if (key == 'ArrowDown') focusIndex++;

      if (focusIndex >= 0 && focusIndex < this.props.items.length) { 
        this.setState(Object.assign(this.state, {focusId: this._findIdByIndex(focusIndex)}));
      }
    } else if (key == 'Enter') {                  
      this.setState(Object.assign(this.state, {editId: this.state.focusId}));        
      e.stopPropagation();
      e.preventDefault();      
    }
  }

  _stylesForItem(i) {
    let styles = [];
    if (i.done) styles.push('complete');
    if (i.id == this.state.focusId) styles.push('selected');
    return styles.join(' ');
  }
}

export default DragDropContext(HTML5Backend)(ItemsList)