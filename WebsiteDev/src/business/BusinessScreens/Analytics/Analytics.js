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
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';

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
    setRevenueChart(generateRevenueChartData(revenueData, event.target.value));
  };
  const servicesChange = (event) => {
    setTopServicesBy(event.target.value);
    setServicesChart(
      generateTopServicesChartData(topServicesData, event.target.value)
    );
  };
  const locationsChange = (event) => {
    setCustomerLocationsBy(event.target.value);
    setLocationsChart(
      generateTopLocationsChartData(customerLocationsBy, event.target.value)
    );
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
    setRevenueChart(generateRevenueChartData(revenueDataConst, 'Month'));
    setServicesChart(
      generateTopServicesChartData(topServicesDataConst, 'Revenue')
    );
    setLocationsChart(
      generateTopLocationsChartData(customerLocationDataConst, 'City')
    );

    setIsScreenLoading(false);
  };

  //Generates the chart data for the revenue graph
  const generateRevenueChartData = (revenueData, dataType) => {
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
    if (dataType === 'Month') {
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
      if (dataType === 'Month') {
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
  const generateTopServicesChartData = (topServicesData, dataType) => {
    // Get the services' data from firebase
    let services = Object.keys(topServicesData);
    services = services.filter((value) => !(value === ''));

    // Set up a 2d array with the axes' titles
    let chartData = [['Services', 'Requests']];

    if (dataType === 'Revenue') {
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
    } else if (dataType === 'Requests') {
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
    } else if (dataType === 'Views') {
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
  const generateTopLocationsChartData = (customerLocationData, dataType) => {
    // Set up a 2d array with the axes' titles
    let chartData = [['Cities', 'Requests']];

    if (dataType === 'City') {
      // Get the cities, order them by the number of orders, and add them to a 2d array
      const { Cities } = customerLocationData;
      let cityKeys = Object.keys(Cities);
      cityKeys.sort((a, b) => Cities[b] - Cities[a]);
      for (let i = 0; i < cityKeys.length; i++) {
        if (Cities[cityKeys[i]] > 10) {
          chartData.push(new Array(cityKeys[i], Cities[cityKeys[i]]));
        }
      }
    } else if (dataType === 'State') {
      chartData = [['States', 'Requests']];
      const { States } = customerLocationData;
      let stateKeys = Object.keys(States);
      stateKeys.sort((a, b) => States[b] - States[a]);
      for (let i = 0; i < stateKeys.length; i++) {
        if (States[stateKeys[i]] > 10) {
          chartData.push(new Array(stateKeys[i], States[stateKeys[i]]));
        }
      }
    } else if (dataType === 'Country') {
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
      <div className='top'>
        <section className='dropdownheader'>
          <DropdownHeader
            businessName='Magic Hands LLC'
            modalClassName='modal'
            divClassName='toprightcontainer'
          />
        </section>
        <section className='sidebarHolder'>
          <SideMenuCard title='Help' />
        </section>

        <div className='container'>
          <TitleComponent
            text={strings.Analytics}
            isCentered={true}
            textColor={colors.lightBlue}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className='wholeAnalyticsScreen'>
        <section className='dropdownheader'>
          <DropdownHeader
            businessName='Magic Hands LLC'
            modalClassName='modal'
            divClassName='toprightcontainer'
          />
        </section>
        <section className='sidebarHolder'>
          <SideMenuCard title='Help' />
        </section>
        <div className='analyticsContainer'>
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
                      label={strings.SortBy}
                      style={{ ...fontStyles.white }}
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
                    legend: { position: 'none' },
                    colors: [colors.lightBlue],
                  }}
                />
              </div>
            </div>
            <div className='section2'>
              <div className='chart2container'>
                <div className='row chart2'>
                  <text className='title2 subTextStyle blue bold'>
                    {strings.TopServices}
                  </text>
                  <div className='right'>
                    <FormControl className='selectcontainer select2 row'>
                      <Select
                        native
                        value={topServicesBy}
                        onChange={servicesChange}
                        label={strings.SortBy}
                        style={{ ...fontStyles.white }}
                      >
                        <option value={'Revenue'}>
                          {strings.SortByRevenue}
                        </option>
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
                  width={'25vw'}
                  height={'20vh'}
                  chartType='Bar'
                  loader={<div>{strings.LoadingChart}</div>}
                  data={servicesChart.chartData}
                  options={{
                    colors: [colors.lightBlue],
                    legend: { position: 'none' },
                  }}
                />
              </div>
              <div className='chart3container'>
                <div className='row chart3'>
                  <text className='title2 subTextStyle blue bold'>
                    {strings.TopLocations}
                  </text>
                  <div className='right'>
                    <FormControl className='selectcontainer row'>
                      <Select
                        native
                        value={customerLocationsBy}
                        onChange={locationsChange}
                        label={strings.SortBy}
                        style={{ ...fontStyles.white }}
                      >
                        <option value={'City'}>{strings.SortByCity}</option>
                        <option value={'State'}>{strings.SortByState}</option>
                        <option value={'Country'}>
                          {strings.SortByCountry}
                        </option>
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <Chart
                  className='chart3'
                  width={'25vw'}
                  height={'20vh'}
                  chartType='Bar'
                  loader={<div>{strings.LoadingChart}</div>}
                  data={locationsChart.chartData}
                  options={{
                    colors: [colors.lightBlue],
                    legend: { position: 'none' },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
