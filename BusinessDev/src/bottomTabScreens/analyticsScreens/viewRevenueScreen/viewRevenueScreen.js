import { Picker } from '@react-native-community/picker';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';
import React, { useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { Line, Rect, Svg } from 'react-native-svg';
import { Grid, LineChart, Path, XAxis, YAxis } from 'react-native-svg-charts';
import LoadingSpinner from '../../../components/LoadingSpinner';
import style from './viewRevenueScreenStyle';

//Exporting the viewRevenue class
export default function viewRevenue(props) {
	// The initial state of the screen
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [revenueBy, setRevenueBy] = useState(strings.ByMonth);
	const [revenueData, setRevenueData] = useState('');
	const [businessID, setBusinessID] = useState('');
	const currentTab = 0;

	const navigationFunctions = [
		() => {
			props.navigation.push('MonthlyRevenueScreen', {
				businessID: businessID,
			});
		},
		() => {
			props.navigation.push('TopServicesScreen', {
				businessID: businessID,
			});
		},
		() => {
			props.navigation.push('TopLocationsScreen', {
				businessID: businessID,
			});
		},
	];

	async function getData() {
		try {
			// Declares the screen name in Firebase
			FirebaseFunctions.setCurrentScreen('AnalyticsScreen', 'analyticsScreen');
			let BID = props.navigation.state.params;
			// let BID = 'zjCzqSiCpNQELwU3ETtGBANz7hY2'; //NOTE: this line is only for testing
			setBusinessID(BID);
			// Gets the firebase data and initalizes the state
			const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
				businessID: BID,
			});
			setRevenueData(analyticsData[0]);
			setIsScreenLoading(false);
		} catch (e) {
			console.log(e.toString()); //Output: "Error: INTERNAL"
		}
		console.log(businessID);
	}
	useEffect(() => {
		getData();
	}, []);

	// Generates the chart data for the revenue graph and returns it based on the current state of the picker
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

	// TODO: possibly add an animation when switching tabs
	// Render the starting tabs (navigation bar)
	function renderTabs() {
		const Tabs = [strings.Revenue, strings.TopServices, strings.CustomerLocations];
		let elements = [];

		for (let i in Tabs)
			elements.push(
				<TouchableWithoutFeedback
					onPress={() => {
						if (i != currentTab) navigationFunctions[i]();
					}}
					key={i}>
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

	// Show graph here
	return (
		<View style={style.Body}>
			<View style={style.MainTabContainer}>{renderTabs()}</View>
			<View style={style.ChartMainContainer}>{renderGraph()}</View>
		</View>
	);

	function renderGraph() {
		console.log('viewRevenueScreen');
		console.log('Current Tab: ' + currentTab);
		// A shadow component for the linechart
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
		const revenueChart = generateRevenueChartData();
		const data = revenueChart.chartData;

		const revenueChartContentInset = {
			top: screenHeight * 0.05,
			bottom: screenHeight * 0.05,
			left: 20,
			right: 20,
		};

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
	}
}
