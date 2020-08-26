import React, {useState} from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import { View, ScrollView } from 'react-native';
import style from './dispatchEmployeesScreenStyle';
import TopBanner from '../../components/TopBanner/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import strings from 'config/strings';
import colors from 'config/colors';
import LoadingSpinner from '../../components/LoadingSpinner';
import TimeOffInfoCard from '../../components/TimeOffInfoCard/TimeOffInfoCard';

//exports the dispatchScreen class
export default function dispatchTimeOffReqsScreen(props) {

    //initial state of the screen
    const [business, setBusiness] = useState();
	const [businessName, setBusinessName] = useState();
	const [timeOffRequests, setTimeOffRequests] = useState();
	const [loaded, setLoaded] = useState(false);
    
    async function getData() {
        FirebaseFunctions.setCurrentScreen('DispatchScreen', 'dispatchScreen');
        const businessID = props.navigation.state.params;
        const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
        const requests = await FirebaseFunctions.call('getTimeOffRequestsByBusinessID', {
			businessID,
		});
		setBusiness(business);
        setBusinessName(business.businessName);
        setTimeOffRequests(requests);
		setLoaded(true);
    };

    useEffect(() => {
        getData();
	}, []);

    function timeOffRequests(){
        let elements = [];
        for(let i in timeOffRequests)
            if(timeOffRequests[i].status == 'pending')
                elements.push(
                    <TimeOffInfoCard
                        name={timeOffRequests[i].employeeName}
                        date={timeOffRequests[i].date}
                        timeBegin={timeOffRequests[i].startTime}
                        timeEnd={timeOffRequests[i].endTime}
                        approve={()=>{
                            FirebaseFunctions.call('approveTimeOffRequest', {
                                businessID,
                                employeeID:timeOffRequests[i].employeeID,
                                index:i
                            });
                        }}
                        deny={()=>{
                            FirebaseFunctions.call('denyTimeOffRequest', {
                                businessID,
                                employeeID:timeOffRequests[i].employeeID,
                                index:i
                            });
                        }}
                    />
                );
        return elements;
    }

    return (
        <View style={screenStyle.container}>
            <View>
                <TopBanner size={30} title={strings.Dispatch} />
            </View>
            <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                {loaded ? timeOffRequests() : 
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <LoadingSpinner isVisible={true} />
                </View>}
            </ScrollView>
        </View>
    );
}