import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions/todos';

import TestView from '../containers/TestView.jsx';
import ItemsView from '../containers/ItemsView.jsx';
import DetailsView from '../containers/DetailsView.jsx';


export default class Root extends Component {

  // static propTypes = {
  //   store: PropTypes.object.isRequired
  //   // todosState: PropTypes.object.isRequired,
  //   // todoActions: PropTypes.object.isRequired
  // };

  static childContextTypes = {
    color: React.PropTypes.string
  };

  getChildContext() {
    return {color: "purple"};
  }

  render() {
    // const { store, todosState, todoActions } = this.props;

    //console.log(this.props);

    //
    //   <ItemsView todos={todos} actions={actions}/>
    //
    // onKeyDown={(e) => console.log(e)}

    /*<div><ItemsView todosState={store.getState().todos} todoActions={todoActions} />
     <DetailsView todosState={store.getState().todos} todoActions={todoActions}/></div>*/
    // return <Provider store={this.props.store}>
    //         <TestView name="hello"/>
    //       </Provider>
    return <TestView name="hello"/>;
  }
}

// function mapStateToProps(state) {
//   // console.log(state);
//   return {
//     todosState : state.todos
//   };
// }
//
// function mapDispatchToProps(dispatch) {
//   return {
//     todoActions : bindActionCreators(TodoActions, dispatch)
//   }
// }
//
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Root)
