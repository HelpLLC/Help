import React from 'react';
import './LandingPage.css';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import LoginRegister from '../Authentication/LoginRegister';
import strings from '../../../config/strings';
import fontStyles from '../../../config/fontStyles';
import HelpButton from '../../../components/HelpButton/HelpButton';
import { screenHeight, screenWidth } from '../../../config/dimensions';

export default function LandingPage() {
	//To save code, this generates each reduntant section in the landing page
	const featureSection = (title, message, image, leftRight) => {
		return (
			<div
				className={
					leftRight === 'right' ? 'featureSectionGray' : 'featureSectionLightGray'
				}>
				<div
					className={
						leftRight === 'right' ? 'featureSectionRight' : 'featureSectionLeft'
					}>
					<div className={'featureTitle'} style={fontStyles.bigSubTitleStyleBlue}>
						{title}
					</div>
					<div style={fontStyles.bigTextStyleBlack}>{message}</div>
				</div>
			</div>
		);
	};

	return (
		<div className={'landingPageContainer'}>
			<div style={fontStyles.bigTitleStyleBlack} className={'topMessage'}>
				{strings.EnhanceYourBusiness}
			</div>
			{featureSection(
				strings.ConnectWithCustomers,
				strings.ConnectWithCustomersMessage,
				'',
				'right'
			)}
			{featureSection(strings.SmartScheduling, strings.SmartSchedulingMessage, '', 'left')}
			{featureSection(
				strings.AdvancedAnalytics,
				strings.AdvancedAnalyticsMessage,
				'',
				'right'
			)}
			{featureSection(
				strings.CentralizedPayments,
				strings.CentralizedPaymentsMessage,
				'',
				'left'
			)}
			{featureSection(
				strings.EmployeeManagement,
				strings.EmployeeManagementMessage,
				'',
				'right'
			)}
			<div className={'startSellingToday'}>
				<div className={'startSellingLeftSection'}>
					<div style={fontStyles.bigSubTitleStyleBlack}>{strings.StartSellingToday}</div>
					<div style={fontStyles.bigTextStyleBlack} className={'startSellingMessage'}>
						<div>{strings.StartSellingTodayMessage}</div>
					</div>
					<div className={'signUpButton'}>
						<Link style={{ textDecoration: 'none' }} to='/login'>
							<HelpButton
								title={strings.SignUp}
								onPress={(event) => (window.location.href = '/signUp')}
								width={screenWidth * 0.1}
							/>
						</Link>
						<div className={'percentageText'} style={fontStyles.subTextStyleBlack}>
							{strings.PercentageMessage}
						</div>
					</div>
				</div>
				<div className={'helpLogo'} style={fontStyles.bigTitleStyleBlue}>
					{strings.Help}
				</div>
			</div>
		</div>
	);
}
