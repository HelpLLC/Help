import React, { Component } from 'react';
import './Dispatch.css';
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

export default function Dispatch(props) {
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
		<div className='dispatchContainer'>
			<section className='sidebarHolder'>
				<SideMenu title='Dispatch' />
			</section>
			<section className='dispatchHolder'>
				<div className='dispatchTitleContainer'>
					<text className='darkGreen bold bigTextStyle'>Dispatch</text>
				</div>
			</section>
		</div>
	);
}
