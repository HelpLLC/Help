//This screen is going to be navigated from the questions screen & will be in the create product flow from the
//business side. It allows businesses to specify when they can complete a specific job.
import React, { Component } from 'react';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import RoundBlueButton from '../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import HelpView from '../components/HelpView';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import screenStyle from 'config/styles/screenStyle';
import colors from 'config/colors';
import fontStyles from 'config/styles/fontStyles';
import DaysFromWeekPicker from '../components/DaysFromWeekPicker';
import { Icon } from 'react-native-elements';
import HelpAlert from '../components/HelpAlert';
import { View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';

//exports and creates the class
export default class createScheduleScreen extends Component {
  //if this screen is to edit existing service, it will fetch the correct fields
  async componentDidMount() {
    //If a product has been passed in, then the correct fields will be set, other wise, the normal screen will
    //be set for user to create product
    if (this.props.navigation.state.params && this.props.navigation.state.params.product) {
      FirebaseFunctions.setCurrentScreen('EditBusinessSchedule', 'signUpSchedule');
      const { product } = this.props.navigation.state.params;
      const { schedule } = product;
      const { productID, providerID, newProductObject } = this.props.navigation.state.params;
      this.setState({
        productID,
        providerID,
        product,
        newProductObject,
        isScreenLoading: false
      });
    } else {
      FirebaseFunctions.setCurrentScreen('CreateBusinessSchedule', 'signUpSchedule');
    }
  }
  //Controls the state of the screen (what type of schedule the business wants to use)
  //Also controls the loading state
  state = {
    fromTime: '',
    toTime: '',
    toTimeObject: '',
    fromTimeObject: '',
    daysSelected: {
      Sun: false,
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false
    },
    isScreenLoading: false,
    isFromTimeGreaterErrorVisible: false,
    productCreated: false,
    productUpdated: false,
    isFromTimeShowing: false,
    isToTimeShowing: false,
    isLoading: false,
    isTimesErrorVisible: false,
    isDaysErrorVisible: false
  };

  //Until android supports toTimeLocaleString(), this is our own method for formatting the time
  getAndroidTime(time) {
    let hour = time.getHours();
    let minutes = time.getMinutes();
    const ampm = hour > 11 ? 'PM' : 'AM';
    if (hour === 0) {
      hour = 12;
    } else if (hour === 12) {
      hour = 12;
    } else {
      hour = hour % 12;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    return hour + ':' + minutes + ' ' + ampm;
  }

  //Function returns true if at least one field in an object is true
  containsAtLeastOneTrue(object) {
    for (const field in object) {
      if (object[field] === true) {
        return true;
      }
    }
    return false;
  }

  //Fetches all the information from the previous screens and actually creates the product and adds it to the
  //database
  async createProduct() {
    this.setState({ isLoading: true });
    }

  //renders the screen
  render() {
    //Fetches the current schedule type from the stored state
    const {
      scheduleType,
      isFromTimeShowing,
      isToTimeShowing,
      toTime,
      fromTime,
      daysSelected
    } = this.state;



   const timePicker = (
    //If only specific times are selected, only the time pickers will be displayed
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: Dimensions.get('window').width
      }}>

    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Dimensions.get('window').height * 0.02
      }}>
    </View>

      <TouchableOpacity
        onPress={() => {
          this.setState({ isFromTimeShowing: true, isToTimeShowing: false });
        }}
        style={{
          borderWidth: 3,
          borderColor: colors.lightBlue,
          width: Dimensions.get('window').width * 0.2,
          height: Dimensions.get('window').height * 0.055,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
          color: colors.black
        }}>        
        <Text style={fontStyles.subTextStyleBlack}>{fromTime}</Text>
      </TouchableOpacity>

    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Dimensions.get('window').height * 0.02
      }}>
    </View>

      <Text style={fontStyles.mainTextStyleBlack}>{strings.to}</Text>

    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Dimensions.get('window').height * 0.02
      }}>
    </View>

      <TouchableOpacity
        onPress={() => {
          //Makes sure only one is visible at a time
          this.setState({ isToTimeShowing: true, isFromTimeShowing: false });
        }}
        style={{
          borderWidth: 3,
          borderColor: colors.lightBlue,
          width: Dimensions.get('window').width * 0.2,
          height: Dimensions.get('window').height * 0.055,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
          color: colors.black
        }}>
        <Text style={fontStyles.subTextStyleBlack}>{toTime}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        is24Hour={false}
        isVisible={isFromTimeShowing}
        mode='time'
        headerTextIOS={strings.PickATime}
        onConfirm={(time) => {
          //Sets the selected date, and makes the picker go away
          this.setState({
            fromTimeObject: time,
            fromTime: time.getHours() < 12? (time.getHours() + ':' + time.getMinutes() + ' AM') : (time.getHours()-12 + ':' + time.getMinutes() + ' PM'),
            selectedTime:
              Platform.OS === 'ios'
                ? time.toLocaleTimeString('en', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })
                : this.getAndroidTime(time),
            isFromTimeShowing: false
          });
        }}
        onCancel={() => {
          //Makes the picker go away
          this.setState({ isFromTimeShowing: false });
        }}
      />
      <DateTimePickerModal
        is24Hour={false}
        isVisible={isToTimeShowing}
        mode='time'
        onConfirm={(time) => {
          //Sets the selected date, and makes the picker go away
          this.setState({
            toTimeObject: time,
            toTime: time.getHours() < 12? (time.getHours() + ':' + time.getMinutes() + ' AM') : (time.getHours()-12 + ':' + time.getMinutes() + ' PM'),
            selectedTime:
              Platform.OS === 'ios'
                ? time.toLocaleTimeString('en', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })
                : this.getAndroidTime(time),
            isToTimeShowing: false
          });
        }}
        onCancel={() => {
          //Makes the picker go away
          this.setState({ isToTimeShowing: false });
        }}
      />
    </View>
  );
    return (
      <HelpView style={screenStyle.container}>
        <TopBanner
          title={"My Schedule"}
          leftIconName='angle-left'
          leftOnPress={() => this.props.navigation.goBack()}
        />
        <View
          style={{
            // flexDirection: 'column',
            alignItems: 'center',
            marginTop: Dimensions.get('window').height * 0.01
          }}>
          <Text style={fontStyles.mainTextStyleBlack}>
            {strings.AvailableTimesToCompleteService}
          </Text>

          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: Dimensions.get('window').height * 0.02
            }}>
          </View>

          <View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
            <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
          <Text style={fontStyles.bigTextStyleGray}>{strings.Monday}</Text>
            </View>
            {timePicker}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: Dimensions.get('window').height * 0.01
            }}>
          </View>

          <View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
            <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
          <Text style={fontStyles.bigTextStyleGray}>{strings.Tuesday}</Text>
            </View>
            {timePicker}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: Dimensions.get('window').height * 0.01
            }}>
          </View>

          <View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
            <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
          <Text style={fontStyles.bigTextStyleGray}>{strings.Wednesday}</Text>
            </View>
            {timePicker}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: Dimensions.get('window').height * 0.01
            }}>
          </View>

          <View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
            <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
          <Text style={fontStyles.bigTextStyleGray}>{strings.Thursday}</Text>
            </View>
            {timePicker}
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: Dimensions.get('window').height * 0.01
            }}>
          </View>

          <View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
            <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
          <Text style={fontStyles.bigTextStyleGray}>{strings.Friday}</Text>
            </View>
            {timePicker}
          </View>

