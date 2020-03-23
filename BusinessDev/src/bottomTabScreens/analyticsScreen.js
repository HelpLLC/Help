//This screen is going to be where the analytics for the business is displayed. It will contain graphs, charts, and other
//insights & indicators
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { screenWidth, screenHeight } from 'config/dimensions';
import strings from 'config/strings';
import { View, Text, ScrollView } from 'react-native';
import { BarChart, Grid, LineChart, YAxis, XAxis } from 'react-native-svg-charts';
import LoadingSpinner from '../components/LoadingSpinner';

//Creates and exports the class
export default class analyticsScreen extends Component {
	//The intial state of the screen
	state = {
		isScreenLoading: true,
		revenueBy: strings.ByMonth,
		customerLocationsBy: strings.ByCity,
		topServicesBy: strings.ByTotalRequests,
		revenueData: '',
		customerLocationData: '',
		topServicesData: '',
		businessID: ''
	};

	//Declares the screen name in Firebase
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
		const { businessID } = this.props.navigation.state.params;
		const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
			businessID
		});
		const revenueData = analyticsData[0];
		const customerLocationData = analyticsData[1];
		const topServicesData = analyticsData[2];
		this.setState({
			revenueData,
			businessID,
			customerLocationData,
			topServicesData,
			isScreenLoading: false
		});
	}

	//Generates the chart data for the revenue graph and returns it based on the current state of the picker
	generateRevenueChartData() {
		const { revenueBy, revenueData } = this.state;

		const monthStrings = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];

		let months = Object.keys(revenueData);
		months.sort();
		months.reverse();
		let chartData = [];
		let xAxis = [];
		if (revenueBy === strings.ByMonth) {
			months = months.filter((value) => value.includes('-'));
			months = months.filter((value, index) => index <= 11);

			for (let i = months.length - 1; i >= 0; i--) {
				const month = months[i];
				chartData.push(revenueData[month]);
			}

			for (let i = months.length - 2; i >= 0; i -= Math.floor(months.length / 3) + 1) {
				const month = months[i];
				const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
				const yearString = month.substring(0, month.indexOf('-'));
				xAxis.push(monthString + ' ' + yearString);
			}
		} else if (revenueBy === strings.ByYear) {
			months = months.filter((value) => !value.includes('-'));
			for (let i = months.length - 1; i >= 0; i--) {
				const month = months[i];
				chartData.push(revenueData[month]);
			}

			for (let i = months.length - 2; i >= 0; i -= Math.floor(months.length / 3) + 1) {
				const month = months[i];
				const yearString = month.substring(0, month.indexOf('-'));
				xAxis.push(yearString);
			}
		}
		return { chartData, xAxis };
	}

	//Takes an arrray of numbers and returns the average
	getAverage(arrayNum) {
		if (arrayNum.length === 0) {
			return 0;
		}
		let totalSum = 0;
		for (const num of arrayNum) {
			totalSum += num;
		}

		return (totalSum / arrayNum.length).toFixed(2);
	}

	render() {
		const { revenueBy, customerLocationsBy, topServicesBy, isScreenLoading } = this.state;
		if (isScreenLoading === true) {
			return (
				<View style={screenStyle.container}>
					<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
						<LoadingSpinner isVisible={true} />
					</View>
				</View>
			);
		}
		const revenueChart = this.generateRevenueChartData();
		return (
			//View that dismisses the keyboard when clicked anywhere else
			<View style={screenStyle.container}>
				<View>
					<TopBanner size={30} title={strings.Analytics} />
				</View>
				<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							width: screenWidth,
							marginTop: screenHeight * 0.025
						}}>
						<Text style={fontStyles.bigTextStyleBlue}>{strings.Revenue}</Text>
						<View
							style={{
								marginRight: screenWidth * 0.05,
								marginVertical: screenHeight * 0.015,
								alignSelf: 'flex-end',
								borderColor: colors.lightBlue,
								borderWidth: 3,
								borderRadius: 20,
								paddingHorizontal: screenWidth * 0.01,
								backgroundColor: colors.white
							}}>
							<RNPickerSelect
								onValueChange={(value) => this.setState({ revenueBy: value })}
								items={[
									{ label: strings.ByMonth, value: strings.ByMonth },
									{ label: strings.ByYear, value: strings.ByYear }
								]}
								value={revenueBy}
								style={{
									iconContainer: {
										top: screenHeight * 0.015
									},
									inputIOS: [
										fontStyles.smallTextStyleBlue,
										{
											width: screenWidth * 0.275,
											height: screenHeight * 0.05
										}
									],
									inputAndroid: [
										fontStyles.smallTextStyleBlue,
										{
											width: screenWidth * 0.275,
											height: screenHeight * 0.05
										}
									]
								}}
								Icon={() => (
									<Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
								)}
							/>
						</View>
						<View
							style={{
								borderWidth: 3,
								borderColor: colors.lightBlue,
								borderRadius: 15,
								height: screenHeight * 0.38,
								paddingHorizontal: screenWidth * 0.025,
								paddingVertical: screenHeight * 0.01
							}}>
							<View style={{ alignSelf: 'center' }}>
								<Text style={fontStyles.subTextStyleBlue}>
									{revenueBy === strings.ByMonth
										? strings.AverageMonthlyRevenue + this.getAverage(revenueChart.chartData)
										: strings.AverageYearlyRevenue + this.getAverage(revenueChart.chartData)}
								</Text>
							</View>
							{revenueChart.chartData.length === 0 ? (
								<View
									style={{
										paddingHorizontal: screenWidth * 0.02,
										height: screenHeight * 0.3,
										width: screenWidth * 0.8,
										alignItems: 'center',
										justifyContent: 'center'
									}}>
									<Text style={fontStyles.mainTextStyleBlue}>{strings.NoDataYet}</Text>
								</View>
							) : (
								<View>
									<View
										style={{
											flexDirection: 'row'
										}}>
										<YAxis
											data={revenueChart.chartData}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}
											svg={{ ...fontStyles.subTextStyleNoColor, fill: colors.lightBlue }}
											numberOfTicks={
												revenueChart.chartData.length < 5 ? revenueChart.chartData.length : 5
											}
											formatLabel={(value) => '$' + value}
										/>
										<LineChart
											style={{
												paddingHorizontal: screenWidth * 0.02,
												height: screenHeight * 0.3,
												width: screenWidth * 0.8
											}}
											data={revenueChart.chartData}
											numberOfTicks={8}
											svg={{
												stroke: colors.lightBlue,
												strokeWidth: 3
											}}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}>
											<Grid />
										</LineChart>
									</View>
									<XAxis
										data={revenueChart.chartData}
										contentInset={{
											left: screenWidth * 0.1,
											top: screenHeight * 0.022,
											bottom: screenHeight * 0.022
										}}
										svg={{ ...fontStyles.subTextStyleNoColor, fill: colors.lightBlue }}
										numberOfTicks={revenueChart.xAxis.length < 3 ? revenueChart.xAxis.length : 3}
										formatLabel={(value, index) => revenueChart.xAxis[index]}
									/>
								</View>
							)}
						</View>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: screenHeight * 0.025
						}}>
						<Text style={fontStyles.bigTextStyleBlue}>{strings.CustomerLocations}</Text>
						<View
							style={{
								marginRight: screenWidth * 0.05,
								marginVertical: screenHeight * 0.015,
								alignSelf: 'flex-end',
								borderColor: colors.lightBlue,
								borderWidth: 3,
								borderRadius: 20,
								paddingHorizontal: screenWidth * 0.01,
								backgroundColor: colors.white
							}}>
							<RNPickerSelect
								onValueChange={(value) => this.setState({ customerLocationsBy: value })}
								items={[
									{ label: strings.ByCity, value: strings.ByCity },
									{ label: strings.ByZipCode, value: strings.ByZipCode },
									{ label: strings.ByState, value: strings.ByState }
								]}
								value={customerLocationsBy}
								style={{
									iconContainer: {
										top: screenHeight * 0.015
									},
									inputIOS: [
										fontStyles.smallTextStyleBlue,
										{
											width: screenWidth * 0.3,
											height: screenHeight * 0.05
										}
									],
									inputAndroid: [
										fontStyles.smallTextStyleBlue,
										{
											width: screenWidth * 0.3,
											height: screenHeight * 0.05
										}
									]
								}}
								Icon={() => (
									<Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
								)}
							/>
						</View>
						<View
							style={{
								borderWidth: 3,
								borderColor: colors.lightBlue,
								paddingHorizontal: screenWidth * 0.025,
								paddingVertical: screenHeight * 0.01,
								borderRadius: 15
							}}>
							<BarChart
								style={{
									height: screenHeight * 0.3,
									width: screenWidth * 0.8,
									paddingHorizontal: screenWidth * 0.02
								}}
								data={[
									50,
									10,
									40,
									95,
									-4,
									-24,
									null,
									85,
									undefined,
									0,
									35,
									53,
									-53,
									24,
									50,
									-20,
									-80
								]}
								svg={{ fill: colors.lightBlue }}
								contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}>
								<Grid />
							</BarChart>
						</View>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							marginVertical: screenHeight * 0.025
						}}>
						<Text style={fontStyles.bigTextStyleBlue}>{strings.TopServices}</Text>
						<View
							style={{
								marginRight: screenWidth * 0.05,
								marginVertical: screenHeight * 0.015,
								alignSelf: 'flex-end',
								borderColor: colors.lightBlue,
								borderWidth: 3,
								borderRadius: 20,
								paddingHorizontal: screenWidth * 0.01,
								backgroundColor: colors.white
							}}>
							<RNPickerSelect
								onValueChange={(value) => this.setState({ topServicesBy: value })}
								items={[
									{ label: strings.ByTotalRequests, value: strings.ByTotalRequests },
									{ label: strings.ByTotalRevenue, value: strings.ByTotalRevenue },
									{ label: strings.ByTotalViews, value: strings.ByTotalViews }
								]}
								value={topServicesBy}
								style={{
									iconContainer: {
										top: screenHeight * 0.015
									},
									inputIOS: [
										fontStyles.smallTextStyleBlue,
										{
											width: screenWidth * 0.415,
											height: screenHeight * 0.05
										}
									],
									inputAndroid: [
										fontStyles.smallTextStyleBlue,
										{
											width: screenWidth * 0.415,
											height: screenHeight * 0.05
										}
									]
								}}
								Icon={() => (
									<Icon type='font-awesome' name='arrow-down' color={colors.lightBlue} size={20} />
								)}
							/>
						</View>
						<View
							style={{
								borderWidth: 3,
								borderColor: colors.lightBlue,
								paddingHorizontal: screenWidth * 0.025,
								paddingVertical: screenHeight * 0.01,
								borderRadius: 15
							}}>
							<BarChart
								style={{
									height: screenHeight * 0.3,
									width: screenWidth * 0.8,
									paddingHorizontal: screenWidth * 0.02
								}}
								data={[
									50,
									10,
									40,
									95,
									-4,
									-24,
									null,
									85,
									undefined,
									0,
									35,
									53,
									-53,
									24,
									50,
									-20,
									-80
								]}
								svg={{ fill: colors.lightBlue }}
								contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}>
								<Grid />
							</BarChart>
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}
