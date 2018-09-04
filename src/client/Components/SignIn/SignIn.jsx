import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./SignIn.css";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleUsername = event => {
    this.setState({ username: event.target.value });
  };

  handlePassword = event => {
    this.setState({ password: event.target.value });
  };

  signIn = event => {
    const { username, password } = this.state;
    event.preventDefault();
    axios
      .post("/login", {
        username: username,
        password: password
      })
      .then(response => {
        if (response.data && response.data.success) {
          localStorage.setItem(
            "token",
            `${response.data.token.username} ${response.data.token.password}`
          );
          this.props.history.push("/feedback");
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { username, password } = this.state;
    return [
      <h1>Sign In</h1>,
      <form onSubmit={this.signIn}>
        <label htmlFor="username">User Name</label>
        <input
          id="username"
          type="text"
          placeholder="User Name"
          value={username}
          onChange={this.handleUsername}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.handlePassword}
        />
        <input type="submit" value="Log In" />
      </form>,
      <Link to="/signup">Don't have an account? Click here!</Link>
    ];
  }
}

export default SignIn;
