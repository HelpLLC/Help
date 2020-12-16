import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { screenWidth, screenHeight } from 'config/dimensions';
import colors from 'config/colors';
import strings from 'config/strings';
import FirebaseFunctions from 'config/FirebaseFunctions';
import style from './viewTopServicesScreenStyle';
import fontStyles from 'config/styles/fontStyles';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { BarChart, Grid, LineChart, YAxis, XAxis, Path } from 'react-native-svg-charts';
import { Svg, G, Rect, Line, Text as SvgText } from 'react-native-svg';
import { Picker } from '@react-native-community/picker';
import * as scale from 'd3-scale';
import * as array from 'd3-array';

//exporting the viewTopServicesScreen class
export default function viewTopServicesScreen(props) {
	//The intial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [topServicesBy, setTopServicesBy] = useState(strings.ByTotalRequests);
	const [topServicesData, setTopServicesData] = useState('');
	const [businessID, setBusinessID] = useState('');

	async function getData() {
		try {
			//Declares the screen name in Firebase
			// To-do: edit Firebase Function
			FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
			let BID = props.navigation.state.params;
			//let BID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2'; //NOTE: this line is only for testing
			setBusinessID(BID);
			//gets the firebase data and initalizes the state
			const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
				businessID: BID,
			});
			//setRevenueData(analyticsData[0]);
			setTopServicesData(analyticsData[1]);
			//setCustomerLocationData(analyticsData[2]);
			setIsScreenLoading(false);
		} catch (e) {
			console.log(e.toString()); //Output: "Error: INTERNAL"
		}
	}
	useEffect(() => {
		getData();
	}, []);

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

	// Format numerical labels correctly
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

	//Rendering the screen
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
			{/*<View style={style.MainTabContainer}>{renderTabs()}</View>-->*/}
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
		const topServicesChart = generateTopServicesChartData();
		const data = topServicesChart.chartData;

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

		const ticks = getTicks(data, 3);
		const tickWidthMultiplier = ticks[ticks.length - 1] / array.extent(data)[1];

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
					<Text style={[fontStyles.bigTextStyle, style.ChartTitleText]}>{strings.TopServices}</Text>
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
							<Picker.Item label={'Sort ' + strings.ByTotalViews} value={strings.ByTotalViews} />
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
	}
}
