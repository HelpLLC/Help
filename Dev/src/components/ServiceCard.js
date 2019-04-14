//This component will represent the card which which will display a service. The card will be accessed
//from both the requester & the provider screens. From the provider, they'll be able to view their
//products and if they click on them, they'll be able to see the products & edit them as well as
//see other kinds of information. From the requester, clicking on the service would allow them to view
//the service and request it if they need it.
import React, { Component } from 'react';
import { View } from 'react-native';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import PropTypes from 'prop-types';

//The component class
class ServiceCard extends Component {
    render() {
        return (
            <View></View>
        );
    }
}

//exports the module
export default ServiceCard