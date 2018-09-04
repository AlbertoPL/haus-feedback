import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: ""
    };
  }

  handleUsername = event => {
    this.setState({ username: event.target.value });
  };

  handlePassword = event => {
    this.setState({ password: event.target.value });
  };

  handleConfirmPassword = event => {
    this.setState({ confirmPassword: event.target.value });
  };

  signUp = event => {
    const { username, password, confirmPassword } = this.state;
    event.preventDefault();

    if (password !== confirmPassword) {
      return false;
    }

    axios
      .post("/signup", {
        username: username,
        password: password,
        confirmPassword: confirmPassword
      })
      .then(response => {
        localStorage.setItem(
          "token",
          `${response.data.token.username} ${response.data.token.password}`
        );
        this.props.history.push("/feedback");
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { username, password, confirmPassword } = this.state;
    return [
      <h1>Sign Up</h1>,
      <form onSubmit={this.signUp}>
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
        <label htmlFor="reenterpassword">Re-Enter Password</label>
        <input
          id="reenterpassword"
          type="password"
          placeholder="Re-Enter Password"
          value={confirmPassword}
          onChange={this.handleConfirmPassword}
        />
        <input type="submit" value="Create Account" />
      </form>,
      <Link to="/login">Already have an account? Log in here!</Link>
    ];
  }
}

export default SignUp;
