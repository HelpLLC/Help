import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import strings from '../../config/strings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SideMenuContainer from './SideMenuContainer';
import FirebaseFunctions from '../../config/FirebaseFunctions';

const styles = SideMenuContainer;

export default function SideMenuCard(props) {
	SideMenuCard.propTypes = {
		title: PropTypes.string.isRequired,
	};

	const { title } = props;

	const history = useHistory();

	const logout = async () => {
		FirebaseFunctions.logOut();
		history.push({
			pathname: '/',
		});
	};

	return (
		<div style={styles.sidebar}>
			<text style={styles.header}>{title}</text>
			<div style={styles.content}>
				<a
					style={{ cursor: 'pointer' }}
					onClick={() =>
						history.push({
							pathname: '/dashboard',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<div style={styles.contenttext}>
						<FontAwesomeIcon icon='home' size='1x' />
						&ensp; {strings.Dashboard}
					</div>
				</a>
				<br></br>
				<br></br>
				<a
					style={{ cursor: 'pointer' }}
					onClick={() =>
						history.push({
							pathname: '/calendar',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<div style={styles.contenttext}>
						<FontAwesomeIcon icon='calendar-alt' size='1x' />
						&ensp; {strings.Calendar}
					</div>
				</a>
				<br></br>
				<br></br>
				<a
					style={{ cursor: 'pointer' }}
					onClick={() =>
						history.push({
							pathname: '/analytics',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<div style={styles.contenttext}>
						<FontAwesomeIcon icon='chart-line' size='1x' />
						&ensp; {strings.Analytics}
					</div>
				</a>
				<br></br>
				<br></br>
				<a
					style={{ cursor: 'pointer' }}
					onClick={() =>
						history.push({
							pathname: '/dispatch',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<div style={styles.contenttext}>
						<FontAwesomeIcon icon='broadcast-tower' size='1x' />
						&ensp; {strings.Dispatch}
					</div>
				</a>
				<br></br>
				<br></br>
				<a
					style={{ cursor: 'pointer' }}
					onClick={() =>
						history.push({
							pathname: '/editprofile',
							state: { businessID: 'zjCzqSiCpNQELwU3ETtGBANz7hY2' },
						})
					}>
					<div style={styles.contenttext}>
						<FontAwesomeIcon icon='user' size='1x' />
						&ensp; {strings.Profile}
					</div>
				</a>
				<div style={styles.divider} />

				<a style={(styles.logout, { cursor: 'pointer' })} onClick={logout}>
					<div style={styles.logout}>
						<FontAwesomeIcon icon='sign-out-alt' size='1x' />
						&ensp; {strings.LogOut}
					</div>
				</a>
			</div>
		</div>
	);
}
