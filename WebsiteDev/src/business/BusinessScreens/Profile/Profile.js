import React, { Component } from 'react';
import './Profile.css';
import Header from '../Header/Header';
import '../Header/Header.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import BusinessServiceCard from '../../../components/BusinessServiceCard/BusinessServiceCard';
import { useLocation, Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import '../../../config/fontStyles.css';
import HelpButton from '../../../components/HelpButton/HelpButton';
import UpcomingRequests from '../../../components/UpcomingRequests/UpcomingRequests';
import SideMenu from '../../../components/SideMenu/SideMenu';

export default function Profile(props) {
	const [business, setBusiness] = React.useState();
	const [services, setServices] = React.useState();
	const [loaded, setLoaded] = React.useState(false);
	const [image, setImage] = React.useState('');
	const location = useLocation();

	// const componentDidMount = async () => {
	// 	const businessID = location.state.businessID;
	// 	const business = await FirebaseFunctions.call('getBusinessByID', {
	// 		businessID,
	// 	});
	// 	setBusiness(business);
	// 	setServices(business.services);
	// 	setLoaded(true);
	// };

	// if (loaded === false) {
	// 	componentDidMount();
	// }

	return (
		<div className='profileContainer'>
			<section className='sidebarHolder'>
				<SideMenu title='Profile' />
			</section>
			<section className='profileHolder'>
				<div className='profileTitleContainer'>
					<text className='darkGreen bold bigTextStyle'>Profile</text>
				</div>
			</section>
		</div>
	);
}
