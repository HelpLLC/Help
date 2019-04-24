//This class will represent the "yardwork" tab within the categories that the requester can choose from
import React, { Component } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import ServiceCard from '../../../components/ServiceCard';
import screenStyle from 'config/styles/screenStyle';

export default class Yardwork extends Component {
    render() {

        //fetches all of the props passed in from the parent
        const { allProps } = this.props;

        return (
            <View style={screenStyle.container}>
                <ScrollView
                    style={{ paddingTop: 30 }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ height: 40 }}></View>
                </ScrollView>
            </View>
        )
    }
}