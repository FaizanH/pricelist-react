import React, { Component, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, user, isLoggedIn, ...rest }) => {
    return (
        <Route {...rest} render={
            props => {
                // {console.log(user)}
                if (isLoggedIn && user.permission_group == "Administrator") {
                    return <Component {...rest} user={user} {...props} />
                } else {
                    return <Redirect to={
                        {
                            pathname: "/401",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
        } />
    )
}

export default ProtectedRoute;