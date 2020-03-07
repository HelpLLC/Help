//This screen will show the request history for an individual product. For now, this will only show
//the date and the customer name, but in the future, this will show ratings/reviews/tips, and other
//factors.
import React, { Component } from 'react';
import { View, Text, Dimensions, FlatList, ScrollView } from 'react-native';
import ServiceCard from '../components/ServiceCard';
import strings from 'config/strings';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import ImageWithBorder from '../components/ImageWithBorder';
import TopBanner from '../components/TopBanner';
import LoadingSpinner from '../components/LoadingSpinner';

//The class for this screen
class serviceHistoryScreen extends Component {
  state = {
    isLoading: true,
    completedRequests: false
  };
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen('ProductHistoryScreen', 'productHistoryScreen');
    const serviceID = this.props.navigation.state.params.product.serviceID;
    const completedRequests = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
      serviceID
    });
    this.setState({
      isLoading: false,
      completedRequests
    });
  }

  //Renders the UI
  render() {
    const { isLoading, completedRequests } = this.state;
    const { product } = this.props.navigation.state.params;
    if (isLoading === true) {
      return (
        <HelpView style={screenStyle.container}>
          <TopBanner
            title={strings.ServiceHistory}
            leftIconName='angle-left'
            leftOnPress={() => this.props.navigation.goBack()}
          />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LoadingSpinner isVisible={true} />
          </View>
        </HelpView>
      );
    }
    return (
      <HelpView style={screenStyle.container}>
        <TopBanner
          title={strings.ServiceHistory}
          leftIconName='angle-left'
          leftOnPress={() => this.props.navigation.goBack()}
        />
        <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              width: Dimensions.get('window').width - 40,
              borderColor: colors.lightGray,
              borderBottomColor: colors.black,
              borderWidth: 0.5,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: Dimensions.get('window').height * 0.2
            }}>
            <Text style={fontStyles.bigTextStyleBlack}>{product.serviceTitle}</Text>

            <ImageWithBorder
              width={Dimensions.get('window').width * 0.25}
              height={Dimensions.get('window').width * 0.25}
              imageFunction={async () => {
                //Passes in the function to retrieve the image of this product
                return await FirebaseFunctions.call('getProductImageByID', {
                  ID: product.serviceID
                });
              }}
            />
          </View>
          <View style={{ height: Dimensions.get('window').height * 0.05 }}></View>
          {//Tests if the current product has had any requests yet
          completedRequests.length > 0 ? (
            <FlatList
              data={completedRequests}
              keyExtractor={(item, index) => {
                return item.requesterID + index.toString();
              }}
              renderItem={({ item, index }) => (
                <View style={{ marginBottom: Dimensions.get('window').height * 0.025 }}>
                  <ServiceCard
                    serviceTitle={item.requesterName}
                    serviceDescription={' '}
                    price={strings.CompletedOn + ' ' + item.dateSelected}
                    imageFunction={async () => {
                      //Passes the function to get the profile picture of the user
                      //Passes in the function to retrieve the image of this requester
                      return await FirebaseFunctions.call('getProfilePictureByID', {
                        ID: item.requesterID
                      });
                    }}
                    onPress={() => {
                      //Goes to the screen for the specific request
                      this.props.navigation.push('CustomerRequestScreen', {
                        product: product,
                        request: item,
                        completed: true
                      });
                    }}
                  />
                </View>
              )}
            />
          ) : (
            <View style={{ flex: 0.35, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={fontStyles.bigTextStyleBlack}>{strings.NoHistoryForThisProductYet}</Text>
            </View>
          )}
        </ScrollView>
      </HelpView>
    );
  }
}

//Exports the screen
export default serviceHistoryScreen;
