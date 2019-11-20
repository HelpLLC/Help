import React, { Component } from 'react';
import { View, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import HelpView from '../../components/HelpView';
import TopBanner from '../../components/TopBanner';
import strings from '../../../config/strings';
import fontStyles from '../../../config/styles/fontStyles';
import RoundBlueButton from '../../components/RoundBlueButton';
import colors from '../../../config/colors';
import roundBlueButtonStyle from '../../../config/styles/componentStyles/roundBlueButtonStyle';
import BussinessQuestions from '../../components/BusinessQuestions';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';

class createQuestionsScreen extends Component {
	state = {
		isScreenLoading: true
	};
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('CreateQuestionsScreen', 'createQuestionsScreen');
		//If this product is being edited, then it is going to display the previously entered questions
		//Otherwise, an empty questions box will appear
		if (this.props.navigation.state.params && this.props.navigation.state.params.product) {
			const {
				productID,
				providerID,
				product,
				newProductObject
			} = this.props.navigation.state.params;
			this.setState({
				questions: product.questions,
				productID,
                providerID,
                product,
				isScreenLoading: false,
				newProductObject
			});
		} else {
			const { providerID, newProductObject } = this.props.navigation.state.params;
			this.setState({
				questions: [''],
				providerID: providerID,
				newProductObject,
				isScreenLoading: false
			});
		}
	}

	async goToScheduleScreen() {
		//Passes the correct parameters to the next screen depending on whether the product is being edited, or being
		//created
		if (this.state.product) {
			let { productID, providerID, product, newProductObject, questions } = this.state;
			newProductObject = {
				...newProductObject,
				questions: questions
			};
			this.props.navigation.push('ProviderCreateScheduleScreen', {
				productID,
				providerID,
				product,
				newProductObject
			});
		} else {
			let { providerID, newProductObject, questions } = this.state;
			newProductObject = {
				...newProductObject,
				questions
			};
			this.props.navigation.push('ProviderCreateScheduleScreen', {
				providerID,
				newProductObject
			});
		}
	}

	render() {
		if (this.state.isScreenLoading === true) {
			return (
				<HelpView>
					<TopBanner
						title={strings.CustomerInfo}
						leftIconName='angle-left'
						leftOnPress={() => this.props.navigation.goBack()}
					/>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</HelpView>
			);
		}
		const { questions } = this.state;
		return (
			<HelpView>
				<TopBanner
					title={strings.CustomerInfo}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<View>
					<View
						style={{
							justifyContent: 'flex-start',
							marginLeft: Dimensions.get('window').width * 0.01,
							marginTop: Dimensions.get('window').height * 0.02
						}}>
						<Text style={fontStyles.subTextStyleBlack}>{strings.InfoFromCustomersQuestion}</Text>
					</View>
					<View style={{ marginTop: Dimensions.get('window').height * 0.01 }}>
						<ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
							<View
								style={{
									flex: 1,
									alignItems: 'center',
									marginLeft: Dimensions.get('window').width * 0.01
								}}>
								<RoundBlueButton
									title={strings.Address}
									//Tests if this button is selected, if it is, then the border color will
									//be blue
									style={[
										roundBlueButtonStyle.AccountTypeButton,
										{
											borderColor:
												this.state.isAddressSelected === true ? colors.lightBlue : colors.white
										}
									]}
									textStyle={fontStyles.mainTextStyleBlue}
									//Method selects the business button and deselects the other
									onPress={() => {
										this.setState({ isAddressSelected: true });
									}}
									disabled={this.state.isLoading}
								/>
							</View>
							<View
								style={{
									flex: 1,
									alignItems: 'center',
									marginLeft: Dimensions.get('window').width * 0.01
								}}>
								<RoundBlueButton
									title={strings.PhoneNumber}
									//Tests if this button is selected, if it is, then the border color will
									//be blue
									style={[
										roundBlueButtonStyle.AccountTypeButton,
										{
											borderColor:
												this.state.isPhoneNumberSelected === true ? colors.lightBlue : colors.white
										}
									]}
									textStyle={fontStyles.mainTextStyleBlue}
									onPress={() => {
										if (this.state.isPhoneNumberSelected === true) {
											this.setState({ isPhoneNumberSelected: false });
										} else {
											this.setState({ isPhoneNumberSelected: true });
										}
									}}
									disabled={this.state.isLoading}
								/>
							</View>
							<View
								style={{
									flex: 1,
									alignItems: 'center',
									marginLeft: Dimensions.get('window').width * 0.01,
									marginRight: Dimensions.get('window').width * 0.01
								}}>
								<RoundBlueButton
									title={strings.Email}
									//Tests if this button is selected, if it is, then the border color will
									//be blue
									style={[
										roundBlueButtonStyle.AccountTypeButton,
										{
											borderColor:
												this.state.isEmailSelected === true ? colors.lightBlue : colors.white
										}
									]}
									textStyle={fontStyles.mainTextStyleBlue}
									//Method selects the business button and deselects the other
									onPress={() => {
										if (this.state.isEmailSelected === true) {
											this.setState({ isEmailSelected: false });
										} else {
											this.setState({ isEmailSelected: true });
										}
									}}
									disabled={this.state.isLoading}
								/>
							</View>
						</ScrollView>
						<View
							style={{
								marginTop: Dimensions.get('window').height * 0.02,
								borderTopColor: colors.mainTextSyleBlack,
								borderTopWidth: 2
							}}>
							<View
								style={{
									marginTop: Dimensions.get('window').height * 0.01,
									marginLeft: Dimensions.get('window').height * 0.01
								}}>
								<Text style={fontStyles.subTextStyleBlack}>{strings.CustomQuestions}</Text>
							</View>
							<ScrollView style={{ height: Dimensions.get('window').height * 0.5 }}>
								<View>
									<BussinessQuestions
										questions={this.state.questions}
										onChangeQuestions={(questions) => {
											this.setState({
												questions: questions
											});
										}}
									/>
								</View>
								<View
									style={{
										marginTop: Dimensions.get('window').height * 0.02,
										justifyContent: 'center',
										alignItems: 'center',
										marginLeft: Dimensions.get('window').width * 0.3
									}}>
									<TouchableOpacity
										onPress={() => {
											questions.push('');
											this.setState({
												questions
											});
										}}>
										<Text style={fontStyles.mainTextStyleBlue}>{strings.AddQuestion}</Text>
									</TouchableOpacity>
								</View>
							</ScrollView>
						</View>
					</View>
					<View
						style={{
							justifyContent: 'flex-end',
							alignContent: 'flex-end',
							marginTop: Dimensions.get('window').height * 0.03
						}}>
						<RoundBlueButton
							title={strings.Done}
							style={roundBlueButtonStyle.MediumSizeButton}
							textStyle={fontStyles.bigTextStyleWhite}
							onPress={async () => {
								await this.goToScheduleScreen();
							}}
							disabled={this.state.isLoading}
						/>
					</View>
				</View>
			</HelpView>
		);
	}
}

export default createQuestionsScreen;
