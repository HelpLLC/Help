import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './LandingPage.css';
import fontStyles from '../../../config/fontStyles';
import strings from '../../../config/strings';
import LandingPage from './LandingPage';
import LoginRegister from '../Authentication/LoginRegister';
import Dashboard from '../../../business/BusinessScreens/Dashboard/Dashboard';
import { SocialIcon } from 'react-social-icons';
import PrivacyPolicy from '../../PrivacyPolicy.js';
import Credits from '../../Credits.js';
import ContactUs from '../ContactUs/ContactUs';
import TermsAndConditions from '../../TermsAndConditions.js';
import CreateProductScreen from '../../BusinessScreens/CreateProduct/CreateProductScreen'

export default function LandingPageNavigator() {
	//The header containing the title, log in, and sign up buttons
	const header = (
		<div className={'header'}>
			<div className={'companyTitle'}>
				<Link style={{ ...fontStyles.bigTextStyleBlue, textDecoration: 'none' }} to={'/'}>
					{strings.HelpForBusiness}
				</Link>
			</div>
			<div className={'logInSignUp'}>
				<div className={'logIn'}>
					<Link style={{ ...fontStyles.bigTextStyleBlue, textDecoration: 'none' }} to={'/login'}>
						{strings.LogIn}
					</Link>
				</div>
				<div className={'signUp'}>
					<Link style={{ ...fontStyles.bigTextStyleBlue, textDecoration: 'none' }} to={'/signUp'}>
						{strings.SignUp}
					</Link>
				</div>
				<div className={'contactUs'}>
					<Link style={{ ...fontStyles.bigTextStyleBlue, textDecoration: 'none' }} to={'/contactus'}>
						{strings.ContactUs}
					</Link>
				</div>
			</div>
		</div>
	);

  //The footer conataining the privacy policy, credits, and terms and conditions buttons. Also contains Help contact information
  const footer = (
    <div className={"footer"}>
      <div className={"contactUs"}>
        <div style={fontStyles.bigTextStyleBlack}>{strings.ContactUs}</div>
        <div style={fontStyles.subTextStyleBlack}>{strings.HelpEmail}</div>
        <div style={fontStyles.subTextStyleBlack}>
          {strings.HelpPhoneNumber}
        </div>
        <div style={fontStyles.subTextStyleBlack}>{strings.HelpAddress}</div>
        <div style={fontStyles.subTextStyleBlack}>{strings.HelpCity}</div>
      </div>
      <div className={"joinHelpFamily"}>
        <div style={fontStyles.bigTextStyleBlack}>{strings.JoinHelpFamily}</div>
        <div className={"socialMedia"}>
          <SocialIcon url={"https://twitter.com/llc_help"} />
          <SocialIcon url={"https://www.instagram.com/realhelpllc/"} />
          <SocialIcon url={"https://www.facebook.com/realhelpllc/"} />
          <SocialIcon url={"https://www.linkedin.com/company/helpllc/"} />
        </div>
      </div>
      <div className={"legal"}>
        <div style={fontStyles.bigTextStyleBlack}>{strings.Legal}</div>
        <div>
          <Link
            style={{ ...fontStyles.subTextStyleBlack, textDecoration: "none" }}
            to={"/privacypolicy"}
          >
            {strings.PrivacyPolicy}
          </Link>
        </div>
        <div>
          <Link
            style={{ ...fontStyles.subTextStyleBlack, textDecoration: "none" }}
            to={"/terms"}
          >
            {strings.TermsAndConditions}
          </Link>
        </div>
        <div>
          <Link
            style={{ ...fontStyles.subTextStyleBlack, textDecoration: "none" }}
            to={"/credits"}
          >
            {strings.Credits}
          </Link>
        </div>
        <div style={fontStyles.subTextStyleBlack}>
          &copy;{strings.Copyright}
        </div>
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
					<LoginRegister login={true} />
				</Route>
				<Route path='/signUp'>
					<LoginRegister login={false} />
				</Route>
				<Route path='/dashboard'>
					<Dashboard />
				</Route>
				<Route path='/createproduct'>
					<CreateProductScreen/>
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
