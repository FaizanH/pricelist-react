import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import React, { Component, useEffect, useState } from "react";

import firebase from "./firebase";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import deployment from "./deployment";
import { getUserByEmail } from "./services/services";
import ProtectedRoute from "./components/public/common/pages/protected-route";
import Unauthorised from "./components/public/common/pages/unauthorised";

// Private Routes
import UserMenu from "./components/public/common/menu/user-menu.component";
import AdminMenu from "./components/public/common/menu/admin-menu.component";
import CreateUser from "./components/admin/users/create-user.component";
import ManageUsers from "./components/admin/users/manage-users.component";
import ManageProducts from "./components/admin/products/manage-products";
import ManagePricing from "./components/admin/products/manage-pricing";
import AddProduct from "./components/admin/products/create-product.component";
import EditProduct from "./components/admin/products/edit-product.component";
import EditUser from "./components/admin/users/edit-user.component";

import ImportProducts from "./components/admin/products/import-products";
import ImportPricing from "./components/admin/products/import-pricing";

import ManageCustomers from "./components/admin/customers/manage-customers";
import CreateCustomer from "./components/admin/customers/create-customer";
import EditCustomer from "./components/admin/customers/edit-customer";

// Public Routes
import Menu from "./components/public/common/menu/common-menu.component"
import ViewPricing from "./components/public/common/pages/view-pricing";
// import Home from "./components/public/common/pages/home";
import Dashboard from "./components/public/common/dashboard/dashboard";
import Login from "./components/public/common/pages/login";
import Register from "./components/public/common/pages/register-user";

import AdminSidebar from "./components/public/common/sidebar/admin-sidebar";

let _isMounted = false;

function App() {
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // set to true
  const [classContent, setClassContent] = useState("page-content-wrapper");

  const setIsLoggedInState = user => {
    setIsLoggedIn(true);
    setUser(user);
  };
  const setLoggedOutState = user => {
    setUser("");
    setIsLoggedIn(false);
  };
  const setLoadingState = state => {
    if (state) {
      _isMounted = true;
      setLoading(state);
    } else {
      setLoading(state);
      _isMounted = false;
    }
  }

  useEffect(() => {
    _isMounted = true;

    if (!isLoggedIn)
      getAuth();

    if (isLoggedIn) {
      if (user.permission_group == "Administrator") setClassContent("page-content-wrapper-user");
    } else setClassContent("page-content-wrapper");

    return () => { _isMounted = false };
  }, [isLoggedIn]);

  const getAuth = async () => {
    if (_isMounted) {
      firebase.auth().onAuthStateChanged(async (fb_auth) => {
        if (fb_auth) {
          // Get mongo user from firebase user
          let user = await getUserByEmail(fb_auth.email);
          setUser(user);
          setIsLoggedIn(true);
          console.log(fb_auth.email + " is logged in");
        } else {
          setUser("");
          setIsLoggedIn(false);
          console.log("User not logged in");
        }
        setLoading(false);
      });
    }
  }

  return (
    <div className="app-wrapper">
          {loading ? 
      <Spinner animation="border" /> :
        <Router>
        <div className="container-fluid">
          {isLoggedIn ? (user.permission_group != "Administrator" ? <UserMenu user={user} isLoggedIn={isLoggedIn} setLoggedOutState={setLoggedOutState} setLoadingState={setLoadingState} /> : <AdminMenu user={user} setLoggedOutState={setLoggedOutState} setLoadingState={setLoadingState} />) : <Menu />}
        </div>
        {/* {isLoggedIn ? (user.permission_group != "Administrator" ? <UserSidebar user={user} isLoggedIn={isLoggedIn} /> : <AdminSidebar user={user} />) : <Sidebar />} */}
        <div className="container-fluid body-wrapper p-3">
          {isLoggedIn ? (user.permission_group == "Administrator" ? (<div className="sidebar-wrapper">
                            <AdminSidebar setLoggedOutState={setLoggedOutState} setLoadingState={setLoadingState} />
                          </div>
                          ) : null) : null }
          <div className={classContent}>
            <ProtectedRoute exact path="/admin/create-user" successRoute={"/admin/users"} user={user} isLoggedIn={isLoggedIn} component={CreateUser} setLoadingState={setLoadingState} />

            <ProtectedRoute exact path="/admin/users" user={user} isLoggedIn={isLoggedIn} component={ManageUsers} />
            <ProtectedRoute exact path="/admin/users/edit/:id" user={user} isLoggedIn={isLoggedIn} component={EditUser} />

            <ProtectedRoute exact path="/admin/pricing" user={user} isLoggedIn={isLoggedIn} component={ManagePricing} />
            <ProtectedRoute exact path="/admin/add-product" user={user} isLoggedIn={isLoggedIn} component={AddProduct} />
            <ProtectedRoute exact path="/admin/products" user={user} isLoggedIn={isLoggedIn} component={ManageProducts} />
            <ProtectedRoute exact path="/admin/products/edit" user={user} isLoggedIn={isLoggedIn} component={EditProduct} />

            <ProtectedRoute exact path="/admin/import-product" user={user} isLoggedIn={isLoggedIn} component={ImportProducts} />
            <ProtectedRoute exact path="/admin/import-pricing" user={user} isLoggedIn={isLoggedIn} setLoadingState={setLoadingState} component={ImportPricing} />

            <ProtectedRoute exact path="/admin/customers" user={user} isLoggedIn={isLoggedIn} component={ManageCustomers} />
            <ProtectedRoute exact path="/admin/create-customer" user={user} isLoggedIn={isLoggedIn} component={CreateCustomer} />
            <ProtectedRoute exact path="/admin/customers/edit/:id" user={user} isLoggedIn={isLoggedIn} component={EditCustomer} />

            {/* Static components */}
            <Route exact path="/401" component={Unauthorised} />

            {/* Functional components */}
            <Route exact path="/catalogue" component={ViewPricing} />
            <Route exact path="/"><Redirect to="/catalogue" /></Route>
            <Route exact path="/login"
              render={props => <Login {...props} successRoute={"/admin/pricing"} isLoggedIn={isLoggedIn} setIsLoggedInState={setIsLoggedInState} setLoadingState={setLoadingState} />} />
            <Route exact path="/signup"
              render={props => <Register {...props} successRoute={"/admin/pricing"} isLoggedIn={isLoggedIn} setLoadingState={setLoadingState} />} />
            <Route exact path="/dashboard"
              render={props => <Dashboard {...props} failedRoute={"/"} user={user} isLoggedIn={isLoggedIn} setIsLoggedInState={setIsLoggedInState} setLoggedOutState={setLoggedOutState} setLoadingState={setLoadingState} />} />
          </div>
        </div>
      </Router>
      }
    </div>
  );
}

export default App;