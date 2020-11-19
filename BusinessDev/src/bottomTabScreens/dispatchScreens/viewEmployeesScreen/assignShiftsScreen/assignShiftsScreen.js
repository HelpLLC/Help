import React, {useState} from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, ScrollView, Text } from 'react-native';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import style from './assignShiftsScreenStyle';
import TopBanner from '../../../../components/TopBanner/TopBanner';
import strings from 'config/strings';
import ServiceInfoCard from '../../../../components/ServiceInfoCard/ServiceInfoCard';
import HelpButton from '../../../../components/HelpButton/HelpButton';

//exporting the assignShiftsScreen function
export default function assignShiftsScreen(props) {
    //The intial state of the screen
    const [shiftAssigned, setShiftAssigned] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [popupVisible, setPopupVisible] = useState(false);

    async function getData() {
        //Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('AssignShiftsScreen', 'assignShiftsScreen');
		setLoaded(true);
    };

    useEffect(() => {
        getData();
	}, []);

    return (
        <View style={screenStyle.container}>
            <View>
                <TopBanner 
                    size={30} 
                    title={''} 
                    leftIconName='angle-left'
                    leftOnPress={() => props.navigation.goBack() }
                />
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <ServiceInfoCard
                    name={'Photography'}
                    date={'WED, Apr 1, 2020'}
                    timeBegin={'4:00pm'}
                    timeEnd={'5:00pm'}
                    buttonName={strings.Assign}
                    changeButton={true}
                    notButtonText={strings.Assigned}
                    onButtonPress={() => assignShift()}
                />
                <ServiceInfoCard
                    name={'House Cleaning'}
                    date={'WED, Apr 1, 2020'}
                    timeBegin={'4:00pm'}
                    timeEnd={'5:00pm'}
                    buttonName={strings.Assign}
                    changeButton={true}
                    notButtonText={strings.Assigned}
                    onButtonPress={() => assignShift()}
                />
            </ScrollView>
            {popupVisible ? (
                 <View style={style.PopupContainer}> 
                     <View style={style.PopupTextContainer}>
                         <Text style={style.PopupTitle}>{strings.EmployeeAssigned}</Text>
                         <Text style={style.PopupText}>{strings.EmployeeAssignedMessage}</Text>

                         <Text style={style.PopupDetails}>{'Photography'}</Text>
                         <Text style={style.PopupDetails}>{'WED, Apr 1, 2020'}</Text>
                         <Text style={style.PopupDetails}>{'4:00pm'} - {'5:00pm'}</Text>

                         <Text style={style.PopupText}>{strings.EmployeeAssignedCalenderMessage}</Text>
                         <HelpButton
                            title={strings.Close}
                            isLightButton={true}
                            width={screenWidth * 0.29}
                            height={screenHeight * 0.06}
                            bigText={true}
                            bold={true}
                            onPress={() => setPopupVisible(false)}
                         />
                     </View>
                 </View>
             ) : null}
        </View>
    );

    function assignShift() {
        setShiftAssigned(true);
        setPopupVisible(true);
    }
}