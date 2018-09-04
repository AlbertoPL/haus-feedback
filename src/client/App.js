import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SignIn from "./Components/SignIn/SignIn";
import SignUp from "./Components/SignUp/SignUp";
import Feedback from "./Components/Feedback/Feedback";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/login" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/feedback" component={Feedback} />
          <Route render={() => <div> Sorry, this page does not exist. </div>} />
        </Switch>
      </div>
    );
  }
}

export default App;
