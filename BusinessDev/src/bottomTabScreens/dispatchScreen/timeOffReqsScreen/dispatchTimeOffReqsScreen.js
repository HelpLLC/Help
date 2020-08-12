import React, {useState} from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, ScrollView } from 'react-native';
import style from './dispatchEmployeesScreenStyle';
import TopBanner from '../../components/TopBanner/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import colors from 'config/colors';
import TimeOffInfoCard from '../../components/TimeOffInfoCard/TimeOffInfoCard';

//exports the dispatchScreen class
export default function dispatchTimeOffReqsScreen(props) {

    //initial state of the screen
    const [business, setBusiness] = useState();
	const [businessName, setBusinessName] = useState();
	const [loaded, setLoaded] = useState(false);
    
    async function getData() {
        FirebaseFunctions.setCurrentScreen('DispatchScreen', 'dispatchScreen');
        const businessID = props.navigation.state.params;
        const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
		setBusiness(business);
		setBusinessName(business.businessName);
		setLoaded(true);
    };

    useEffect(() => {
        getData();
	}, []);

    return (
        <View style={screenStyle.container}>
            <View>
                <TopBanner size={30} title={strings.Dispatch} />
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <TimeOffInfoCard
                    name={'Henry Shang'}
                    date={'WED, Apr 1, 2020'}
                    timeBegin={'4:00pm'}
                    timeEnd={'5:00pm'}
                />
                <TimeOffInfoCard
                    name={'Henry Shang'}
                    date={'WED, Apr 1, 2020'}
                    timeBegin={'4:00pm'}
                    timeEnd={'5:00pm'}
                />
            </ScrollView>
        </View>
    );
}