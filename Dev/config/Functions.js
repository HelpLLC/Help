//This class will contain a bunch of static functions that are common and will be used through out the
//application. The point of this class is to reduce code clutter throughout the application
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { View } from 'react-native';

class Functions extends Component {

    render() {
        return (
            <View></View>
        )
    }
    //This method will take in an ID of a requester and then search through all of the requesters
    //until it finds the requester with this particular ID
    getRequesterByID(ID) {

        const allRequesters = this.props.providerReducer;
        const thisRequester = allRequesters.find((requester) => {
            return requester.requesterID === ID;
        });

        return thisRequester;
    }

}

//Connects this class with the entire redux state to make sure it has access to everything
const mapStateToProps = (state) => {
    const { providerReducer, requesterReducer } = state;
    return { providerReducer, requesterReducer };
};

//connects the screen with the redux persist state
export default connect(mapStateToProps)(Functions);