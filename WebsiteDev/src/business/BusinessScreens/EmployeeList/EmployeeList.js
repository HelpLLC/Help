import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import HelpButton from '../../../components/HelpButton/HelpButton';
import SideMenu from '../../../components/SideMenu/SideMenu';
import EmployeeListItem from '../../../components/EmployeeListItem/EmployeeListItem';
import './EmployeeList.css';
import '../../../config/fontStyles.css';
import strings from '../../../config/strings';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import profile_pic from './profile_pic.png'; // Tell webpack this JS file uses this image
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EmployeeList(props) {
	const [assigned, setAssigned] = useState(false);
	const [confirmed, setConfirmed] = useState(false);
	const [search, setSearch] = useState('');
	let history = useHistory();

	const confirmRequest = async () => {
		const confirm = await FirebaseFunctions.call('confirmRequest', { requestID: requestID });
		// setConfirmed(true);
	};
	const cancelRequest = () => {
		setConfirmed(false);
	};
	const completeRequest = () => {};

	return (
		<div id='container'>
			<SideMenu />
			<div id='background'>
				<div className='content_container'>
					<div className='service_title bigTitleTextStyle darkBlue'>Assign Employee(s)</div>
					<div className='searchBar'>
						<HelpTextInput
							height={'5vh'}
							width={'65vw'}
							placeholder={'Search...'}
							isMultiline={false}
							onChangeText={() => setSearch(search)}
							additionalIcon={
								<FontAwesomeIcon
									icon={['fas', 'search']}
									size='2x'
									style={{ padding: 10, position: 'absolute' }}
								/>
							}></HelpTextInput>
					</div>

					<EmployeeListItem name='John Doe' image={profile_pic} />
					<EmployeeListItem name='Anne Ketcheva' image={profile_pic} />
					<EmployeeListItem name='Tricia Cebotari' image={profile_pic} />

					{confirmed == true ? (
						<div className='confirmedButtons'>
							<HelpButton title={strings.CancelRequest} onPress={cancelRequest} />
							<HelpButton title={strings.CompleteRequest} onPress={completeRequest} />
						</div>
					) : (
						<div className='confirmRequest'>
							<HelpButton width={'65vw'} title={strings.ConfirmRequest} onPress={confirmRequest} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
