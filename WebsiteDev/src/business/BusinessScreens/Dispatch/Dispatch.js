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
import SideMenuCard from '../../../components/SideMenu/SideMenuCard';
import DropdownHeader from '../../../components/DropdownHeader/DropdownHeader';
import '../../../config/fontStyles.css';
import HelpAlert from '../../../components/HelpAlert/HelpAlert';
import strings from '../../../config/strings';
import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
import profile_pic from './profile_pic.png'; // Tell webpack this JS file uses this image
import EmployeeListItem from '../../../components/EmployeeListItem/EmployeeListItem';
import fontStyles from '../../../config/fontStyles';
import {
	FacebookShareButton,
	FacebookMessengerShareButton,
	FacebookMessengerIcon,
	LinkedinShareButton,
	TwitterShareButton,
	TelegramShareButton,
	WhatsappShareButton,
	RedditShareButton,
	EmailShareButton,
	TumblrShareButton,
	FacebookIcon,
	TwitterIcon,
	LinkedinIcon,
	TelegramIcon,
	WhatsappIcon,
	RedditIcon,
	TumblrIcon,
	EmailIcon,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import colors from '../../../config/colors';

export default function Dispatch(props) {
	const [business, setBusiness] = React.useState();
	const [businessName, setBusinessName] = React.useState();
	const [services, setServices] = React.useState();
	const [loaded, setLoaded] = React.useState(false);
	const [image, setImage] = React.useState('');
	const [clicked, isClicked] = React.useState(false);
	const [employeeCode, setEmployeeCode] = React.useState('');
	const location = useLocation();
	const [search, setSearch] = React.useState('');

	const componentDidMount = async () => {
		const business = await FirebaseFunctions.call('getBusinessByID', {
			businessID,
		});
		setBusiness(business);
		setBusinessName(business.businessName);
		setServices(business.services);
		setEmployeeCode(business.employeeCode);
		setLoaded(true);
	};
	const shareUrl = 'https://helptechnologies.net';
	const title =
		strings.GreetingMessageFirstPart +
		' ' +
		businessName +
		' ' +
		strings.GreetingMessageSecondPart +
		' ' +
		employeeCode;

	if (loaded === false) {
		componentDidMount();
	}

	return (
		<div className='dispatchContainer'>
			<section className='dropdownheader'>
				<DropdownHeader
					businessID={business}
					businessName={businessName}
					modalClassName='modal'
					divClassName='toprightcontainer'
				/>
			</section>
			<section className='toprightbutton'>
				<div
					className='invitediv darkBlue smallTextStyle bold'
					style={{ cursor: 'pointer' }}
					onClick={() => isClicked(true)}>
					{strings.InviteEmployees}
				</div>
			</section>
			<section className='sidebarHolder'>
				<SideMenuCard title='Help' />
			</section>
			<section className='dispatchHolder'>
				<div className='dispatchTitleContainer'>
					<text className='darkGreen bold bigTextStyle'>{strings.Dispatch}</text>
				</div>

				<div className='searchBar'>
					<HelpTextInput
						height={'5vh'}
						width={'45vw'}
						isMultiline={false}
						onChangeText={() => setSearch(search)}
						additionalIcon={
							<FontAwesomeIcon
								icon={['fas', 'search']}
								size='1x'
								style={{ padding: 10, position: 'absolute' }}
							/>
						}></HelpTextInput>
				</div>

				<div className='infoPart'>
					<div>
						<EmployeeListItem
							name='John Doe'
							buttonText='View More'
							buttonWidth={'15vw'}
							style={{marginVertical: '3vh'}}
							image={profile_pic}
						/>
						<EmployeeListItem
							name='Anne Ketcheva'
							buttonText='View More'
							buttonWidth={'15vw'}
							image={profile_pic}
						/>
						<EmployeeListItem
							name='Tricia Cebotari'
							buttonText='View More'
							buttonWidth={'15vw'}
							image={profile_pic}
						/>
						<EmployeeListItem
							name='John Doe'
							buttonText='View More'
							buttonWidth={'15vw'}
							image={profile_pic}
						/>
					</div>
          <div className="timeOffReq">
						<div className={'mainTextStyle darkBlue bold unconfirmedTitle'}>
							{strings.TimeOffRequests}
						</div>
            <div className='cardContainer'>
									<div className='unconfirmedInfoCard'>
									<div className='unconfirmedText'>
										<div className={'darkBlue bold mainTextStyle'}>{'Name'}</div>
										<div className={'darkBlue bold smallTextStyle'}>{'Date'}</div>
										<div className={'darkBlue bold smallTextStyle'}>
											{'START'} - {'END'}
										</div>
										</div>
                    <div className="approveButtons">
                      <div className="statusButton">
										<HelpButton
											title={strings.Approve}
											fontStyle={{
												...fontStyles.subTextStyle,
												...fontStyles.white,
												...fontStyles.bold,
											}}
											height={'5vh'}
											width={'8vw'}
											onPress={() => {
											}}
										/>
                    </div>
                      <div className="statusButton">
                    <HelpButton
											title={strings.Deny}
											fontStyle={{
												...fontStyles.subTextStyle,
												...fontStyles.white,
												...fontStyles.bold,
                      }}
											height={'5vh'}
											width={'8vw'}
											onPress={() => {
											}}
										/>
                    </div>
                    </div>
									</div>
								</div>
          </div>
				</div>
			</section>
			<HelpAlert
				isVisible={clicked}
				onClose={() => isClicked(false)}
				titleText={
					<div>
						<p className='smallerBigTextStyle darkeBlue bold'>{strings.JoinCodeForEmployees}</p>
						<div className='codeSquares bigTextStyle bold darkBlue'>
							<p className='codeSquaresNum'>{employeeCode.charAt(0)}</p>
							<p className='codeSquaresNum'>{employeeCode.charAt(1)}</p>
							<p className='codeSquaresNum'>{employeeCode.charAt(2)}</p>
							<p className='codeSquaresNum'>{employeeCode.charAt(3)}</p>
							<p className='codeSquaresNum'>{employeeCode.charAt(4)}</p>
						</div>
						<p className='subTextStyle darkBlue bold messageText'>{strings.ShareTheCode}</p>
					</div>
				}
				messageText={
					<div className='messageContent'>
						<div className='sharingIcons'>
							<TwitterShareButton url={shareUrl} title={title}>
								<TwitterIcon className='twitterIcon' size={50} round={true} />
							</TwitterShareButton>
							<EmailShareButton url={shareUrl} subject={title} body='body'>
								<EmailIcon className='emailIcon' size={50} round={true} />
							</EmailShareButton>
							<FacebookShareButton url={shareUrl} quote={title}>
								<FacebookIcon className='facebookIcon' size={50} round={true} />
							</FacebookShareButton>
							<FacebookMessengerShareButton url={shareUrl} appId='521270401588372'>
								<FacebookMessengerIcon className='facebookMessengerIcon' size={50} round={true} />
							</FacebookMessengerShareButton>
							<LinkedinShareButton url={shareUrl}>
								<LinkedinIcon className='linkedinIcon' size={50} round={true} />
							</LinkedinShareButton>
							<RedditShareButton url={shareUrl} title={title} windowWidth={660} windowHeight={460}>
								<RedditIcon className='redditIcon' size={50} round={true} />
							</RedditShareButton>
							<TelegramShareButton url={shareUrl} title={title}>
								<TelegramIcon className='telegramIcon' size={50} round={true} />
							</TelegramShareButton>
							<WhatsappShareButton url={shareUrl} title={title} separator=':: '>
								<WhatsappIcon className='whatsappIcon' size={50} round={true} />
							</WhatsappShareButton>
							<TumblrShareButton url={shareUrl} title={title}>
								<TumblrIcon className='tumblrIcon' size={50} round={true} />
							</TumblrShareButton>
							<CopyToClipboard text={employeeCode}>
								<div className='clipboard' style={{ cursor: 'pointer' }}>
									<FontAwesomeIcon icon='copy' size='2x' style={{ color: colors.darkBlue }} />
								</div>
							</CopyToClipboard>
						</div>
					</div>
				}
			/>
		</div>
	);
}
