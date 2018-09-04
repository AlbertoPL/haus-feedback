import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Feedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      feedbackList: []
    };
  }

  componentDidMount() {
    this.getFeedback();
  }

  getFeedback = () => {
    axios
      .get("/api/feedback", {
        headers: { Authorization: localStorage.getItem("token") }
      })
      .then(response => {
        if (response.data && response.data.success) {
          this.setState({ feedbackList: response.data.feedback });
        }
      });
  };

  handleFeedback = event => {
    this.setState({ text: event.target.value });
  };

  submitFeedback = event => {
    const { text } = this.state;
    event.preventDefault();

    if (text.length > 0) {
      axios
        .post("/api/feedback", {
          text: text,
          username: localStorage.getItem("token").split(" ")[0],
          password: localStorage.getItem("token").split(" ")[1]
        })
        .then(response => {
          if (response.data && response.data.success) {
            alert("Thanks for your feedback!");
            this.getFeedback();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  render() {
    const { text, feedbackList } = this.state;
    return [
      <h1>Leave Your Feedback:</h1>,
      <form onSubmit={this.submitFeedback}>
        <textarea
          name="feedback"
          rows="10"
          cols="30"
          placeholder="Enter your feedback here"
          value={text}
          onChange={this.handleFeedback}
        >
          The cat was playing in the garden.
        </textarea>
        <input type="submit" value="Submit Feedback" />
      </form>,
      <div>
        <h2>Your prior feedback:</h2>
        {feedbackList.map(feedback => {
          return <p>{feedback}</p>;
        })}
        {feedbackList.length === 0 && <div>No feedback left yet</div>}
      </div>
    ];
  }
}

export default Feedback;
