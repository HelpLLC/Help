import React, { Component } from 'react';
import './Analytics.css';
import TitleComponent from '../../../components/TitleComponent';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';
import { Chart } from 'react-google-charts';
import FirebaseFunctions from '../../../config/FirebaseFunctions';

export default class Analytics extends Component {
	state = {
		isScreenLoading: true,
		revenueBy: 'By Month',
		customerLocationsBy: 'By City',
		topServicesBy: 'By Total Requests',
		revenueData: '',
		customerLocationData: '',
		topServicesData: '',
		myRevenue: [[]],
		myServices: [[]],
		myLocations: [[]]
	};

	async componentDidMount() {
		// const { businessID } = 'zjCzqSiCpNQELwU3ETtGBANz7hY2';
		const analyticsData = await FirebaseFunctions.call('getBusinessAnalyticsByBusinessID', {
			businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2'
		});
		const revenueData = analyticsData[0];
		const topServicesData = analyticsData[1];
		const customerLocationData = analyticsData[2];
		this.setState({
			revenueData,
			customerLocationData,
			topServicesData,
			isScreenLoading: false
		});

		const revenueChart = await this.generateRevenueChartData();
		this.setState({ myRevenue: revenueChart });
		const servicesChart = await this.generateTopServicesChartData();
		this.setState({ myServices: servicesChart });
		const locationsChart = await this.generateTopLocationsChartData();
		this.setState({ myLocations: locationsChart });
	}

	//Generates the chart data for the revenue graph
	async generateRevenueChartData() {
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
		let chartData = [['Month', 'Revenue ($)']];
		months = months.filter((value) => value.includes('-'));
		months = months.filter((value, index) => index <= 11);

		var data = [];
		for (let i = months.length - 1; i >= 0; i--) {
			const month = months[i];
			data.push(parseInt(revenueData[month]));
		}
		console.log(data);

		if (months.length > 4) {
			for (let i = months.length - 2; i >= 0; i--) {
				const month = months[i];
				const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
				const yearString = month.substring(0, month.indexOf('-'));
				chartData.push(new Array(monthString + ' ' + yearString, data[i]));
			}
		} else {
			for (let i = months.length - 1; i >= 0 && chartData.length < 3; i--) {
				const month = months[i];
				const monthString = monthStrings[parseInt(month.substring(month.indexOf('-') + 1)) - 1];
				const yearString = month.substring(0, month.indexOf('-'));
				chartData.push(new Array(monthString + ' ' + yearString, data[i]));
			}
		}

		return { chartData };
	}

	//Generates the chart data for the services graph
	async generateTopServicesChartData() {
		const { topServicesBy, topServicesData } = this.state;

		let services = Object.keys(topServicesData);

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
	}

	//Generates the chart data for the customer locations graph
	async generateTopLocationsChartData() {
		const { customerLocationsBy, customerLocationData } = this.state;

		let chartData = [['Services', 'Orders']];
		const { Cities } = customerLocationData;
		let cityKeys = Object.keys(Cities);
		cityKeys.sort((a, b) => Cities[b] - Cities[a]);
		for (let i = 0; i < cityKeys.length && i < 3; i++) {
			chartData.push(new Array(cityKeys[i], Cities[cityKeys[i]]));
		}

		return { chartData };
	}

	render() {
		const {
			revenueBy,
			customerLocationsBy,
			topServicesBy,
			isScreenLoading,
			myRevenue,
			myServices,
			myLocations
		} = this.state;
		if (isScreenLoading === true) {
			return (
				<div className='container'>
					<TitleComponent />
					<TitleComponent text={'Analytics'} isCentered={true} textColor={colors.lightBlue} />
					<TitleComponent
						text={'Screen loading...'}
						isCentered={true}
						textColor={colors.lightBlue}
					/>
				</div>
			);
		}

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
					data={myRevenue.chartData}
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
					data={myRevenue.chartData}
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
					data={myServices.chartData}
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
					data={myServices.chartData}
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
					data={myLocations.chartData}
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
					data={myLocations.chartData}
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
