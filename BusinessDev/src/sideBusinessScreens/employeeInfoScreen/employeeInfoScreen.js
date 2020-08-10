import React, {useState} from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, ScrollView, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import colors from 'config/colors';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import style from './employeeInfoScreenStyle';
import TopBanner from '../../components/TopBanner/TopBanner';
import strings from 'config/strings';
import HelpButton from '../../components/HelpButton/HelpButton';

//exporting the employeeInfoScreen function
export default function employeeInfoScreen(props) {
    //The intial state of the screen
    const [loaded, setLoaded] = useState(false);

    const componentDidMount = async () => {
        //Declares the screen name in Firebase
        FirebaseFunctions.setCurrentScreen('EmployeeInfoScreen', 'employeeInfoScreen');
		setLoaded(true);
    };

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
                {addSection('material-community', 'account-circle', strings.Employee, 'Angelina Jolie')}
                {addSection('font-awesome', 'mobile', strings.PhoneNumber, '(123)456-7890')}
                {addSection('entypo', 'mail', strings.Email, 'example@gmail.com')}
                {workingHoursSection()}
            </ScrollView>
        </View>
    );

    function addSection(iconType, iconName, title, content){
        return (
            <View style={[style.MainSectionContainer, style.MainBorder]} key={title}>
                <View style={style.SectionIcon}>
                    <Icon name={iconName}
                        type={iconType}
                        size={60}
                        color={colors.darkBlue}/>
                </View>
                <View style={style.SectionTextContainer}>
                    <Text style={style.SectionTitleText}>{title}</Text>
                    <Text style={style.SectionContentText}>{content}</Text>
                </View>
            </View>
        );
    }

    function workingHoursSection() {
        return (
            <View style={style.WorkingHoursSection} key={strings.WorkingHours}>
                <View style={style.SubSectionContainer}>
                    <View style={style.SectionIcon}>
                        <Icon 
                            name='clock'
                            type='font-awesome'
                            size={60}
                            color={colors.darkBlue}
                            style={style.SectionIcon}/>
                    </View>
                    <View style={style.SectionTextContainer}>
                        <Text style={style.SectionTitleText}>{strings.WorkingHours}</Text>
                    </View>
                </View>
                <View style={style.SectionScheduleContainer}>
                    <View style={style.SectionTimeContainer}>
                        <Text style={style.SectionText}>{'Monday'}</Text>
                        <Text style={style.SectionTimeText}>{'7:00am'}</Text>
                        <Text style={style.SectionText}>{'to'}</Text>
                        <Text style={style.SectionTimeText}>{'12:00pm'}</Text>
                    </View>
                    <View style={style.SectionTimeContainer}>
                        <Text style={style.SectionText}>{'Tuesday'}</Text>
                        <Text style={style.SectionTimeText}>{'7:00am'}</Text>
                        <Text style={style.SectionText}>{'to'}</Text>
                        <Text style={style.SectionTimeText}>{'12:00pm'}</Text>
                    </View>
                    <View style={style.SectionTimeContainer}>
                        <Text style={style.SectionText}>{'Wednesday'}</Text>
                        <Text style={style.SectionTimeText}>{'7:00am'}</Text>
                        <Text style={style.SectionText}>{'to'}</Text>
                        <Text style={style.SectionTimeText}>{'12:00pm'}</Text>
                    </View>
                    <View style={style.SectionTimeContainer}>
                        <Text style={style.SectionText}>{'Thursday'}</Text>
                        <Text style={style.SectionTimeText}>{'7:00am'}</Text>
                        <Text style={style.SectionText}>{'to'}</Text>
                        <Text style={style.SectionTimeText}>{'12:00pm'}</Text>
                    </View>
                </View>
            </View>
        );
    }
}