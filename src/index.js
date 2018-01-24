import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, browserHistory } from "react-router";
import { Provider } from "react-redux";
import { syncHistoryWithStore } from "react-router-redux";
import {
  UserIsAuthenticated,
  UserIsNotAuthenticated
} from "./util/wrappers.js";
import getWeb3 from "./util/web3/getWeb3";

// Layouts
import App from "./App";
import Home from "./layouts/home/Home";
import Dashboard from "./layouts/dashboard/Dashboard";
import SignUp from "./user/layouts/signup/SignUp";
import Profile from "./user/layouts/profile/Profile";
import Task from "./containers/";

// Redux Store
import store from "./store";

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

class Main extends React.Component {
  state = {
    done: false
  };
  async componentWillMount() {
    // Initialize web3 and set in Redux.
    getWeb3
      .then(results => {
        console.log("Web3 initialized!");
        this.setState({ done: true });
      })
      .catch(() => {
        console.log("Error in web3 initialization.");
      });
  }
  render() {
    return (
      <Provider store={store}>
        {this.state.done
          ? <Router history={history}>
              <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route
                  path="dashboard"
                  component={UserIsAuthenticated(Dashboard)}
                />
                <Route
                  path="signup"
                  component={UserIsNotAuthenticated(SignUp)}
                />
                <Route
                  path="profile"
                  component={UserIsAuthenticated(Profile)}
                />
                <Route path="task" component={Task} />
              </Route>
            </Router>
          : <div />}
      </Provider>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById("root"));
