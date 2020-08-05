import React, {useState} from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, ScrollView } from 'react-native';
import style from './dispatchEmployeesScreenStyle';
import TopBanner from '../../components/TopBanner/TopBanner';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import fontStyles from 'config/styles/fontStyles';
import profile_pic from './profile_pic.png';
import strings from 'config/strings';
import colors from 'config/colors';
import HelpTextInput from '../../components/HelpTextInput/HelpTextInput';
import EmployeeListItem from '../../components/EmployeeListItem/EmployeeListItem';
import HelpButton from '../../components/HelpButton/HelpButton';

//exports the dispatchScreen class
export default function dispatchScreen(props) {

    //initial state of the screen
    const [business, setBusiness] = useState();
	const [businessName, setBusinessName] = useState();
	const [loaded, setLoaded] = useState(false);
	const [employeeCode, setEmployeeCode] = useState('');
	const [search, setSearch] = useState('');
    
    const componentDidMount = async () => {
        FirebaseFunctions.setCurrentScreen('DispatchScreen', 'dispatchScreen');
        const businessID = props.navigation.state.params;
        const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
		setBusiness(business);
		setBusinessName(business.businessName);
		setEmployeeCode(business.employeeCode);
		setLoaded(true);
    };

    if (loaded === false) {
		componentDidMount();
	}

    return (
        <View style={screenStyle.container}>
            <View>
                <TopBanner size={30} title={strings.Dispatch} />
            </View>
            <View style={{ ...style.body}}>
                <HelpTextInput
                    height={screenHeight*0.05}
                    width={screenWidth * 0.93}
                    borderColor={colors.darkBlue}
                    isMultiline={false}
                    onChangeText={() => setSearch(search)}
                    additionalIcon={
                        <View style={{marginLeft: screenWidth * 0.08}}>
                            <Icon type='font-awesome' name='search' color={colors.darkBlue} size={20}/>
                        </View>
                    }></HelpTextInput>
                <View style={{ ...style.button }}>
                    <HelpButton 
                        title={'Invite Employee(s)'}
                        width={screenWidth * 0.93}
                        height={screenHeight * 0.045}
                    />
                </View>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <EmployeeListItem
                    name='John Doe'
                    buttonText='View More'
                    buttonWidth={screenWidth * 0.29}
                    buttonHeight={screenHeight * 0.04}
                    image = {profile_pic}
                />
                <EmployeeListItem
                    name='Patricia Cebotari'
                    buttonText='View More'
                    buttonWidth={screenWidth * 0.29}
                    buttonHeight={screenHeight * 0.04}
                    image = {profile_pic}
                />
                <EmployeeListItem
                    name='Anne Ketcheva'
                    buttonText='View More'
                    buttonWidth={screenWidth * 0.29}
                    buttonHeight={screenHeight * 0.04}
                    image = {profile_pic}
                />
            </ScrollView>
        </View>
    );
}