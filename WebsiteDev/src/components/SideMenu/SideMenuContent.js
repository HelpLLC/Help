import React from 'react';
import PropTypes from 'prop-types';
import SideMenuTitle from './SideMenuTitle';
import { useHistory } from 'react-router-dom';
import strings from '../../config/strings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideMenuStyle from './SideMenuStyle';
import FirebaseFunctions from '../../config/FirebaseFunctions';

const styles = SideMenuStyle;

export default function SideMenuContent(props) {
	SideMenuContent.propTypes = {
		style: PropTypes.object,
	};

	const history = useHistory();

	return (
		<SideMenuTitle title='Help' style={styles.sidebar}>
			<div style={styles.content}>
				<a
					style={(styles.sidebarLink, { cursor: 'pointer' })}
					onClick={() =>
						history.push({
							pathname: '/dashboard',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<FontAwesomeIcon icon='home' size='1x' />
					&ensp; {strings.Dashboard}
				</a>
				<br></br>
				<br></br>
				<a
					style={(styles.sidebarLink, { cursor: 'pointer' })}
					onClick={() =>
						history.push({
							pathname: '/calendar',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<FontAwesomeIcon icon='calendar-alt' size='1x' />
					&ensp; {strings.Calendar}
				</a>
				<br></br>
				<br></br>
				<a
					style={(styles.sidebarLink, { cursor: 'pointer' })}
					onClick={() =>
						history.push({
							pathname: '/analytics',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<FontAwesomeIcon icon='chart-line' size='1x' />
					&ensp; {strings.Analytics}
				</a>
				<br></br>
				<br></br>
				<a
					style={(styles.sidebarLink, { cursor: 'pointer' })}
					onClick={() =>
						history.push({
							pathname: '/dispatch',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<FontAwesomeIcon icon='broadcast-tower' size='1x' />
					&ensp; {strings.Dispatch}
				</a>
				<br></br>
				<br></br>
				<a
					style={(styles.sidebarLink, { cursor: 'pointer' })}
					onClick={() =>
						history.push({
							pathname: '/editprofile',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<FontAwesomeIcon icon='user' size='1x' />
					&ensp; {strings.Profile}
				</a>
				<div style={styles.divider} />

				<a
					style={(styles.logout, { cursor: 'pointer' })}
					onClick={async() => {
						await FirebaseFunctions.logOut();
						history.push({
							pathname: '/',
						});
					}
					}>
					<FontAwesomeIcon icon='sign-out-alt' size='1x' />
					&ensp; {strings.LogOut}
				</a>
			</div>
		</SideMenuTitle>
	);
}
