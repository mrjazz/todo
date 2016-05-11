import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';

import ItemsView from '../containers/ItemsView.jsx';


export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    //<DetailsView/>
    return <Provider store={this.props.store}>
            <div>
              <ItemsView/>
            </div>
          </Provider>
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
