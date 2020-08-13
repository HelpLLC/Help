//This is going to be the screen where the business's schedule is going to be displayed in a calendar format, allowing for
//customization, and interactions.
import React, { useState } from 'react';
import screenStyle from 'config/styles/screenStyle';
import HelpView from '../../components/HelpView';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, Dimensions, Text } from 'react-native';
import TopBanner from '../../components/TopBanner/TopBanner';
import { Agenda } from 'react-native-calendars';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import LoadingSpinner from '../../components/LoadingSpinner';
import strings from 'config/strings';
import HelpAlert from '../../components/HelpAlert';
import RequestCard from '../../components/RequestCard';

export default function Calendar() {

    const [businessID, setBusinessID]=useState('zjCzqSiCpNQELwU3ETtGBANz7hY2')
    const [businessFetched, setBusinessFetched]=useState(false)
    const [isLoading, setIsLoading]=useState(true)
    const [isErrorVisible, setBusinessID]=useState(false)
    const [selectedDate, setBusinessID]=useState('')
    const [business, setBusinessID]=useState('')
    const [DateString, setBusinessID]=useState('')
    const [items, setBusinessID]=useState({})
    const [markedDates, setBusinessID]=useState('')

    return(
        <View>
            
        </View>
    )
}