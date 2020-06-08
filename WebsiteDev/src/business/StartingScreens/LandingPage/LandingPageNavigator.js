import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './LandingPage.css';
import '../../../config/fontStyles.css';
import strings from '../../../config/strings';
import LandingPage from './LandingPage';
import Dashboard from '../../../business/BusinessScreens/Dashboard/Dashboard';
import ServiceScreen from '../../BusinessScreens/ServiceScreen/ServiceScreen';
import { SocialIcon } from 'react-social-icons';
import PrivacyPolicy from '../../PrivacyPolicy.js';
import Credits from '../../Credits.js';
import ContactUs from '../ContactUs/ContactUs';
import TermsAndConditions from '../../TermsAndConditions.js';
import CreateProductScreen from '../../BusinessScreens/CreateProductScreen/CreateProductScreen';
import { Login } from '../Authentication/Login/Login';
import { SignUp } from '../Authentication/SignUp/SignUp';
import Analytics from '../../BusinessScreens/Analytics/Analytics'
import EditProfile from '../../BusinessScreens/EditProfile/EditProfile'
import ReactCalendar from '../../BusinessScreens/Calender/Calender';
import Dispatch from '../../BusinessScreens/Dispatch/Dispatch';
import ViewRequest from '../../BusinessScreens/ViewRequest/ViewRequest';

export default function LandingPageNavigator() {
	//The header containing the title, log in, and sign up buttons
	const header = (
		<div className={'landingPageHeader'}>
			<div className={'companyTitle'}>
				<Link className='mainTextStyle blue bold' style={{ textDecoration: 'none' }} to={'/'}>
					{strings.HelpForBusiness}
				</Link>
			</div>
			<div className={'logInSignUp'}>
				<div className={'logIn'}>
					<Link
						className='mainTextStyle blue bold'
						style={{ textDecoration: 'none' }}
						to={'/login'}>
						{strings.LogIn}
					</Link>
				</div>
				<div className={'signUp'}>
					<Link
						className='mainTextStyle blue bold'
						style={{ textDecoration: 'none' }}
						to={'/signUp'}>
						{strings.SignUp}
					</Link>
				</div>
				<div className={'contactUs'}>
					<Link
						className='mainTextStyle blue bold'
						style={{ textDecoration: 'none' }}
						to={'/contactus'}>
						{strings.ContactUs}
					</Link>
				</div>
			</div>
		</div>
	);

	//The footer conataining the privacy policy, credits, and terms and conditions buttons. Also contains Help contact information
	const footer = (
		<div className={'footer'}>
			<div className={'contactUs'}>
				<div className='bigTextStyle black'>{strings.ContactUs}</div>
				<div className='smallTextStyle black'>{strings.HelpEmail}</div>
				<div className='smallTextStyle black'>{strings.HelpPhoneNumber}</div>
				<div className='smallTextStyle black'>{strings.HelpAddress}</div>
				<div className='smallTextStyle black'>{strings.HelpCity}</div>
			</div>
			<div className={'joinHelpFamily'}>
				<div className='bigTextStyle black'>{strings.JoinHelpFamily}</div>
				<div className={'socialMedia'}>
					<SocialIcon url={'https://twitter.com/llc_help'} />
					<SocialIcon url={'https://www.instagram.com/realhelpllc/'} />
					<SocialIcon url={'https://www.facebook.com/realhelpllc/'} />
					<SocialIcon url={'https://www.linkedin.com/company/helpllc/'} />
				</div>
			</div>
			<div className={'legal'}>
				<div className='bigTextStyle black'>{strings.Legal}</div>
				<div>
					<Link
						className='smallTextStyle black'
						style={{ textDecoration: 'none' }}
						to={'/privacypolicy'}>
						{strings.PrivacyPolicy}
					</Link>
				</div>
				<div>
					<Link className='smallTextStyle black' style={{ textDecoration: 'none' }} to={'/terms'}>
						{strings.TermsAndConditions}
					</Link>
				</div>
				<div>
					<Link className='smallTextStyle black' style={{ textDecoration: 'none' }} to={'/credits'}>
						{strings.Credits}
					</Link>
				</div>
				<div className='smallTextStyle black'>&copy;{strings.Copyright}</div>
			</div>
		</div>
	);

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/'>
					<div className={'bodyOuter'}>
						<div className={'bodyInner'}>
							{header}
							<LandingPage />
						</div>
						{footer}
					</div>
				</Route>
				<Route path='/login'>
					<Login login={true} />
				</Route>
				<Route path='/signUp'>
					<SignUp login={false} />
				</Route>
				<Route path='/dashboard'>
					<Dashboard />
				</Route>
				<Route path='/createProductScreen'>
					<CreateProductScreen />
				</Route>
				<Route path='/editprofile'>
					<EditProfile />
				</Route>
				<Route path='/serviceScreen'>
					<ServiceScreen />
				</Route>
				<Route path='/analytics'>
					<Analytics />
				</Route>
				<Route path='/calendar'>
					<ReactCalendar />
				</Route>
				<Route path='/dispatch'>
					<Dispatch />
				</Route>
				<Route path='/viewrequest'>
					<ViewRequest />
				</Route>
				<Route path='/analytics'>
					<Analytics />
				</Route>
				<Route path='/contactus'>
					<div className={'bodyOuter'}>
						<div className={'bodyInner'}>
							{header}
							<ContactUs />
						</div>
						{footer}
					</div>
				</Route>
				<Route path='/privacypolicy'>
					<div className={'bodyOuter'}>
						<div className={'bodyInner'}>
							{header}
							<PrivacyPolicy />
						</div>
						{footer}
					</div>
				</Route>
				<Route path='/terms'>
					<div className={'bodyOuter'}>
						<div className={'bodyInner'}>
							{header}
							<TermsAndConditions />
						</div>
						{footer}
					</div>
				</Route>
				<Route path='/credits'>
					<div className={'bodyOuter'}>
						<div className={'bodyInner'}>
							{header}
							<Credits />
						</div>
						{footer}
					</div>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
