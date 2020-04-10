import React, { Component, useState } from 'react';
import './Analytics.css';
import TitleComponent from '../../../components/TitleComponent';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';
import { Chart } from 'react-google-charts';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

export default function Analytics(props) {
	const [isScreenLoading, setIsScreenLoading] = React.useState(true);
	const [revenueBy, setRevenueBy] = React.useState('Month');
	const [customerLocationsBy, setCustomerLocationsBy] = React.useState('City');
	const [topServicesBy, setTopServicesBy] = React.useState('Revenue');
	const [revenueData, setRevenueData] = React.useState();
	const [customerLocationData, setCustomerLocationData] = React.useState();
	const [topServicesData, setTopServicesData] = React.useState();
	const [revenueChart, setRevenueChart] = React.useState([[]]);
	const [servicesChart, setServicesChart] = React.useState([[]]);
	const [locationsChart, setLocationsChart] = React.useState([[]]);

	function revenueChange (event) {
		setRevenueBy(event.target.value);
		setRevenueChart(generateRevenueChartData());
	};
	function servicesChange (event) {
		setTopServicesBy(event.target.value);
		setServicesChart(generateTopServicesChartData());
	};
	function locationsChange (event) {
		setCustomerLocationsBy(event.target.value);
		setLocationsChart(generateTopLocationsChartData());
	};

	// Once the elements are rendered, retrieve analytics data from firebasse and differentiate them
	async function componentDidMount() {
		// Replace this with fetched businessID instead of the hardcoded one
		const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
			businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
		});
		const revenueDataConst = analyticsData[0];
		const topServicesDataConst = analyticsData[1];
		const customerLocationDataConst = analyticsData[2];

		setRevenueData(revenueDataConst);
		setTopServicesData(topServicesDataConst);
		setCustomerLocationData(customerLocationDataConst);

		// ensures all data is loaded, then format the data for the chart
		if (revenueData !== undefined) {
			setRevenueChart(generateRevenueChartData());
		}
		if (topServicesData !== undefined) {
			setServicesChart(generateTopServicesChartData());
		}
		if (customerLocationData !== undefined) {
			setLocationsChart(generateTopLocationsChartData());
		}
		setIsScreenLoading(false);
	};

	//Generates the chart data for the revenue graph
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

		// Only get the months out of the data
		let months = Object.keys(revenueData);
		months.sort();
		months.reverse();
		let chartData = [['Month', 'Revenue ($)']];
		if (revenueBy === 'Month') {
			months = months.filter((value) => value.includes('-'));
		} else {
			months = months.filter((value) => !value.includes('-'));
		}
		months = months.filter((value, index) => index <= 11);

		// Store the revenue in an array and inverse it to match the order of the months
		var data = [];
		for (let i = months.length; i >= 0; i--) {
			const month = months[i];
			data.push(parseInt(revenueData[month]));
		}
		data.reverse();

		// Combine the date and revenue into one 2d array
		for (let i = months.length - 1; i >= 0; i--) {
			const month = months[i];
			if (revenueBy === 'Month') {
				const xAxisValue =
					monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1] +
					' ' +
					month.substring(0, month.indexOf('-'));

				chartData.push(new Array(xAxisValue, data[i]));
			} else {
				chartData.push(new Array(month, data[i]));
			}
		}
		return { chartData };
	};

	//Generates the chart data for the services graph
	function generateTopServicesChartData() {
		// Get the services' data from firebase
		let services = Object.keys(topServicesData);
		services = services.filter((value) => !(value === ''));

		// Set up a 2d array with the axes' titles
		let chartData = [['Services', 'Requests']];

		if (topServicesBy === 'Revenue') {
			chartData = [['Services', 'Revenue ($)']];
			services.sort((a, b) => {
				return topServicesData[b].totalRevenue - topServicesData[a].totalRevenue;
			});
			for (let i = 0; i < services.length; i++) {
				if (topServicesData[services[i]].totalRevenue > 100) {
					chartData.push(
						new Array(
							topServicesData[services[i]].serviceTitle,
							topServicesData[services[i]].totalRevenue
						)
					);
				}
			}
		} else if (topServicesBy === 'Requests') {
			services.sort((a, b) => {
				return topServicesData[b].totalRequests - topServicesData[a].totalRequests;
			});
			for (let i = 0; i < services.length; i++) {
				if (topServicesData[services[i]].totalRequests > 10) {
					chartData.push(
						new Array(
							topServicesData[services[i]].serviceTitle,
							topServicesData[services[i]].totalRequests
						)
					);
				}
			}
		} else if (topServicesBy === 'Views') {
			chartData = [['Services', 'Views']];
			services.sort((a, b) => {
				return topServicesData[b].totalViews - topServicesData[a].totalViews;
			});
			for (let i = 0; i < services.length; i++) {
				if (topServicesData[services[i]].totalViews > 25) {
					chartData.push(
						new Array(
							topServicesData[services[i]].serviceTitle,
							topServicesData[services[i]].totalViews
						)
					);
				}
			}
		}
		return { chartData };
	};

	//Generates the chart data for the customer locations graph
	function generateTopLocationsChartData() {
		// Set up a 2d array with the axes' titles
		let chartData = [['Cities', 'Requests']];

		if (customerLocationsBy === 'City') {
			// Get the cities, order them by the number of orders, and add them to a 2d array
			const { Cities } = customerLocationData;
			let cityKeys = Object.keys(Cities);
			cityKeys.sort((a, b) => Cities[b] - Cities[a]);
			for (let i = 0; i < cityKeys.length; i++) {
				if (Cities[cityKeys[i]] > 10) {
					chartData.push(new Array(cityKeys[i], Cities[cityKeys[i]]));
				}
			}
		} else if (customerLocationsBy === 'State') {
			chartData = [['States', 'Requests']];
			const { States } = customerLocationData;
			let stateKeys = Object.keys(States);
			stateKeys.sort((a, b) => States[b] - States[a]);
			for (let i = 0; i < stateKeys.length; i++) {
				if (States[stateKeys[i]] > 10) {
					chartData.push(new Array(stateKeys[i], States[stateKeys[i]]));
				}
			}
		} else if (customerLocationsBy === 'Country') {
			chartData = [['Countries', 'Requests']];
			const { Countries } = customerLocationData;
			let countryKeys = Object.keys(Countries);
			countryKeys.sort((a, b) => Countries[b] - Countries[a]);
			for (let i = 0; i < countryKeys.length; i++) {
				if (Countries[countryKeys[i]] > 10) {
					chartData.push(new Array(countryKeys[i], Countries[countryKeys[i]]));
				}
			}
		}
		return { chartData };
	};

	if (isScreenLoading === true) {
		componentDidMount();
		return (
			<div className='container'>
				<TitleComponent text={'Analytics'} isCentered={true} textColor={colors.lightBlue} />
				<TitleComponent text={'Monthly Revenue'} isCentered={true} textColor={colors.lightBlue} />
			</div>
		);
	} else {
		return (
			<div className='container'>
				<TitleComponent text={'Analytics'} isCentered={true} textColor={colors.lightBlue} />
				<div className='row'>
					<TitleComponent text={'Monthly Revenue'} isCentered={true} textColor={colors.lightBlue} />

					<div className='right'>
					<FormControl variant='outlined'>
						<InputLabel>Sort By</InputLabel>
						<Select native value={revenueBy} onChange={revenueChange} label='Sort By'>
							<option value={'Month'}>Month</option>
							<option value={'Year'}>Year</option>
						</Select>
					</FormControl>
					</div>
				</div>

				<Chart
					width={'auto'}
					chartType='Line'
					style={{ marginRight: '1%', marginLeft: '5%' }}
					loader={<div>Loading Chart</div>}
					data={revenueChart.chartData}
					options={{
						height: '100%',
						hAxis: {
							title: 'Month',
						},
						vAxis: {
							title: 'Revenue ($)',
						},
						legend: 'none',
						colors: [colors.lightBlue],
					}}
				/>

				<div className='row'>
					<TitleComponent text={'Top Services'} isCentered={true} textColor={colors.lightBlue} />

					<div className='right'>
					<FormControl variant='outlined'>
						<InputLabel>Sort By</InputLabel>
						<Select native value={topServicesBy} onChange={servicesChange} label='Sort By'>
							<option value={'Revenue'}>Revenue</option>
							<option value={'Requests'}>Requests</option>
							<option value={'Views'}>Views</option>
						</Select>
					</FormControl>
					</div>
				</div>
				<Chart
					width={'auto'}
					height={'75%'}
					style={{ marginRight: '1%', marginLeft: '5%' }}
					chartType='Bar'
					loader={<div>Loading Chart</div>}
					data={servicesChart.chartData}
					options={{
						colors: [colors.lightBlue],
					}}
				/>

				<div className='row'>
					<TitleComponent text={'Top Locations'} isCentered={true} textColor={colors.lightBlue} />

					<div className='right'>
					<FormControl variant='outlined'>
						<InputLabel>Sort By</InputLabel>
						<Select native value={customerLocationsBy} onChange={locationsChange} label='Sort By'>
							<option value={'City'}>City</option>
							<option value={'State'}>State</option>
							<option value={'Country'}>Country</option>
						</Select>
					</FormControl>
					</div>
				</div>
				<Chart
					width={'auto'}
					height={'75%'}
					style={{ marginRight: '1%', marginLeft: '5%' }}
					chartType='Bar'
					loader={<div>Loading Chart</div>}
					data={locationsChart.chartData}
					options={{
						colors: [colors.lightBlue],
					}}
				/>

				<TitleComponent text={'Best Days'} isCentered={true} textColor={colors.lightBlue} />
				<Chart
					width={'auto'}
					chartType='Calendar'
					loader={<div>Loading Chart</div>}
					data={[
						[
							{ type: 'date', id: 'Date' },
							{ type: 'number', id: 'Customers' },
						],
						[new Date(2020, 0, 4), 6],
						[new Date(2020, 0, 5), 5],
						[new Date(2020, 0, 12), 5],
						[new Date(2020, 0, 13), 7],
						[new Date(2020, 1, 19), 6],
						[new Date(2020, 1, 23), 9],
						[new Date(2020, 1, 24), 5],
						[new Date(2020, 1, 26), 5],
						[new Date(2020, 2, 13), 6],
						[new Date(2020, 2, 14), 7],
						[new Date(2020, 2, 15), 5],
						[new Date(2020, 2, 16), 10],
						[new Date(2020, 3, 17), 9],
						[new Date(2020, 3, 10), 5],
						[new Date(2020, 3, 13), 6],
						[new Date(2020, 3, 14), 7],
						[new Date(2020, 4, 15), 5],
						[new Date(2020, 4, 16), 10],
						[new Date(2020, 4, 17), 9],
						[new Date(2020, 4, 19), 9],
						[new Date(2020, 5, 4), 6],
						[new Date(2020, 5, 5), 5],
						[new Date(2020, 5, 12), 5],
						[new Date(2020, 5, 13), 7],
						[new Date(2020, 6, 19), 6],
						[new Date(2020, 6, 23), 9],
						[new Date(2020, 6, 24), 5],
						[new Date(2020, 6, 26), 5],
						[new Date(2020, 7, 13), 6],
						[new Date(2020, 7, 14), 7],
						[new Date(2020, 7, 15), 5],
						[new Date(2020, 7, 16), 10],
						[new Date(2020, 8, 17), 9],
						[new Date(2020, 8, 10), 5],
						[new Date(2020, 8, 13), 6],
						[new Date(2020, 8, 14), 7],
						[new Date(2020, 9, 15), 5],
						[new Date(2020, 9, 16), 10],
						[new Date(2020, 9, 17), 9],
						[new Date(2020, 9, 19), 9],
					]}
					options={{
						height: 300,
						noDataPattern: {
							backgroundColor: colors.lightBlue,
							color: colors.columbiaBlue,
						},
						colorAxis: { minValue: 5, colors: [colors.white, colors.lightBlue] },
						calendar: {
							cellSize: 21,
							cellColor: {
								stroke: colors.lightBlue,
								strokeOpacity: 0.5,
								strokeWidth: 2,
							},
							focusedCellColor: {
								stroke: colors.lightBlue,
								strokeOpacity: 1,
								strokeWidth: 4,
							},
							dayOfWeekLabel: fontStyles.mainTextStyleBlue,
							dayOfWeekRightSpace: 10,
							monthLabel: fontStyles.mainTextStyleBlue,
							monthOutlineColor: {
								stroke: '#000',
								strokeOpacity: 0.8,
								strokeWidth: 2,
							},
							underMonthSpace: 15,
							underYearSpace: 5,
							yearLabel: fontStyles.bigTitleStyleBlue,
						},
					}}
				/>
			</div>
		);
	}
}
