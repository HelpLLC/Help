//This screen will display all of the services that the requester has ordered. At the top, the "inProgress" services will show up.
//Underneath them, the services that have already been completed will show up. The inProgress services will show up as NarrowServiceCards, 
//while the previously completed services will show up as ServiceCards. This screen has access to the SideMenu
import React, { Component } from 'react';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import LeftMenu from './LeftMenu';
import SideMenu from 'react-native-side-menu';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import { View, Text, Dimensions, FlatList } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import fontStyles from 'config/styles/fontStyles';
import TopBanner from '../components/TopBanner';
import ServicesList from '../components/ServicesList';
import ServiceCard from '../components/ServiceCard';
import { ScrollView } from 'react-native-gesture-handler';
import ErrorAlert from '../components/ErrorAlert';
import colors from 'config/colors';

export default class orderHistoryScreen extends Component {


    //The initial state controlling the loading spinner along with the side menu and all the other data that will be used in this screen
    state = {
        isOpen: false,
        isLoading: true,
        requester: '',
        serviceObjectsInProgress: '',
        serviceObjectsCompleted: '',
        isErrorVisible: false
    }

    //Adds the screen analytics and loads everything into the screen
    async componentDidMount() {

        FirebaseFunctions.setCurrentScreen("RequesterOrderHistoryScreen", "requesterOrderHistoryScreen");

        //Fetches the most up to date version of the requester
        const requesterID = this.props.navigation.state.params.requester.requesterID;
        const requester = await FirebaseFunctions.getRequesterByID(requesterID);

        //Fetches the array of services that are in progress and completed. Will fetch both the array of serviceIDs and their dates
        //from the requester object and will also fetch the actual services themselves using the serviceID
        const { inProgress, completed } = requester.orderHistory;
        let serviceObjectsInProgress = [];
        let serviceObjectsCompleted = [];
        for (const requestInProgess of inProgress) {
            const service = await FirebaseFunctions.getServiceByID(requestInProgess.serviceID);
            serviceObjectsInProgress.push({
                ...service,
                dateRequested: requestInProgess.dateRequested
            });
        }
        for (const requestCompleted of completed) {
            const service = await FirebaseFunctions.getServiceByID(requestCompleted.serviceID);
            serviceObjectsCompleted.push({
                ...service,
                dateRequested: requestCompleted.dateRequested,
                dateCompleted: requestCompleted.dateCompleted
            });
        }
        this.setState({
            requester,
            serviceObjectsCompleted,
            serviceObjectsInProgress,
            isLoading: false
        });

    }

    //Renders the screen based on the isLoading part of the state
    render() {

        const { isLoading, requester, serviceObjectsCompleted, serviceObjectsInProgress } = this.state;

        if (isLoading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )

        } else {
            return (
                <SideMenu
                    isOpen={this.state.isOpen}
                    menu={
                        <LeftMenu
                            navigation={this.props.navigation}
                            allProducts={this.props.navigation.state.params.allProducts}
                            requester={requester} />
                    }>
                    <HelpView style={screenStyle.container}>
                        <TopBanner
                            leftIconName="navicon"
                            leftOnPress={() => {
                                this.setState({ isOpen: true });
                            }}
                            size={30}
                            title={strings.OrderHistory} />
                        {
                            //Displays a message if the requester has not yet requested anything
                            serviceObjectsCompleted.length === 0 && serviceObjectsInProgress.length === 0 ? (
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: Dimensions.get('window').width * 0.9
                                }}>
                                    <Text style={fontStyles.bigTextStyleBlack}>{strings.NoRequestsYet}</Text>
                                </View>
                            ) : (
                                    <ScrollView style={{ flex: 1 }}
                                        showsHorizontalScrollIndicator={false}
                                        showsVerticalScrollIndicator={false}>
                                        {
                                            //Displays the in progress products if there are any in NarrowServiceCards
                                            serviceObjectsInProgress.length > 0 ? (
                                                <View>
                                                    <View
                                                        style={{
                                                            width: Dimensions.get('window').width * 0.86,
                                                            height: Dimensions.get('window').height * 0.06,
                                                            justifyContent: 'center',
                                                            alignSelf: 'center',
                                                            borderBottomColor: colors.lightBlue,
                                                            borderBottomWidth: 1
                                                        }}>
                                                        <Text style={fontStyles.bigTextStyleBlue}>
                                                            {strings.InProgress + " (" + serviceObjectsInProgress.length + ")"}
                                                        </Text>
                                                    </View>
                                                    <ServicesList
                                                        requester={requester}
                                                        navigation={this.props.navigation}
                                                        services={serviceObjectsInProgress}
                                                        dateRequested={true} />
                                                </View>
                                            ) : (
                                                    <View></View>
                                                )
                                        }
                                        {
                                            //Displays the completed products if there are any in ServiceCards
                                            serviceObjectsCompleted.length > 0 ? (
                                                <View>
                                                    <View
                                                        style={{
                                                            width: Dimensions.get('window').width * 0.86,
                                                            height: Dimensions.get('window').height * 0.06,
                                                            justifyContent: 'center',
                                                            alignSelf: 'center',
                                                            borderBottomColor: colors.black,
                                                            borderBottomWidth: 1
                                                        }}>
                                                        <Text style={fontStyles.bigTextStyleBlack}>
                                                            {strings.Completed}
                                                        </Text>
                                                    </View>
                                                    <FlatList
                                                        data={serviceObjectsCompleted}
                                                        keyExtractor={(item, index) => {
                                                            return (item.serviceID);
                                                        }}
                                                        renderItem={({ item, index }) => (
                                                            <ServiceCard
                                                                key={index}
                                                                serviceTitle={item.serviceTitle}
                                                                serviceDescription={item.serviceDescription}
                                                                //Displays the date completed instead of the pricing
                                                                price={item.dateCompleted}
                                                                imageFunction={async () => {
                                                                    //Passes in the function to retrieve the image of this product
                                                                    return await FirebaseFunctions.getProdudctImageByID(item.serviceID)
                                                                }}
                                                                numCurrentRequests={item.requests.currentRequests.length}
                                                                onPress={async () => {
                                                                    //Navigates to the ServiceScreen
                                                                    try {
                                                                        const provider = await FirebaseFunctions.getProviderByID(item.offeredByID);
                                                                        this.props.navigation.push('RequesterServiceScreen', {
                                                                            productID: item.serviceID,
                                                                            requester,
                                                                            provider
                                                                        });
                                                                    } catch (error) {
                                                                        this.setState({ isLoading: false, isErrorVisible: true });
                                                                        FirebaseFunctions.logIssue(error, {
                                                                            screen: "Featured Screen",
                                                                            userID: 'r-' + requester.requesterID
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </View>
                                            ) : (
                                                    <View></View>
                                                )
                                        }
                                        <ErrorAlert
                                            isVisible={this.state.isErrorVisible}
                                            onPress={() => { this.setState({ isErrorVisible: false }) }}
                                            title={strings.Whoops}
                                            message={strings.SomethingWentWrong}
                                        />
                                    </ScrollView>
                                )
                        }
                    </HelpView>
                </SideMenu>
            )
        }
    }

}