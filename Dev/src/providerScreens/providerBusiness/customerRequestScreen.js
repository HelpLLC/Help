//This screen is going to represent a specific request for bsinesses for a specific product. It will
//show the scheduled date, if applicable, along with answers to the qestions, if applicable
import React, { Component } from 'react';
import HelpView from '../../components/HelpView';
import screenStyle from 'config/styles/screenStyle';
import { View, Text, ScrollView, Dimensions, FlatList } from 'react-native';
import OptionPicker from '../../components/OptionPicker';
import strings from 'config/strings';
import TopBanner from '../../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import { CachedImage } from 'react-native-img-cache';
import LoadingSpinner from '../../components/LoadingSpinner';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import RoundBlueButton from '../../components/RoundBlueButton';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import HelpAlert from '../../components/HelpAlert';

//Creates the class and exports it
export default class customerRequestScreen extends Component {
	//Fetches the image for this requester
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CustomerRequestScreen', 'customerRequestScreen');
		const image = await FirebaseFunctions.getProfilePictureByID(this.state.request.requesterID);
		this.setState({ isScreenLoading: false, image });
	}

	//The initial state containing the passed in params
	state = {
		isLoading: false,
		isScreenLoading: true,
		product: this.props.navigation.state.params.product,
		request: this.props.navigation.state.params.request,
		isDeleteRequestVisible: false,
		isErrorVisible: false,
		requestDeleted: false,
		requestCompleted: false,
		isCompleteRequestVisible: false,
		image: ''
	};
	//Renders the view
	render() {
		//Fetches the state
		const {
			product,
			request,
			isScreenLoading,
			image,
			isDeleteRequestVisible,
			isErrorVisible,
			requestDeleted,
			requestCompleted,
			isCompleteRequestVisible
		} = this.state;
		if (isScreenLoading === true) {
			return (
				<HelpView style={screenStyle.container}>
					<TopBanner
						title={strings.CustomerRequest}
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
					title={strings.CustomerRequest}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<View
						style={{
							flexDirection: 'row',
							width: Dimensions.get('window').width - 40,
							alignItems: 'center',
							alignSelf: 'center',
							justifyContent: 'space-between'
						}}>
						<View style={{ flexDirection: 'column', justifyContent: 'center' }}>
							<View
								style={{
									justifyContent: 'flex-end',
									marginVertical: Dimensions.get('window').height * 0.03
								}}>
								<Text style={fontStyles.bigTextStyleBlack}>{request.requesterName}</Text>
							</View>
							<View>
								<Text style={fontStyles.mainTextStyleBlack}>{strings.RequestedOn}</Text>
								<View style={{ height: Dimensions.get('window').height * 0.01 }}></View>
								<Text style={fontStyles.mainTextStyleBlack}>{request.dateRequested}</Text>
							</View>
						</View>
						<CachedImage
							source={image}
							style={{
								width: Dimensions.get('window').width * 0.25,
								height: Dimensions.get('window').width * 0.25,
								borderColor: colors.lightBlue,
								borderWidth: (Dimensions.get('window').width * 0.25) / 17,
								borderRadius: (Dimensions.get('window').width * 0.25) / 2
							}}
						/>
					</View>
					{//Renders the scheduled time if there is one
					request.daySelected ? (
						request.selectedTime ? (
							<View
								style={{
									width: Dimensions.get('window').width * 0.9,
									marginTop: Dimensions.get('window').height * 0.05,
									alignSelf: 'center',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>
									{strings.ScheduledOn} {request.daySelected} {strings.at} {request.selectedTime}
								</Text>
							</View>
						) : (
							<View
								style={{
									width: Dimensions.get('window').width * 0.9,
									marginTop: Dimensions.get('window').height * 0.05,
									alignSelf: 'center',
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>
									{strings.ScheduledOn} {request.daySelected}
								</Text>
							</View>
						)
					) : request.selectedTime ? (
						<View
							style={{
								width: Dimensions.get('window').width * 0.9,
								marginTop: Dimensions.get('window').height * 0.05,
								alignSelf: 'center',
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<Text style={fontStyles.mainTextStyleBlack}>
								{strings.ScheduledAt} {request.selectedTime}
							</Text>
						</View>
					) : (
						<View></View>
					)}
					{request.answers ? (
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.025,
								borderBottomColor: colors.lightBlue,
								borderBottomWidth: 1,
								paddingBottom: Dimensions.get('window').width * 0.01
							}}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.CustomerAnswers}</Text>
						</View>
					) : (
						<View></View>
					)}
					<FlatList
						data={request.answers}
						extraData={this.state}
						keyExtractor={(item, index) => item.question}
						renderItem={({ item, index }) => (
							<View
								style={{
									width: Dimensions.get('window').width * 0.9,
									alignSelf: 'center',
									marginVertical: Dimensions.get('window').height * 0.02
								}}>
								<Text style={fontStyles.mainTextStyleBlack}>{item.question}</Text>
								<View
									style={{
										backgroundColor: colors.white,
										marginTop: Dimensions.get('window').height * 0.01,
										alignItems: 'flex-start',
										justifyContent: 'flex-start',
										paddingVertical: Dimensions.get('window').height * 0.01,
										width: Dimensions.get('window').width * 0.9,
										borderRadius: Dimensions.get('window').height * 0.0292825769,
										borderWidth: 3,
										borderColor: colors.lightBlue
									}}>
									<View
										style={{
											marginHorizontal: Dimensions.get('window').width * 0.025
										}}>
										<Text style={fontStyles.subTextStyleBlack}>{item.answer}</Text>
									</View>
								</View>
							</View>
						)}
					/>
					{this.state.isLoading === true ? (
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.025,
								justifyContent: 'center',
								alignItems: 'center'
							}}>
							<LoadingSpinner isVisible={true} />
						</View>
					) : (
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.025,
								flexDirection: 'row',
								justifyContent: 'space-evenly'
							}}>
							<RoundBlueButton
								title={strings.Delete}
								style={roundBlueButtonStyle.SmallSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									this.setState({
										isDeleteRequestVisible: true
									});
								}}
								disabled={this.state.isLoading}
							/>
							<RoundBlueButton
								title={strings.Message}
								style={roundBlueButtonStyle.SmallSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									this.props.navigation.push('MessagingScreen', {
										title: request.requesterName,
										providerID: product.offeredByID,
										requesterID: request.requesterID,
										userID: product.offeredByID
									});
								}}
								disabled={this.state.isLoading}
							/>
							<RoundBlueButton
								title={strings.Complete}
								style={roundBlueButtonStyle.SmallSizeButton}
								textStyle={fontStyles.mainTextStyleWhite}
								onPress={() => {
									this.setState({
										isCompleteRequestVisible: true
									});
								}}
								disabled={this.state.isLoading}
							/>
						</View>
					)}
				</ScrollView>
				<OptionPicker
					isVisible={isDeleteRequestVisible}
					title={strings.DeleteRequest}
					message={strings.AreYouSureDeleteRequest}
					clickOutside={true}
					confirmText={strings.Delete}
					cancelText={strings.Cancel}
					confirmOnPress={async () => {
						this.setState({ isDeleteRequestVisible: false });
						//This method will delete a specific request based on the passed in requester ID
						try {
							this.setState({ isLoading: true });
							await FirebaseFunctions.deleteRequest(product.serviceID, request.requesterID);
							this.setState({
								requestDeleted: true,
								isLoading: false
							});
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.logIssue(error, {
								screen: 'BusinessCustomerRequestScreen',
								userID: 'p-' + product.offeredByID,
								productID: product.offeredByID
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isDeleteRequestVisible: false });
					}}
				/>
				<OptionPicker
					isVisible={isCompleteRequestVisible}
					title={strings.CompleteRequest}
					message={strings.AreYouSureCompleteRequest}
					confirmText={strings.Complete}
					cancelText={strings.Cancel}
					clickOutside={true}
					confirmOnPress={async () => {
						this.setState({ isCompleteRequestVisible: false });
						//This method will complete a specific request based on the passed in requester ID
						try {
							this.setState({ isLoading: true });
							await FirebaseFunctions.completeRequest(product.serviceID, request.requesterID);
							//Updates the state of the screen to remove the request from
							//the screen & add it to the history
							this.setState({
								requestCompleted: true,
								isLoading: false
							});
						} catch (error) {
							this.setState({ isLoading: false, isErrorVisible: true });
							FirebaseFunctions.logIssue(error, {
								screen: 'BusinessCustomerRequestScreen',
								userID: 'p-' + product.offeredByID,
								productID: product.offeredByID
							});
						}
					}}
					cancelOnPress={() => {
						this.setState({ isCompleteRequestVisible: false });
					}}
				/>
				<HelpAlert
					isVisible={requestDeleted}
					onPress={() => {
						this.setState({ requestDeleted: false });
						//Updates the state of the screen to remove the request from
						//the screen
						this.props.navigation.push('ProviderScreens', {
							providerID: product.offeredByID
						});
					}}
					title={strings.RequestDeleted}
					message={strings.RequestHasBeenDeleted}
				/>
				<HelpAlert
					isVisible={requestCompleted}
					onPress={() => {
						this.setState({ requestCompleted: false });
						//Updates the state of the screen to remove the request from
						//the screen
						this.props.navigation.push('ProviderScreens', {
							providerID: product.offeredByID
						});
					}}
					title={strings.RequestCompleted}
					message={strings.RequestHasBeenCompleted}
				/>
				<HelpAlert
					isVisible={isErrorVisible}
					onPress={() => {
						this.setState({ isErrorVisible: false });
					}}
					title={strings.Whoops}
					message={strings.SomethingWentWrong}
				/>
			</HelpView>
		);
	}
}
