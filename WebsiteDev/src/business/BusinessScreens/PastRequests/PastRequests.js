import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './PastRequests.css';
import ServiceHistoryCard from '../../../components/ServiceHistoryCard/ServiceHistoryCard';
import SideMenu from '../../../components/SideMenu/SideMenu';
import '../../../config/fontStyles.css';
import './PastRequests.css';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import strings from '../../../config/strings';

export default function PastRequests(props) {
	let history = useHistory();
	const [service, setService] = useState();
	const [serviceID, setServiceID] = useState();
	const [completedRequests, setCompletedRequests] = useState();

	useEffect(async () => {
		const { serviceID, service } = this.props.navigation.state.params;
		const completedRequests = await FirebaseFunctions.call('getCompletedRequestsByServiceID', {
			serviceID,
		});
		setCompletedRequests(completedRequests);
		setService(service);
		setServiceID(serviceID);
	}, []);

	const Item = (props) => {
		return <li>{props.value}</li>;
	};

	return (
		<div className='container'>
			<div className='sidebarHolder'>
				<SideMenu />
			</div>
			<div className='pageContent'>
				<div className='title bigTextStyle darkBlue'>
					<text>{strings.PastServicesRequests}</text>
				</div>
				<ul>
					{completedRequests.map((item) => (
						<li>
							<ServiceHistoryCard
								image={async () => {
									//Passes the function to get the profile picture of the user
									//Passes in the function to retrieve the image of this requester
									return await FirebaseFunctions.call('getProfilePictureByID', {
										customerID: item.customerID,
									});
								}}
								service={service.serviceTitle}
								name={item.customerName}
								total={item.billedAmount}
								paymentStatus={item.paymentStatus}
								completedDate={item.date}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
