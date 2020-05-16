import React, { useState, useEffect } from 'react';
import './Analytics.css';
import TitleComponent from '../../../components/TitleComponent';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';
import { Chart } from 'react-google-charts';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import strings from '../../../config/strings';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '../../../config/fontStyles.css';
import { View } from 'react-native-web';

export default function Analytics(props) {
	const [isScreenLoading, setIsScreenLoading] = useState(true);
	const [revenueBy, setRevenueBy] = useState('Month');
	const [customerLocationsBy, setCustomerLocationsBy] = useState('City');
	const [topServicesBy, setTopServicesBy] = useState('Revenue');
	const [revenueData, setRevenueData] = useState();
	const [customerLocationData, setCustomerLocationData] = useState();
	const [topServicesData, setTopServicesData] = useState();
	const [revenueChart, setRevenueChart] = useState([[]]);
	const [servicesChart, setServicesChart] = useState([[]]);
	const [locationsChart, setLocationsChart] = useState([[]]);

	const revenueChange = (event) => {
		setRevenueBy(event.target.value);
		setRevenueChart(generateRevenueChartData());
	};
	const servicesChange = (event) => {
		setTopServicesBy(event.target.value);
		setServicesChart(generateTopServicesChartData());
	};
	const locationsChange = (event) => {
		setCustomerLocationsBy(event.target.value);
		setLocationsChart(generateTopLocationsChartData());
	};

	// Once the elements are rendered, retrieve analytics data from firebasse and differentiate them
	const componentDidMount = async () => {
		// Replace this with fetched businessID instead of the hardcoded one
		const analyticsData = await FirebaseFunctions.call(
			'getBusinessAnalyticsByBusinessID',
			{
				businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2',
			}
		);
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
	const generateRevenueChartData = () => {
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
	const generateTopServicesChartData = () => {
		// Get the services' data from firebase
		let services = Object.keys(topServicesData);
		services = services.filter((value) => !(value === ''));

		// Set up a 2d array with the axes' titles
		let chartData = [['Services', 'Requests']];

		if (topServicesBy === 'Revenue') {
			chartData = [['Services', 'Revenue ($)']];
			services.sort((a, b) => {
				return (
					topServicesData[b].totalRevenue - topServicesData[a].totalRevenue
				);
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
				return (
					topServicesData[b].totalRequests - topServicesData[a].totalRequests
				);
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
	const generateTopLocationsChartData = () => {
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

	useEffect(() => {
		componentDidMount();
	}, []);

	if (isScreenLoading === true) {
		return (
			<div className='titlecontainer'>
				<TitleComponent
					text={strings.Analytics}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
			</div>
		);
	} else {
		return (
			<div className='container'>
				<div className='titlecontainer'>
					<text className='biggerBigTextStyle blue bold'>
						{strings.Analytics}
					</text>
				</div>
				<div className='section1 row'>
					<div className='chart1container'>
						<div className='chart1 top row'>
							<text className='title2 smallerBigTextStyle blue bold'>
								{strings.MonthlyRevenue}
							</text>
							<div className='right'>
								<FormControl className='selectcontainer row'>
									<Select
										native
										value={revenueBy}
										onChange={revenueChange}
										label='Sort By'
										style={{ borderBottomWidth: 0 }}
									>
										<option value={'Month'}>{strings.SortByMonth}</option>
										<option value={'Year'}>{strings.SortByYear}</option>
									</Select>
								</FormControl>
							</div>
						</div>
						<div className='chart1'>
							<Chart
								width={'40vw'}
								height={'40vh'}
								chartType='Line'
								loader={<div>{strings.LoadingChart}</div>}
								data={revenueChart.chartData}
								style={{ marginTop: '2vh' }}
								options={{
									height: '100%',
									hAxis: {
										title: strings.Month,
										titleTextStyle: { fontSize: 20 },
									},
									vAxis: {
										title: strings.RevenueDollarSign,
									},
									legend: 'none',
									colors: [colors.lightBlue],
								}}
							/>
						</div>
					</div>
					<div className='section2'>
						<div className='chart2container'>
							<div className='row chart2'>
								<text className='title2 smallerBigTextStyle blue bold'>
									{strings.TopServices}
								</text>
								<div className='right'>
									<FormControl className='selectcontainer select2 row'>
										<Select
											native
											value={topServicesBy}
											onChange={servicesChange}
											label={strings.SortBy}
										>
											<option value={'Revenue'}>{strings.SortByRevenue}</option>
											<option value={'Requests'}>
												{strings.SortByRequests}
											</option>
											<option value={'Views'}>{strings.SortByViews}</option>
										</Select>
									</FormControl>
								</div>
							</div>
							<Chart
								className='chart2'
								width={'35vw'}
								height={'20vh'}
								chartType='Bar'
								loader={<div>{strings.LoadingChart}</div>}
								data={servicesChart.chartData}
								options={{
									colors: [colors.lightBlue],
								}}
							/>
						</div>
						<div className='chart3container'>
							<div className='row chart3'>
								<text className='title2 smallerBigTextStyle blue bold'>
									{strings.TopLocations}
								</text>
								<div className='right'>
									<FormControl className='selectcontainer row'>
										<Select
											native
											value={customerLocationsBy}
											onChange={locationsChange}
											label={strings.SortBy}
										>
											<option value={'City'}>{strings.SortByCity}</option>
											<option value={'State'}>{strings.SortByState}</option>
											<option value={'Country'}>{strings.SortByCountry}</option>
										</Select>
									</FormControl>
								</div>
							</div>
							<Chart
								className='chart3'
								width={'30vw'}
								height={'20vh'}
								chartType='Bar'
								loader={<div>{strings.LoadingChart}</div>}
								data={locationsChart.chartData}
								options={{
									colors: [colors.lightBlue],
								}}
							/>
						</div>
					</div>
				</div>

				<div className='chart4container'>
					<text className='chart4title bigTextStyle blue bold '>
						{strings.BestDays}
					</text>
					<Chart
						className='chart4'
						width={'90vw'}
						height={'20vh'}
						chartType='Calendar'
						loader={<div>{strings.LoadingChart}</div>}
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
							colorAxis: {
								minValue: 5,
								colors: [colors.white, colors.lightBlue],
							},
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
								dayOfWeekLabel: {
									...fontStyles.mainTextStyle,
									...fontStyles.blue,
								},
								dayOfWeekRightSpace: 10,
								monthLabel: { ...fontStyles.mainTextStyle, ...fontStyles.blue },
								monthOutlineColor: {
									stroke: '#000',
									strokeOpacity: 0.8,
									strokeWidth: 2,
								},
								underMonthSpace: 15,
								underYearSpace: 5,
								yearLabel: { ...fontStyles.bigTitleStyle, ...fontStyles.blue },
							},
						}}
					/>
				</div>
			</div>
		);
	}
}
