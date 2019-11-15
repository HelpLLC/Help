import React, { Component } from 'react';
import { View, Text } from 'react-native';
import HelpView from '../../components/HelpView';
import TopBanner from '../../components/TopBanner';
import strings from '../../../config/strings'

class QuestionsScreen extends Component {

    render() {
        return (
            <HelpView>
                <TopBanner
                    title={strings.AddQuestions}
                    leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
                />
            </HelpView>
        )
    }
}

export default QuestionsScreen;