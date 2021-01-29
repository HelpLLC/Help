import { Picker } from '@react-native-community/picker';
import colors from 'config/colors';
import { screenHeight } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import * as array from 'd3-array';
import * as scale from 'd3-scale';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { Line, Svg, Text as SvgText } from 'react-native-svg';
import { BarChart, Path, YAxis } from 'react-native-svg-charts';
import LoadingSpinner from '../../../components/LoadingSpinner';
import style from './viewTopLocationsScreenStyle';

// Exporting the viewTopLocationsScreen class
export default function viewTopLocationsScreen(props) {
	//The initial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [customerLocationsBy, setCustomerLocationsBy] = useState(strings.ByCity);
	const [customerLocationData, setCustomerLocationData] = useState('');
	const [businessID, setBusinessID] = useState('');

	async function getData() {
		try {
			// Declares the screen name in Firebase
			/* To-do: edit Firebase Function
			 * https://firebase.google.com/docs/analytics/screenviews#kotlin+ktx
			 * Previous methods of logging screen names using `setScreenName` on iOS and
			 * `setCurrentScreen` on Android will be deprecated and removed in a future major release.
			 */
			FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
			let BID = props.navigation.state.params;
			// let BID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2'; //NOTE: this line is only for testing
			setBusinessID(BID);
			// Gets the firebase data and initalizes the state
			const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
				businessID: BID,
			});
			setCustomerLocationData(analyticsData[2]);
			setIsScreenLoading(false);
		} catch (e) {
			console.log(e.toString()); //Output: "Error: INTERNAL"
		}
	}
	useEffect(() => {
		getData();
	}, []);

	// Generates the chart data for the customer locations graph and returns it based on the current state of the picker
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
		// In order for the label to be centered, it needs to have white space on its right
		const initalLength = output.length;
		for (let i = 0; i < initalLength; i++) output += ' ';
		return output;
	}

	// Rendering the screen
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

		// Fetches all the chart data before rendering
		const customerLocationData = generateCustomerLocationsChartData();
		const data = customerLocationData.chartData;

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

		return (
			<View>
				<View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
					<Text style={[fontStyles.bigTextStyle, style.ChartTitleText]}>
						{strings.CustomerLocations}
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
