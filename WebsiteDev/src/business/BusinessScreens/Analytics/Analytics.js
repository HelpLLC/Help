import React, { Component, useState } from 'react';
import './Analytics.css';
import TitleComponent from '../../../components/TitleComponent';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';
import { Chart } from 'react-google-charts';
import FirebaseFunctions from '../../../config/FirebaseFunctions';

export default function Analytics(props) {
	const [isScreenLoading, setIsScreenLoading] = React.useState(true);
	const [revenueBy, setRevenueBy] = React.useState();
	const [customerLocationsBy, setCustomerLocationsBy] = React.useState();
	const [topServicesBy, setTopServicesBy] = React.useState();
	const [revenueData, setRevenueData] = React.useState();
	const [customerLocationData, setCustomerLocationData] = React.useState();
	const [topServicesData, setTopServicesData] = React.useState();
	const [revenueChart, setRevenueChart] = React.useState([[]]);
	const [servicesChart, setServicesChart] = React.useState([[]]);
	const [locationsChart, setLocationsChart] = React.useState([[]]);

	// Once the elements are rendered, retrieve analytics data from firebasse and differentiate them
	const componentDidMount = async () => {
		// const { businessID } = 'zjCzqSiCpNQELwU3ETtGBANz7hY2';
		const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
			businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
		});
		const revenueDataConst = analyticsData[0];
		const topServicesDataConst = analyticsData[1];
		const customerLocationDataConst = analyticsData[2];

		setRevenueData(revenueDataConst);
		setTopServicesData(topServicesDataConst);
		setCustomerLocationData(customerLocationDataConst);

		// ensures all data is loaded, then format the data for the chart
		if (
			revenueData !== undefined &&
			topServicesData !== undefined &&
			customerLocationData !== undefined
		) {
			setRevenueChart(await generateRevenueChartData());
			setServicesChart(await generateTopServicesChartData());
			setLocationsChart(await generateTopLocationsChartData());
			setIsScreenLoading(false);
		}
	};

	//Generates the chart data for the revenue graph
	const generateRevenueChartData = async () => {
		// const { revenueBy, revenueData } = this.state;

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

		// Only get the months out of the data
		let months = Object.keys(revenueData);
		months.sort();
		months.reverse();
		let chartData = [['Month', 'Revenue ($)']];
		months = months.filter((value) => value.includes('-'));
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
			const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
			const yearString = month.substring(0, month.indexOf('-'));
			chartData.push(new Array(monthString + ' ' + yearString, data[i]));
		}

		return { chartData };
	};

	//Generates the chart data for the services graph
	const generateTopServicesChartData = async () => {
		// const { topServicesBy, topServicesData } = this.state;

		// Get the services' data from firebase
		let services = Object.keys(topServicesData);

		// Set up a 2d array with the axes' titles
		let chartData = [['Services', 'Orders']];

		// Ordered by total number of requests
		services.sort((a, b) => {
			return topServicesData[b].totalRequests - topServicesData[a].totalRequests;
		});
		for (let i = 0; i < services.length && i < 3; i++) {
			chartData.push(
				new Array(
					topServicesData[services[i]].serviceTitle,
					topServicesData[services[i]].totalRequests
				)
			);
		}

		return { chartData };
	};

	//Generates the chart data for the customer locations graph
	const generateTopLocationsChartData = async () => {
		// const { customerLocationsBy, customerLocationData } = this.state;

		// Set up a 2d array with the axes' titles
		let chartData = [['Services', 'Orders']];

		// Get the cities, order them by the number of orders, and add them to a 2d array
		const { Cities } = customerLocationData;
		let cityKeys = Object.keys(Cities);
		cityKeys.sort((a, b) => Cities[b] - Cities[a]);
		for (let i = 0; i < cityKeys.length && i < 3; i++) {
			chartData.push(new Array(cityKeys[i], Cities[cityKeys[i]]));
		}

		return { chartData };
	};

	if (isScreenLoading === true) {
		componentDidMount();
		return (
			<div className='container'>
				<TitleComponent />
				<TitleComponent text={'Analytics'} isCentered={true} textColor={colors.lightBlue} />
				<TitleComponent
					text={'Monthly Revenue in 2020 (MATERIAL UI)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
			</div>
		);
	} else {
		return (
			<div className='container'>
				<TitleComponent />
				<TitleComponent text={'Analytics'} isCentered={true} textColor={colors.lightBlue} />
				<TitleComponent
					text={'Monthly Revenue in 2020 (MATERIAL UI)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					width={'auto'}
					chartType='Line'
					style={{ marginRight: '1%', marginLeft: '5%' }}
					loader={<div>Loading Chart</div>}
					data={revenueChart.chartData}
					options={{
						height: 350,
						hAxis: {
							title: 'Month'
						},
						vAxis: {
							title: 'Revenue ($)'
						},
						legend: 'none',
						colors: [colors.lightBlue]
					}}
				/>
				<TitleComponent
					text={'Monthly Revenue in 2020 (Normal)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					width={'auto'}
					chartType='LineChart'
					loader={<div>Loading Chart</div>}
					data={revenueChart.chartData}
					options={{
						height: 350,
						fontFamily: 'Arial',
						chart: {
							title: 'Monthly Revenue in 2020'
						},
						hAxis: {
							title: 'Month',
							textStyle: fontStyles.miniTextStyleBlue
						},
						vAxis: {
							title: 'Revenue ($)',
							textStyle: fontStyles.miniTextStyleBlue
						},
						colors: [colors.lightBlue],
						series: {
							0: { lineWidth: 3 }
						}
					}}
				/>

				<TitleComponent
					text={'Top Services (Material UI)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					width={'auto'}
					height={'75%'}
					style={{ marginRight: '1%', marginLeft: '5%' }}
					chartType='Bar'
					loader={<div>Loading Chart</div>}
					data={servicesChart.chartData}
					options={{
						colors: [colors.lightBlue]
					}}
				/>

				<TitleComponent
					text={'Top Services (Normal)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					chartType='ColumnChart'
					width='auto'
					data={servicesChart.chartData}
					options={{
						height: 350,
						hAxis: {
							title: 'Services',
							textStyle: fontStyles.subTextStyleBlue
						},
						vAxis: {
							title: 'Orders',
							textStyle: fontStyles.subTextStyleBlue
						},
						colors: [colors.lightBlue]
					}}
				/>

				<TitleComponent
					text={'Top Locations (Material UI)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					width={'auto'}
					height={'75%'}
					style={{ marginRight: '1%', marginLeft: '5%' }}
					chartType='Bar'
					loader={<div>Loading Chart</div>}
					data={locationsChart.chartData}
					options={{
						colors: [colors.lightBlue]
					}}
				/>

				<TitleComponent
					text={'Top Locations (Normal)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					chartType='ColumnChart'
					width='auto'
					data={locationsChart.chartData}
					options={{
						height: 350,
						hAxis: {
							title: 'Services',
							textStyle: fontStyles.subTextStyleBlue
						},
						vAxis: {
							title: 'Orders',
							textStyle: fontStyles.subTextStyleBlue
						},
						colors: [colors.lightBlue]
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
							{ type: 'number', id: 'Won/Loss' }
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
						[new Date(2020, 9, 19), 9]
					]}
					options={{
						height: 300,
						noDataPattern: {
							backgroundColor: colors.lightBlue,
							color: colors.columbiaBlue
						},
						colorAxis: { minValue: 5, colors: [colors.white, colors.lightBlue] },
						calendar: {
							cellSize: 21,
							cellColor: {
								stroke: colors.lightBlue,
								strokeOpacity: 0.5,
								strokeWidth: 2
							},
							focusedCellColor: {
								stroke: colors.lightBlue,
								strokeOpacity: 1,
								strokeWidth: 4
							},
							dayOfWeekLabel: fontStyles.mainTextStyleBlue,
							dayOfWeekRightSpace: 10,
							monthLabel: fontStyles.mainTextStyleBlue,
							monthOutlineColor: {
								stroke: '#000',
								strokeOpacity: 0.8,
								strokeWidth: 2
							},
							underMonthSpace: 15,
							underYearSpace: 5, // Bottom padding for the year labels.
							yearLabel: fontStyles.bigTitleStyleBlue
						}
					}}
				/>
			</div>
		);
	}
}
