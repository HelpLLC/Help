//This screen is going to be where the analytics for the business is displayed. It will contain graphs, charts, and other
//insights & indicators
import React, { Component } from 'react';
import screenStyle from 'config/styles/screenStyle';
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from '../components/TopBanner/TopBanner';
import fontStyles from 'config/styles/fontStyles';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { screenWidth, screenHeight } from 'config/dimensions';
import strings from 'config/strings';
import { View, Text, ScrollView } from 'react-native';
import { BarChart, Grid, LineChart, YAxis, XAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';
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
		businessID: '',
	};

	//Declares the screen name in Firebase
	async componentDidMount() {
		FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
		//const { businessID } = this.props.navigation.state.params;
		const businessID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2';
		const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
			businessID,
		});
		const revenueData = analyticsData[0];
		const topServicesData = analyticsData[1];
		const customerLocationData = analyticsData[2];
		console.log(analyticsData)
		this.setState({
			revenueData,
			businessID,
			customerLocationData,
			topServicesData,
			isScreenLoading: false,
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
			'Dec',
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

			if (months.length > 4) {
				for (let i = months.length - 2; i >= 0; i -= Math.floor(months.length / 3) + 1) {
					const month = months[i];
					const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
					const yearString = month.substring(0, month.indexOf('-'));
					xAxis.push(monthString + ' ' + yearString);
				}
			} else {
				for (let i = months.length - 1; i >= 0 && xAxis.length < 3; i--) {
					const month = months[i];
					const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
					const yearString = month.substring(0, month.indexOf('-'));
					xAxis.push(monthString + ' ' + yearString);
				}
			}
		} else if (revenueBy === strings.ByYear) {
			months = months.filter((value) => !value.includes('-'));
			for (let i = months.length - 1; i >= 0; i--) {
				const month = months[i];
				chartData.push(revenueData[month]);
			}

			if (months.length > 4) {
				for (let i = months.length - 2; i >= 0; i -= Math.floor(months.length / 3) + 1) {
					const month = months[i];
					xAxis.push(month);
				}
			} else {
				for (let i = months.length - 1; i >= 0 && xAxis.length < 3; i--) {
					const month = months[i];
					xAxis.push(month);
				}
			}
		}
		return { chartData, xAxis };
	}

	//Generates the chart data for the top services graph and returns it based on the current state of the picker
	generateTopServicesChartData() {
		const { topServicesBy, topServicesData } = this.state;

		const chartData = [];
		const xAxis = [];

		let services = Object.keys(topServicesData);

		if (topServicesBy === strings.ByTotalRequests) {
			services.sort((a, b) => {
				return topServicesData[b].totalRequests - topServicesData[a].totalRequests;
			});
			for (let i = 0; i < services.length && i < 3; i++) {
				chartData.push(topServicesData[services[i]].totalRequests);
				xAxis.push(topServicesData[services[i]].serviceTitle);
			}
		} else if (topServicesBy === strings.ByTotalRevenue) {
			services.sort((a, b) => {
				return topServicesData[b].totalRevenue - topServicesData[a].totalRevenue;
			});
			for (let i = 0; i < services.length && i < 3; i++) {
				chartData.push(topServicesData[services[i]].totalRevenue);
				xAxis.push(topServicesData[services[i]].serviceTitle);
			}
		} else if (topServicesBy === strings.ByTotalViews) {
			services.sort((a, b) => {
				return topServicesData[b].totalViews - topServicesData[a].totalViews;
			});
			for (let i = 0; i < services.length && i < 3; i++) {
				chartData.push(topServicesData[services[i]].totalViews);
				xAxis.push(topServicesData[services[i]].serviceTitle);
			}
		}

		return { chartData, xAxis };
	}

	//Generates the chart data for the customer locations graph and returns it based on the current state of the picker
	generateCustomerLocationsChartData() {
		const { customerLocationsBy, customerLocationData } = this.state;

		const chartData = [];
		const xAxis = [];
		if (customerLocationsBy === strings.ByCity) {
			const { Cities } = customerLocationData;
			let cityKeys = Object.keys(Cities);
			cityKeys.sort((a, b) => Cities[b] - Cities[a]);
			for (let i = 0; i < cityKeys.length && i < 3; i++) {
				chartData.push(Cities[cityKeys[i]]);
				xAxis.push(cityKeys[i]);
			}
		} else if (customerLocationsBy === strings.ByCountry) {
			const { Countries } = customerLocationData;
			let countryKeys = Object.keys(Countries);
			countryKeys.sort((a, b) => Countries[b] - Countries[a]);
			for (let i = 0; i < countryKeys.length && i < 3; i++) {
				chartData.push(Countries[countryKeys[i]]);
				xAxis.push(countryKeys[i]);
			}
		} else if (customerLocationsBy === strings.ByState) {
			const { States } = customerLocationData;
			let stateKeys = Object.keys(States);
			stateKeys.sort((a, b) => States[b] - States[a]);
			for (let i = 0; i < stateKeys.length && i < 3; i++) {
				chartData.push(States[stateKeys[i]]);
				xAxis.push(stateKeys[i]);
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

		//Fetches all the chart data before rendering
		const revenueChart = this.generateRevenueChartData();
		const topServicesChart = this.generateTopServicesChartData();
		const customerLocationData = this.generateCustomerLocationsChartData();

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
							alignSelf: 'center',
							marginTop: screenHeight * 0.015,
							borderBottomColor: colors.gray,
							borderBottomWidth: 2,
							paddingBottom: screenHeight * 0.025,
							width: screenWidth * 0.95,
						}}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.blue]}>{strings.Revenue}</Text>
						<View
							style={{
								marginRight: screenWidth * 0.05,
								marginVertical: screenHeight * 0.015,
								alignSelf: 'flex-end',
								borderColor: colors.lightBlue,
								borderWidth: 3,
								borderRadius: 20,
								paddingHorizontal: screenWidth * 0.01,
								backgroundColor: colors.white,
							}}>
							<RNPickerSelect
								onValueChange={(value) => this.setState({ revenueBy: value })}
								items={[
									{ label: strings.ByMonth, value: strings.ByMonth },
									{ label: strings.ByYear, value: strings.ByYear },
								]}
								value={revenueBy}
								style={{
									iconContainer: {
										top: screenHeight * 0.015,
									},
									inputIOS: [
										fontStyles.smallTextStyle,
										fontStyles.blue,
										{
											width: screenWidth * 0.275,
											height: screenHeight * 0.05,
										},
									],
									inputAndroid: [
										fontStyles.smallTextStyle,
										fontStyles.blue,
										{
											width: screenWidth * 0.275,
											height: screenHeight * 0.05,
										},
									],
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
								width: screenWidth * 0.95,
								paddingHorizontal: screenWidth * 0.025,
								paddingVertical: screenHeight * 0.01,
							}}>
							<View style={{ alignSelf: 'center' }}>
								<Text style={[fontStyles.subTextStyle, fontStyles.blue]}>
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
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Text style={[fontStyles.mainTextStyle, fontStyles.blue]}>
										{strings.NoDataYet}
									</Text>
								</View>
							) : (
								<View>
									<View
										style={{
											flexDirection: 'row',
										}}>
										<YAxis
											data={revenueChart.chartData}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}
											svg={{ ...fontStyles.subTextStyle, fill: colors.lightBlue }}
											numberOfTicks={
												revenueChart.chartData.length < 5 ? revenueChart.chartData.length : 5
											}
											formatLabel={(value) => '$' + value}
										/>
										<LineChart
											style={{
												paddingHorizontal: screenWidth * 0.02,
												height: screenHeight * 0.3,
												width: screenWidth * 0.7,
											}}
											data={revenueChart.chartData}
											numberOfTicks={8}
											svg={{
												stroke: colors.lightBlue,
												strokeWidth: 3,
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
											bottom: screenHeight * 0.022,
										}}
										svg={{ ...fontStyles.subTextStyle, fill: colors.lightBlue }}
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
							alignSelf: 'center',
							marginTop: screenHeight * 0.015,
							borderBottomColor: colors.gray,
							borderBottomWidth: 2,
							paddingBottom: screenHeight * 0.025,
							width: screenWidth * 0.95,
						}}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.blue]}>{strings.TopServices}</Text>
						<View
							style={{
								marginRight: screenWidth * 0.05,
								marginVertical: screenHeight * 0.015,
								alignSelf: 'flex-end',
								borderColor: colors.lightBlue,
								borderWidth: 3,
								borderRadius: 20,
								paddingHorizontal: screenWidth * 0.01,
								backgroundColor: colors.white,
							}}>
							<RNPickerSelect
								onValueChange={(value) => this.setState({ topServicesBy: value })}
								items={[
									{ label: strings.ByTotalRequests, value: strings.ByTotalRequests },
									{ label: strings.ByTotalRevenue, value: strings.ByTotalRevenue },
									{ label: strings.ByTotalViews, value: strings.ByTotalViews },
								]}
								value={topServicesBy}
								style={{
									iconContainer: {
										top: screenHeight * 0.015,
									},
									inputIOS: [
										fontStyles.smallTextStyle,
										fontStyles.blue,
										{
											width: screenWidth * 0.415,
											height: screenHeight * 0.05,
										},
									],
									inputAndroid: [
										fontStyles.smallTextStyle,
										fontStyles.blue,
										{
											width: screenWidth * 0.415,
											height: screenHeight * 0.05,
										},
									],
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
								width: screenWidth * 0.95,
								paddingVertical: screenHeight * 0.01,
								height: screenHeight * 0.38,
								borderRadius: 15,
							}}>
							{topServicesChart.chartData.length === 0 ? (
								<View
									style={{
										paddingHorizontal: screenWidth * 0.02,
										height: screenHeight * 0.3,
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Text style={[fontStyles.mainTextStyle, fontStyles.blue]}>
										{strings.NoDataYet}
									</Text>
								</View>
							) : (
								<View>
									<View
										style={{
											flexDirection: 'row',
											marginBottom: screenHeight * 0.01,
										}}>
										<YAxis
											data={topServicesChart.chartData}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}
											svg={{ ...fontStyles.subTextStyle, fill: colors.lightBlue }}
											min={0}
											numberOfTicks={3}
											formatLabel={(value) => value}
										/>
										<BarChart
											style={{
												height: screenHeight * 0.3,
												width: screenWidth * 0.8,
												paddingHorizontal: screenWidth * 0.02,
											}}
											gridMin={0}
											data={topServicesChart.chartData}
											numberOfTicks={8}
											svg={{ fill: colors.lightBlue }}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}>
											<Grid />
										</BarChart>
									</View>
									<XAxis
										data={topServicesChart.chartData}
										contentInset={{
											left: screenWidth * 0.03,
											right: screenWidth * -0.03,
										}}
										scale={scale.scaleBand}
										svg={{ ...fontStyles.subTextStyle, fill: colors.lightBlue }}
										formatLabel={(value, index) => topServicesChart.xAxis[index]}
									/>
								</View>
							)}
						</View>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
							width: screenWidth,
							marginTop: screenHeight * 0.015,
							borderBottomColor: colors.gray,
							borderBottomWidth: 2,
							paddingBottom: screenHeight * 0.025,
							marginBottom: screenHeight * 0.025,
							width: screenWidth * 0.95,
						}}>
						<Text style={[fontStyles.bigTextStyle, fontStyles.blue]}>
							{strings.CustomerLocations}
						</Text>
						<View
							style={{
								marginRight: screenWidth * 0.05,
								marginVertical: screenHeight * 0.015,
								alignSelf: 'flex-end',
								borderColor: colors.lightBlue,
								borderWidth: 3,
								borderRadius: 20,
								paddingHorizontal: screenWidth * 0.01,
								backgroundColor: colors.white,
							}}>
							<RNPickerSelect
								onValueChange={(value) => this.setState({ customerLocationsBy: value })}
								items={[
									{ label: strings.ByCity, value: strings.ByCity },
									{ label: strings.ByState, value: strings.ByState },
									{ label: strings.ByCountry, value: strings.ByCountry },
								]}
								value={customerLocationsBy}
								style={{
									iconContainer: {
										top: screenHeight * 0.015,
									},
									inputIOS: [
										fontStyles.smallTextStyle,
										fontStyles.blue,
										{
											width: screenWidth * 0.3,
											height: screenHeight * 0.05,
										},
									],
									inputAndroid: [
										fontStyles.smallTextStyle,
										fontStyles.blue,
										{
											width: screenWidth * 0.3,
											height: screenHeight * 0.05,
										},
									],
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
								height: screenHeight * 0.38,
								width: screenWidth * 0.95,
								borderRadius: 15,
							}}>
							{customerLocationData.chartData.length === 0 ? (
								<View
									style={{
										paddingHorizontal: screenWidth * 0.02,
										height: screenHeight * 0.3,
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<Text style={[fontStyles.mainTextStyle, fontStyles.blue]}>
										{strings.NoDataYet}
									</Text>
								</View>
							) : (
								<View>
									<View
										style={{
											flexDirection: 'row',
											marginBottom: screenHeight * 0.01,
										}}>
										<YAxis
											data={customerLocationData.chartData}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}
											svg={{ ...fontStyles.subTextStyle, fill: colors.lightBlue }}
											min={0}
											numberOfTicks={3}
											formatLabel={(value) => value}
										/>
										<BarChart
											style={{
												height: screenHeight * 0.3,
												width: screenWidth * 0.8,
												paddingHorizontal: screenWidth * 0.02,
											}}
											gridMin={0}
											data={customerLocationData.chartData}
											numberOfTicks={8}
											svg={{ fill: colors.lightBlue }}
											contentInset={{ top: screenHeight * 0.022, bottom: screenHeight * 0.022 }}>
											<Grid />
										</BarChart>
									</View>
									<XAxis
										data={customerLocationData.chartData}
										contentInset={{
											left: screenWidth * 0.03,
											right: screenWidth * -0.03,
										}}
										scale={scale.scaleBand}
										svg={{ ...fontStyles.subTextStyle, fill: colors.lightBlue }}
										formatLabel={(value, index) => customerLocationData.xAxis[index]}
									/>
								</View>
							)}
						</View>
					</View>
				</ScrollView>
			</View>
		);
	}
}
