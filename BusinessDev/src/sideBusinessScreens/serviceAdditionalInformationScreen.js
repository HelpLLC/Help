import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Platform } from 'react-native';
import HelpView from '../components/HelpView';
import TopBanner from '../components/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import RoundBlueButton from '../components/RoundBlueButton';
import colors from 'config/colors';
import roundBlueButtonStyle from 'config/styles/componentStyles/roundBlueButtonStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon } from 'react-native-elements';
import HelpAlert from '../components/HelpAlert';
import OneLineRoundedBoxInput from '../components/OneLineRoundedBoxInput';

class serviceAdditionalInformationScreen extends Component {
	state = {
		isScreenLoading: true,
		simultaneousRequestsInfoVisible: false,
		fieldsError: false,
		isLoading: false
	};
	componentDidMount() {
		if (this.props.navigation.state.params.editing === true) {
			FirebaseFunctions.setCurrentScreen(
				'EditServiceAddtionalInformationScreen',
				'serviceAdditionalInformationScreen'
			);
			const { service, serviceID } = this.props.navigation.state.params;
			const { simultaneousRequests, serviceDuration } = service;
			this.setState({
				service,
				serviceID,
				simultaneousRequests,
				serviceDuration,
				editing: true
			});
		} else {
			FirebaseFunctions.setCurrentScreen(
				'CreateServiceAddtionalInformationScreen',
				'serviceAdditionalInformationScreen'
			);
			this.setState({ serviceDuration: '', simultaneousRequests: '', editing: false });
		}
		this.setState({ isScreenLoading: false });
	}

	//Either creates or edits the completed service
	async finishService() {
		this.setState({ isLoading: true });
		const { serviceDuration, simultaneousRequests } = this.state;
		if (
			serviceDuration === '' ||
			simultaneousRequests === '' ||
			simultaneousRequests === '0' ||
			serviceDuration === '0'
		) {
			this.setState({ isLoading: false, fieldsError: true });
		} else {
			//Creates/edits the service
			//Creating new service
			const {
				businessID,
				business,
				serviceTitle,
				serviceDescription,
				price,
				response,
				questions
			} = this.props.navigation.state.params;
			//Adds a pricing field
			let priceText =
				price.priceType === 'per'
					? '$' + price.price + ' ' + strings.per + ' ' + price.per
					: '$' + price.priceFixed;
			const finalService = {
				averageRating: 0,
				priceText,
				businessID,
				businessName: business.businessName,
				category: 'Cleaning',
				coordinates: business.coordinates,
				currentRequests: [],
				displayedReviews: [],
				serviceDuration,
				simultaneousRequests,
				price,
				questions,
				serviceDescription,
				serviceTitle,
				totalReviews: 0
			};

			if (this.state.editing === true) {
				await FirebaseFunctions.call('updateServiceInformation', {
					...finalService,
					serviceID: this.state.serviceID
				});
				if (response !== null) {
					await FirebaseFunctions.storage.ref('services/' + this.state.serviceID).delete();
					//Handles the logic for uploading the image to Firebase
					//Fetches the absolute path of the image (depending on android or ios)
					let absolutePath = '';
					if (Platform.OS === 'android') {
						absolutePath = 'file://' + response.path;
					} else {
						absolutePath = response.path;
					}
					//Creates the reference & uploads the image (async)
					await FirebaseFunctions.storage.ref('services/' + this.state.serviceID).putFile(absolutePath);
				}
			} else {
				const serviceID = await FirebaseFunctions.call('addServiceToDatabase', finalService);

				//Handles the logic for uploading the image to Firebase
				//Fetches the absolute path of the image (depending on android or ios)
				let absolutePath = '';
				if (Platform.OS === 'android') {
					absolutePath = 'file://' + response.path;
				} else {
					absolutePath = response.path;
				}
				//Creates the reference & uploads the image (async)
				await FirebaseFunctions.storage.ref('services/' + serviceID).putFile(absolutePath);
			}

			this.props.navigation.push('BusinessScreens', {
				businessID
			});
		}
	}

