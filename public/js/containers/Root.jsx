import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as TodoActions from '../actions/todos'

import ItemsView from '../containers/ItemsView.jsx';
import DetailsView from '../containers/DetailsView.jsx';


export default class Root extends Component {
  render() {
    const { store, todos, actions } = this.props;
    // <Provider store={store}>
    //   <ItemsView todos={todos} actions={actions}/>
    // </Provider>
    return <div>       
            <ItemsView todos={todos} actions={actions}/>
            <DetailsView/>
          </div>
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {todos: state.todos};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Root)
