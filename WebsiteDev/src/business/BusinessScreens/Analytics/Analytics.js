import React, { Component } from 'react';
import './Analytics.css';
import TitleComponent from '../../../components/TitleComponent';
import colors from '../../../config/colors';
import fontStyles from '../../../config/fontStyles';
import { Chart } from 'react-google-charts';

export default class Analytics extends Component {
	render() {
		return (
			<div className='Analytics'>
				<TitleComponent />
				<TitleComponent text={'Analytics'} isCentered={true} textColor={colors.lightBlue} />
				<TitleComponent
					text={'Monthly Revenue in 2020 (MATERIAL UI)'}
					isCentered={true}
					textColor={colors.lightBlue}
				/>
				<Chart
					width={'auto'}
					height={'75%'}
					chartType='Line'
					loader={<div>Loading Chart</div>}
					data={[
						['Month', 'Revenue ($)'],
						['January', 46000],
						['Feburary', 48000],
						['March', 52000],
						['April', 54000],
						['May', 56000],
						['June', 60000],
						['July', 64500],
						['August', 65500],
						['September', 69000],
						['October', 73000],
						['November', 75000],
						['December', 78000]
					]}
					options={{
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
					height={'75%'}
					chartType='LineChart'
					loader={<div>Loading Chart</div>}
					data={[
						['Month', 'Revenue ($)'],
						['January', 46000],
						['Feburary', 48000],
						['March', 52000],
						['April', 54000],
						['May', 56000],
						['June', 60000],
						['July', 64500],
						['August', 65500],
						['September', 69000],
						['October', 73000],
						['November', 75000],
						['December', 78000]
					]}
					options={{
						fontFamily: 'Arial',
						fontSize: 14,
						chart: {
							title: 'Monthly Revenue in 2020',
						},
						hAxis: {
							title: 'Month',
							textStyle: fontStyles.subTextStyleBlue,
						},
						vAxis: {
							title: 'Revenue ($)',
							textStyle: fontStyles.subTextStyleBlue,
						},
						colors: [colors.lightBlue],
						series: {
							0: { lineWidth: 3 }
						},
						backgroundColor: colors.lightGray,
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
					chartType='Bar'
					loader={<div>Loading Chart</div>}
					data={[
						['Services', 'Orders'],
						['Home Cleaning', 300],
						['Painting', 280],
						['Carpeting', 260],
						['Windows', 230],
						['Tiling', 200]
					]}
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
					height={'75%'}
					data={[
						['Service', 'Orders'],
						['Home Cleaning', 300],
						['Painting', 280],
						['Carpeting', 260],
						['Windows', 230],
						['Tiling', 200]
					]}
					options={{
						hAxis: {
							title: 'Services',
							textStyle: fontStyles.subTextStyleBlue,
						},
						vAxis: {
							title: 'Orders',
							textStyle: fontStyles.subTextStyleBlue,
						},
						colors: [colors.lightBlue],
						backgroundColor: colors.lightGray
					}}
				/>

				<TitleComponent text={'Best Days'} isCentered={true} textColor={colors.lightBlue} />
				<Chart
					width={'auto'}
					height={'75%'}
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
						noDataPattern: {
							backgroundColor: colors.lightBlue,
							color: colors.blue
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
