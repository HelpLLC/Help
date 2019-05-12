//This class will combine both the provider & the requester reducers into one reducer that is 
//going to be used as the store from the App.js file
import { combineReducers } from 'redux';
import providerReducer from './provider/providerReducer';
import requesterReducer from './requester/requesterReducer';
import messageReducer from './message/messageReducer';
import productReducer from './product/productReducer';

//This will export the module containing the combined reducers
export default combineReducers({
    providerReducer,
    requesterReducer,
    messageReducer,
    productReducer
});