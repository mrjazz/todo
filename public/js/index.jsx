import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import configureStore from './store/configureStore';

// import {selectTodo} from './actions/todos';
import * as actionCreators from './actions/todos';


const store = configureStore();

class Parent extends Component {
  render() {
    return <Provider store={store}><Child /></Provider>;
  }
}

class Child extends Component {
  render() {
    return <GrandChild />;
  }
}

class GrandChild extends Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  // componentDidMount() {
  //   const {store} = this.context;
  //   this.unsubscribe = store.subscribe(() => this.forceUpdate());
  // }
  //
  // componentWillUnmount() {
  //   this.unsubscribe();
  // }

  _test() {
    // this.context.store.dispatch(selectTodo(Math.random()));
    // console.log(this.context.store.getState().todos.focusId);
  }

  render() {
    // console.log(this.context.store.getState().todos.focusId);
    console.log(this.props);
    return <div>
            <h1>{this.context.store.getState().todos.focusId}</h1>
            <a href="#" onClick={() => this._test()}>Hello!</a>
          </div>;
  }
}

function mapStateToProps(state) {
  return { todos: state.todos }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(GrandChild);

// export default connect(null, actions)(GrandChild);

ReactDOM.render(
  <Parent/>,
  document.getElementById('app')
);


// import React from 'react';
// import ReactDOM from 'react-dom';
// import Root from './containers/Root.jsx';
//
// import configureStore from './store/configureStore';
//
// const store = configureStore();
//
// ReactDOM.render(
//   <Root store={store}/>,
//   document.getElementById('app')
// );
