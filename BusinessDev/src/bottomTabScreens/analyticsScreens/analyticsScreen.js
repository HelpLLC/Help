import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './analyticsScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart, Grid, LineChart, YAxis, XAxis, Path } from 'react-native-svg-charts';
import { Svg, G, Rect, Line, Text as SvgText } from 'react-native-svg';
import { Picker } from '@react-native-community/picker';
import * as scale from 'd3-scale';
import * as array from 'd3-array';

//exporting the profileScreen class
export default function analyticsScreen(props) {
	//The initial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [revenueBy, setRevenueBy] = useState(strings.ByMonth);
	const [customerLocationsBy, setCustomerLocationsBy] = useState(strings.ByCity);
	const [topServicesBy, setTopServicesBy] = useState(strings.ByTotalRequests);
	const [revenueData, setRevenueData] = useState('');
	const [customerLocationData, setCustomerLocationData] = useState('');
	const [topServicesData, setTopServicesData] = useState('');
	const [businessID, setBusinessID] = useState('');
	const [currentTab, setCurrentTab] = useState(0);

	async function getData() {
		try {
			//Declares the screen name in Firebase
			FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
			//let BID = props.navigation.state.params;
			let BID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2'; //NOTE: this line is only for testing
			setBusinessID(BID);
			//gets the firebase data and initalizes the state
			const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
				businessID: BID,
			});
			setRevenueData(analyticsData[0]);
			setTopServicesData(analyticsData[1]);
			setCustomerLocationData(analyticsData[2]);
			setIsScreenLoading(false);
		} catch (e) {
			console.log(e.toString()); //Output: "Error: INTERNAL"
		}
	}
	useEffect(() => {
		getData();
	}, []);

	//Generates the chart data for the revenue graph and returns it based on the current state of the picker
	function generateRevenueChartData() {
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
		let xAxis2 = [];
		if (revenueBy === strings.ByMonth) {
			months = months.filter((value) => value.includes('-'));
			months = months.filter((value, index) => index <= 11);

			for (let i = months.length - 1; i >= 0; i--) {
				const month = months[i];
				chartData.push(revenueData[month]);
			}

			if (months.length > 4) {
				for (let i = 0; i < months.length; i++) {
					xAxis.push('');
					xAxis2.push('');
				}
				for (let i = months.length - 2; i >= 0; i -= Math.floor(months.length / 3) + 1) {
					const month = months[i];
					const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
					const yearString = month.substring(0, month.indexOf('-'));
					xAxis[i] = monthString;
					xAxis2[i] = yearString;
				}
			} else {
				for (let i = months.length - 1; i >= 0 && xAxis.length < 3; i--) {
					const month = months[i];
					const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
					const yearString = month.substring(0, month.indexOf('-'));
					xAxis.push(monthString);
					xAxis2.push(yearString);
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
					xAxis2.push('');
				}
			} else {
				for (let i = months.length - 1; i >= 0 && xAxis.length < 3; i--) {
					const month = months[i];
					xAxis.push(month);
					xAxis2.push('');
				}
			}
		}
		return { chartData, xAxis, xAxis2 };
	}

	//Generates the chart data for the top services graph and returns it based on the current state of the picker
	function generateTopServicesChartData() {
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
	function generateCustomerLocationsChartData() {
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

	//Render the starting tabs
	function renderTabs() {
		const Tabs = [strings.Revenue, strings.TopServices, strings.CustomerLocations];
		let elements = [];

		for (let i in Tabs)
			elements.push(
				<TouchableWithoutFeedback onPress={() => switchTabs(i)} key={i}>
					<View
						style={[
							style.TabContainer,
							i == currentTab ? style.SelectedTab : style.UnselectedTab,
							{ width: screenWidth / Tabs.length },
						]}>
						<Text
							style={[
								fontStyles.subTextStyle,
								style.TabText,
								i == currentTab ? style.SelectedTabText : style.UnselectedTabText,
							]}>
							{Tabs[i]}
						</Text>
					</View>
				</TouchableWithoutFeedback>
			);

		return elements;
	}

	//handle the behavior of the UI when switching tabs
	function switchTabs(index) {
		if (currentTab == index) return;

		setCurrentTab(index);

		//TODO: possibly add an animation here
	}

	//format the label correctly
	function formatLabel(input) {
		let output;
		if (input >= 1000000) output = input / 1000000 + 'M';
		else if (input >= 1000) output = input / 1000 + 'K';
		else output = input + '';
		return output;
	}

	function formatSpacing(input) {
		let output = input;
		//in order for the label to be centered, it needs to have white space on its right
		const initalLength = output.length;
		for (let i = 0; i < initalLength; i++) output += ' ';
		return output;
	}

	//rendering the screen
	if (isScreenLoading === true) {
		return (
			<View style={style.Body}>
				<View style={style.Header}>{/*TODO: add header here*/}</View>
				<View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
					<LoadingSpinner isVisible={true} />
				</View>
			</View>
		);
	}

	return (
		<View style={style.Body}>
			<View style={style.MainTabContainer}>{renderTabs()}</View>
			<View style={style.ChartMainContainer}>{renderGraph()}</View>
		</View>
	);

	function renderGraph() {
		//a shadow component for the linechart
		const Shadow = ({ line }) => (
			<Path
				key={'shadow'}
				y={4}
				d={line}
				fill={'none'}
				strokeWidth={6}
				stroke={colors.blue + '33'}
			/>
		);

		//Fetches all the chart data before rendering
		const revenueChart = generateRevenueChartData();
		const topServicesChart = generateTopServicesChartData();
		const customerLocationData = generateCustomerLocationsChartData();
		const data = [
			revenueChart.chartData,
			topServicesChart.chartData,
			customerLocationData.chartData,
		];

		const revenueChartContentInset = {
			top: screenHeight * 0.05,
			bottom: screenHeight * 0.05,
			left: 20,
			right: 20,
		};
		const barChartContentInset = {
			top: screenHeight * 0.04,
			bottom: screenHeight * 0.04,
			left: 30,
			right: 30,
		};

		function getTicks(data, ticks) {
			return scale
				.scaleLinear()
				.domain([0, array.extent(data)[1]])
				.ticks(3);
		}

		const ticks = getTicks(data[parseInt(currentTab + '')], 3);
		const tickWidthMultiplier =
			ticks[ticks.length - 1] / array.extent(data[parseInt(currentTab + '')])[1];
		console.log(tickWidthMultiplier);

		function gridLines(leftInset, rightInset) {
			let elements = [];
			let spacing =
				((style.BarChart.width - leftInset - rightInset) * tickWidthMultiplier) /
				(ticks.length - 1);
			for (let i in ticks)
				elements.push(
					<View key={i}>
						<Line
							x1={leftInset + spacing * i}
							y1={0}
							x2={leftInset + spacing * i}
							y2={style.BarChart.height}
							stroke={colors.darkBlue}
							strokeWidth='2'
						/>
						<SvgText
							fill={colors.darkBlue}
							fontSize='15'
							x={leftInset + spacing * i}
							y={style.BarChart.height + 15}
							textAnchor='middle'>
							{formatLabel(ticks[i])}
						</SvgText>
					</View>
				);
			return elements;
		}

		switch (currentTab + '') {
			case '0':
				return (
					<View>
						<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={[fontStyles.bigTextStyle, style.ChartTitleText]}>{strings.Revenue}</Text>
							<View style={[style.ChartDropdownContainer, { width: 120 }]}>
								<Picker
									selectedValue={revenueBy}
									style={[style.ChartDropdown, { width: 120 }]}
									itemStyle={[fontStyles.subTextStyle, style.ChardDropdownLabels]} //NOTE: unforntunately this styling is only applied on IOS
									onValueChange={(itemValue, itemIndex) => setRevenueBy(itemValue)}
									mode='dropdown'>
									<Picker.Item label={'Sort ' + strings.ByMonth} value={strings.ByMonth} />
									<Picker.Item label={'Sort ' + strings.ByYear} value={strings.ByYear} />
								</Picker>
							</View>
						</View>
						<LineChart
							style={style.LineChart}
							data={revenueChart.chartData}
							numberOfTicks={4}
							svg={{
								stroke: colors.blue,
								strokeWidth: 3,
							}}
							contentInset={revenueChartContentInset}
							children={'polyline'}>
							<Shadow />
							<Grid svg={{ stroke: colors.darkBlue, strokeWidth: 2, x: -10 }} />
							<YAxis
								data={revenueChart.chartData}
								style={{ height: style.LineChart.height, width: 50, marginLeft: -30 }}
								svg={{ fill: colors.darkBlue, fontSize: 10, scale: 1.5 }}
								contentInset={revenueChartContentInset}
								numberOfTicks={4}
								formatLabel={(value) => formatSpacing(formatLabel(value))}
							/>
							<Svg>
								<Rect
									fill={colors.white}
									width='40'
									x='-20'
									y='35'
									height={style.LineChart.height - 100}
								/>
								<Line
									x1='20'
									y1='35'
									x2='20'
									y2={style.LineChart.height - 35}
									stroke={colors.darkBlue}
									strokeWidth='2'
								/>
							</Svg>
						</LineChart>

						<XAxis
							style={{ width: style.LineChart.width, height: 20, marginTop: -23 }}
							data={revenueChart.chartData}
							contentInset={revenueChartContentInset}
							svg={{ fill: colors.darkBlue, fontSize: 10, scale: 1.5 }}
							formatLabel={(value, index) => revenueChart.xAxis[index]}
						/>
						<XAxis
							style={{ width: style.LineChart.width, height: 15 }}
							data={revenueChart.chartData}
							contentInset={revenueChartContentInset}
							svg={{ fill: colors.darkBlue, fontSize: 10, scale: 1.5 }}
							formatLabel={(value, index) => revenueChart.xAxis2[index]}
						/>
					</View>
				);
			case '1':
				const getKeyLabel = () => {
					switch (topServicesBy) {
						case strings.ByTotalRequests:
							return strings.ByRequests;
						case strings.ByTotalRevenue:
							return strings.ByRevenue;
						case strings.ByTotalViews:
							return strings.ByViews;
					}
				};
				return (
					<View>
						<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={[fontStyles.bigTextStyle, style.ChartTitleText]}>
								{strings.TopServices}
							</Text>
							<View style={[style.ChartDropdownContainer, { width: 180 }]}>
								<Picker
									selectedValue={topServicesBy}
									style={[style.ChartDropdown, { width: 180 }]}
									itemStyle={[fontStyles.subTextStyle, style.ChardDropdownLabels]} //NOTE: unforntunately this styling is only applied on IOS
									onValueChange={(itemValue, itemIndex) => setTopServicesBy(itemValue)}
									mode='dropdown'>
									<Picker.Item
										label={'Sort ' + strings.ByTotalRequests}
										value={strings.ByTotalRequests}
									/>
									<Picker.Item
										label={'Sort ' + strings.ByTotalRevenue}
										value={strings.ByTotalRevenue}
									/>
									<Picker.Item
										label={'Sort ' + strings.ByTotalViews}
										value={strings.ByTotalViews}
									/>
								</Picker>
							</View>
						</View>
						<View style={style.BarChartContainer}>
							<YAxis
								data={topServicesChart.chartData}
								scale={scale.scaleBand}
								style={[style.BarChartYaxis, { height: style.BarChart.height }]}
								svg={{ fill: colors.darkBlue, fontSize: 10, scale: 1.5 }}
								spacingInner={0.4}
								spacingOuter={0}
								contentInset={barChartContentInset}
								formatLabel={(value, index) => formatSpacing(topServicesChart.xAxis[index])}
							/>
							<View style={style.BarChart}>
								<Svg
									height={style.BarChart.height + 20}
									width={style.BarChart.width}
									style={{ position: 'absolute' }}>
									{gridLines(barChartContentInset.left, barChartContentInset.right)}
								</Svg>
								<BarChart
									style={style.BarChart}
									data={topServicesChart.chartData}
									numberOfTicks={3}
									horizontal={true}
									gridMin={0}
									spacingInner={0.4}
									spacingOuter={0}
									svg={{
										fill: colors.blue,
										spacingInner: 0.05,
										spacingOuter: 0.05,
									}}
									contentInset={barChartContentInset}
								/>
							</View>
						</View>
						<View style={style.KeyMainContainer}>
							<View style={style.KeySubContainer}>
								<View style={style.KeyColor} />
								<Text style={[style.KeyText, fontStyles.subTextStyle]}>{getKeyLabel()}</Text>
							</View>
						</View>
					</View>
				);
			case '2':
				return (
					<View>
						<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
							<Text style={[fontStyles.bigTextStyle, style.ChartTitleText]}>
								{strings.TopServices}
							</Text>
							<View style={[style.ChartDropdownContainer, { width: 130 }]}>
								<Picker
									selectedValue={customerLocationsBy}
									style={[style.ChartDropdown, { width: 130 }]}
									itemStyle={[fontStyles.subTextStyle, style.ChardDropdownLabels]} //NOTE: unforntunately this styling is only applied on IOS
									onValueChange={(itemValue, itemIndex) => setCustomerLocationsBy(itemValue)}
									mode='dropdown'>
									<Picker.Item label={'Sort ' + strings.ByCity} value={strings.ByCity} />
									<Picker.Item label={'Sort ' + strings.ByState} value={strings.ByState} />
									<Picker.Item label={'Sort ' + strings.ByCountry} value={strings.ByCountry} />
								</Picker>
							</View>
						</View>
						<View style={style.BarChartContainer}>
							<YAxis
								data={customerLocationData.chartData}
								scale={scale.scaleBand}
								style={[style.BarChartYaxis, { height: style.BarChart.height }]}
								svg={{ fill: colors.darkBlue, fontSize: 10, scale: 1.5 }}
								spacingInner={0.4}
								spacingOuter={0}
								contentInset={barChartContentInset}
								formatLabel={(value, index) => formatSpacing(customerLocationData.xAxis[index])}
							/>
							<View style={style.BarChart}>
								<Svg
									height={style.BarChart.height + 20}
									width={style.BarChart.width}
									style={{ position: 'absolute' }}>
									{gridLines(barChartContentInset.left, barChartContentInset.right)}
								</Svg>
								<BarChart
									style={style.BarChart}
									data={customerLocationData.chartData}
									numberOfTicks={3}
									horizontal={true}
									gridMin={0}
									spacingInner={0.4}
									spacingOuter={0}
									svg={{
										fill: colors.blue,
										spacingInner: 0.05,
										spacingOuter: 0.05,
									}}
									contentInset={barChartContentInset}
								/>
							</View>
						</View>
						<View style={style.KeyMainContainer}>
							<View style={style.KeySubContainer}>
								<View style={style.KeyColor} />
								<Text style={[style.KeyText, fontStyles.subTextStyle]}>{strings.ByRequests}</Text>
							</View>
						</View>
					</View>
				);
		}
	}
}
