import React, { Component, useEffect } from "react";
import { Redirect } from "react-router";
import { Button } from "react-bootstrap";
import axios from "axios";
import deployment from "../../../../deployment";

let config = {
  withCredentials: true,
  credentials: "include",
  headers: {
      "Accept": "*/*",
      "Content-Type": "application/json"
  }
};

const Dashboard = props => {
  if (!props.isLoggedIn) {
    console.log("You need to log in to view dashboard")
    return <Redirect to={props.failedRoute} />;
  }

  return (
      <div>
        <h1>Dashboard</h1>
        <p>Logged in as: {props.user.username.toString()}</p>
        <p>Access Level: {props.user.permission_group.toString()}</p>
      </div>
  );
}

export default Dashboard;

//     displayUserMenu() {
//         return(
//             <UserMenu data={ this.state.user } />
//         )
//     }
