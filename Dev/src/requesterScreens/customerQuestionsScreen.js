import React, { Component } from 'react';
import { View, Text } from 'react-native';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import strings from '../../config/strings';
import CustomerQuestions from '../components/customerQuestions'

class CustomerQuestionsScreen extends Component {

    state = {
        isLoading: false
    }

    render() {
        const {product} = this.props.navigation.state.params; 
        return (
            <HelpView>
                <TopBanner
                    title={"Customer Info"}
                    leftIconName='angle-left'
                    leftOnPress={() => this.props.navigation.goBack()}
                />
                <CustomerQuestions product={product}/>
            </HelpView>
        )
    }
}

export default CustomerQuestionsScreen;