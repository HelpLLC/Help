import React from 'react'
import LoginRegister from './LoginRegister'
import SignUpScreen from '../Signup/SignUpScreen'

import { BrowserRouter, Route, Link, Switch } from "react-router-dom";

export default function RegisterNavigator(){
    return(
        <BrowserRouter>
          <Switch>
          <Route exact path="/businessSignUp">
            <SignUpScreen />
          </Route>
        </Switch>
        </BrowserRouter>
      
    )
}