	render() {
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView>
					<TopBanner
						title={strings.CreateService}
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
			<HelpView>
				<TopBanner
					title={strings.CreateService}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View
					style={{
						marginTop: Dimensions.get('window').height * 0.025,
						marginHorizontal: Dimensions.get('window').width * 0.05
					}}>
					<View style={{ marginTop: Dimensions.get('window').height * 0.02 }}>
						<Text style={[{ textAlign: 'center' }, fontStyles.bigTextStyleBlack]}>
							{strings.ServiceDuration}
						</Text>
					</View>
					<View
						style={{
							marginTop: Dimensions.get('window').height * 0.025,
							flexDirection: 'row',
							justifyContent: 'space-evenly'
						}}>
						<OneLineRoundedBoxInput
							width={Dimensions.get('window').width * 0.35}
							height={Dimensions.get('window').height * 0.075}
							keyboardType={'numeric'}
							placeholder={'0'}
							onChangeText={(input) => {
								this.setState({ serviceDuration: input });
							}}
							value={this.state.serviceDuration}
						/>
						<View style={{ marginTop: Dimensions.get('window').height * 0.02 }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Hours}</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						marginTop: Dimensions.get('window').height * 0.025,
						marginHorizontal: Dimensions.get('window').width * 0.05
					}}>
					<TouchableOpacity
						onPress={() => {
							this.setState({ simultaneousRequestsInfoVisible: true });
						}}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							marginTop: Dimensions.get('window').height * 0.02
						}}>
						<Text style={[{ textAlign: 'center' }, fontStyles.bigTextStyleBlack]}>
							{strings.AmountOfServicesAtATime}
						</Text>
						<View style={{ width: Dimensions.get('window').width * 0.02 }} />
						<Icon name={'info-circle'} type='font-awesome' size={25} color={colors.lightBlue} />
					</TouchableOpacity>

					<View
						style={{
							marginTop: Dimensions.get('window').height * 0.025,
							flexDirection: 'row',
							justifyContent: 'space-evenly'
						}}>
						<OneLineRoundedBoxInput
							width={Dimensions.get('window').width * 0.35}
							height={Dimensions.get('window').height * 0.075}
							keyboardType={'numeric'}
							placeholder={'0'}
							onChangeText={(input) => {
								this.setState({ simultaneousRequests: input });
							}}
							value={this.state.simultaneousRequests}
						/>
						<View style={{ marginTop: Dimensions.get('window').height * 0.02 }}>
							<Text style={fontStyles.bigTextStyleBlack}>{strings.Requests}</Text>
						</View>
					</View>
				</View>
				<View
					style={{
						justifyContent: 'flex-end',
						alignContent: 'flex-end',
						marginTop: Dimensions.get('window').height * 0.35
					}}>
					<RoundBlueButton
						title={this.state.editing === true ? strings.Done : strings.Create}
						style={roundBlueButtonStyle.MediumSizeButton}
						textStyle={fontStyles.bigTextStyleWhite}
						onPress={async () => {
							await this.finishService();
						}}
						isLoading={this.state.isLoading}
						disabled={this.state.isLoading}
					/>
				</View>
				<HelpAlert
					isVisible={this.state.simultaneousRequestsInfoVisible}
					onPress={() => {
						this.setState({ simultaneousRequestsInfoVisible: false });
					}}
					title={strings.SimultaneousRequests}
					message={strings.SimultaneousRequestsMessage}
				/>
				<HelpAlert
					isVisible={this.state.fieldsError}
					onPress={() => {
						this.setState({ fieldsError: false });
					}}
					title={strings.Whoops}
					message={strings.PleaseFillOutAllFields}
				/>
			</HelpView>
		);
	}
}

export default serviceAdditionalInformationScreen;