<View
  style={{
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Dimensions.get('window').height * 0.01
  }}>
</View>

<View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
  <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
<Text style={fontStyles.bigTextStyleGray}>{strings.Saturday}</Text>
  </View>
  {timePicker}
</View>

<View
  style={{
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Dimensions.get('window').height * 0.01
  }}>
</View>

<View style={{ flexDirection: 'row',  marginLeft: Dimensions.get('window').height * 0.1 }}>
  <View style={{marginTop: Dimensions.get('window').height * 0.015 }}>
<Text style={fontStyles.bigTextStyleGray}>{strings.Sunday}</Text>
  </View>
  {timePicker}
</View>


<View
  style={{
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Dimensions.get('window').height * 0.02
  }}>
</View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end'
            }}>
            <RoundBlueButton
              title={strings.Done}
              isLoading={this.state.isLoading}
              style={roundBlueButtonStyle.MediumSizeButton}
              textStyle={fontStyles.bigTextStyleWhite}
              onPress={async () => {
                //Creates the product
                await this.createProduct();
              }}
              disabled={this.state.isLoading}
            />
          </View>
        </View>
        <HelpAlert
          isVisible={this.state.isDaysErrorVisible}
          onPress={() => {
            this.setState({ isDaysErrorVisible: false });
          }}
          title={strings.Whoops}
          message={strings.PleaseSelectDay}
        />
        <HelpAlert
          isVisible={this.state.isTimesErrorVisible}
          onPress={() => {
            this.setState({ isTimesErrorVisible: false });
          }}
          title={strings.Whoops}
          message={strings.PleaseSelectATime}
        />
        <HelpAlert
          isVisible={this.state.productCreated}
          onPress={() => {
            this.setState({ productCreated: false });
            this.props.navigation.push('ProviderScreens', {
              providerID: this.state.providerID
            });
          }}
          title={strings.Success}
          message={strings.ProductCreated}
        />
        <HelpAlert
          isVisible={this.state.productUpdated}
          onPress={() => {
            this.setState({ productUpdated: false });
            this.props.navigation.push('ProviderScreens', {
              providerID: this.state.providerID
            });
          }}
          title={strings.Success}
          message={strings.ProductUpdated}
        />
        <HelpAlert
          isVisible={this.state.isFromTimeGreaterErrorVisible}
          onPress={() => {
            this.setState({ isFromTimeGreaterErrorVisible: false });
          }}
          title={strings.Whoops}
          message={strings.FromTimeIsMoreThanToTime}
        />
      </HelpView>
    );
  }
}
