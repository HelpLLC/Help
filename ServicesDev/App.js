//This is the "main method" for the Help! applications. This component is launched and with it,
//the FirstScreenNavigator which connects to the rest of the screens.
//It will also set up and connect to the Redux state
import React, { Component } from 'react';
import MainStackNavigator from './src/MainStackNavigator';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import { persistReducer } from 'redux-persist'
import { AsyncStorage } from 'react-native';
import { YellowBox } from 'react-native';
import combinedReducer from './src/redux/combinedReducer';
import thunk from 'redux-thunk';
import firebaseConfig from './src/redux/firebase/firebaseConfig';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';

//This is the configurations for the persist store. For now, every time the schema is changed, then
//you must changed the key in persist config
const persistConfig = {
  key: 'HelpV1.42',
  storage: AsyncStorage,
  version: 0.0,
};

//This will represent the persist model itself, which fethced the reducer and configures it with
//the configs defined above
const persistedReducer = persistReducer(persistConfig, combinedReducer);

//This created the store & exports it to be used, as well as making it possible for the redux 
//state to be viewed in the React Native debugger for debugging purposes
export const store = createStore(persistedReducer,
  compose(
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
    reduxFirestore(firebaseConfig),
    reactReduxFirebase(firebaseConfig)
  )
);

//Launches the app with the persisted store
export default class App extends Component {
  render() {
    //Ignores a specific warning
    YellowBox.ignoreWarnings(['ViewPagerAndroid']);
    return (
      <Provider store={store}>
        <MainStackNavigator />
      </Provider>
    );
  }
};