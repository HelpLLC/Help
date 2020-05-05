//This page will display the terms and conditions that must be accepted by every single that uses help
//This will be navigated to from the sign up screens or the settings screen.
import React, { Component } from 'react';
import { Text, ScrollView, Dimensions } from 'react-native';
import colors from 'config/colors';
import FirebaseFunctions from 'config/FirebaseFunctions';
import HelpView from '../components/HelpView';
import screenStyle from '../../config/styles/screenStyle';
import { screenWidth, screenHeight } from 'config/dimensions';
import TopBanner from '../components/TopBanner/TopBanner';
import strings from 'config/strings';
import fontStyles from 'config/styles/fontStyles';

export default class termsAndConditionsScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('TermsAndConditionsScreen', 'termsAndConditionsScreen');
	}

	//Renders the screen
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.TermsAndConditions}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView
					style={{ flex: 1, backgroundColor: colors.lightGray }}
					contentContainerStyle={{
						paddingVertical: screenHeight * 0.02,
						marginHorizontal: screenWidth * 0.02
					}}>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Welcome to Help</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						These terms and conditions outline the rules and regulations for the use of Help's
						app.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>Help is located at:</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>13543 NE 200th St Woodinville 98072 - WA , United States</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						By accessing this app we assume you accept these terms and conditions in full. Do
						not continue to use Help's app if you do not accept all of the terms and conditions
						stated on this page.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						The following terminology applies to these Terms and Conditions, Privacy Statement and
						Disclaimer Notice and any or all Agreements: "Client", "You" and "Your" refers to you,
						the person accessing this app and accepting the Company's terms and conditions. "The
						Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties",
						or "Us", refers to both the Client and ourselves, or either the Client or ourselves. All
						terms refer to the offer, acceptance and consideration of payment necessary to undertake
						the process of our assistance to the Client in the most appropriate manner, whether by
						formal meetings of a fixed duration, or any other means, for the express purpose of
						meeting the Client's needs in respect of provision of the Company's stated
						services/products, in accordance with and subject to, prevailing law of United States.
						Any use of the above terminology or other words in the singular, plural, capitalisation
						and/or he/she or they, are taken as interchangeable and therefore as referring to same.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Most of the modern day interactive web sites use cookies to enable us to retrieve user
						details for each visit. Cookies are used in some areas of our site to enable the
						functionality of this area and ease of use for those people visiting. Some of our
						affiliate / advertising partners may also use cookies.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>License</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Unless otherwise stated, Help and/or it's licensors own the intellectual property rights
						for all material on Help. All intellectual property rights are reserved. You may view
						and/or print pages from https://helpcocontact.wixsite.com/mysite for your own personal
						use subject to restrictions set in these terms and conditions.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>You must not:</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>Republish material from https://helpcocontact.wixsite.com/mysite</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Sell, rent or sub-license material from https://helpcocontact.wixsite.com/mysite
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Reproduce, duplicate or copy material from https://helpcocontact.wixsite.com/mysite
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Redistribute content from Help (unless content is specifically made for redistribution).
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Hyperlinking to our Content</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						The following organizations may link to our Web site without prior written approval:
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>Government agencies;</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>Search engines;</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>News organizations;</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
							Online directory distributors when they list us in the directory may link to our Web
							site in the same manner as they hyperlink to the Web sites of other listed businesses;
							and
						</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
							Systemwide Accredited Businesses except soliciting non-profit organizations, charity
							shopping malls, and charity fundraising groups which may not hyperlink to our Web
							site.
						</Text>
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						These organizations may link to our home page, to publications or to other Web site
						information so long as the link: (a) is not in any way misleading; (b) does not falsely
						imply sponsorship, endorsement or approval of the linking party and its products or
						services; and (c) fits within the context of the linking party's site.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						We may consider and approve in our sole discretion other link requests from the
						following types of organizations:
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
							commonly-known consumer and/or business information sources such as Chambers of
							Commerce, American Automobile Association, AARP and Consumers Union;
						</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>dot.com community sites;</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
							associations or other groups representing charities, including charity giving sites,
						</Text>{' '}
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>online directory distributors;</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>internet portals;</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
							accounting, law and consulting firms whose primary clients are businesses; and
						</Text>
						<Text style={[fontStyles.subTextStyle, fontStyles.black]}>educational institutions and trade associations.</Text>
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						We will approve link requests from these organizations if we determine that: (a) the
						link would not reflect unfavorably on us or our accredited businesses (for example,
						trade associations or other organizations representing inherently suspect types of
						business, such as work-at-home opportunities, shall not be allowed to link); (b)the
						organization does not have an unsatisfactory record with us; (c) the benefit to us from
						the visibility associated with the hyperlink outweighs the absence of Help and (d) where
						the link is in the context of general resource information or is otherwise consistent
						with editorial content in a newsletter or similar product furthering the mission of the
						organization.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						These organizations may link to our home page, to publications or to other Web site
						information so long as the link: (a) is not in any way misleading; (b) does not falsely
						imply sponsorship, endorsement or approval of the linking party and it products or
						services; and (c) fits within the context of the linking party's site.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						If you are among the organizations listed in paragraph 2 above and are interested in
						linking to our app, you must notify us by sending an e-mail to
						helpcocontact@gmail.com. Please include your name, your organization name, contact
						information (such as a phone number and/or e-mail address) as well as the URL of your
						site, a list of any URLs from which you intend to link to our Web site, and a list of
						the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>Approved organizations may hyperlink to our Web site as follows:</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>By use of our corporate name; or</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						By use of any other description of our Web site or material being linked to that makes
						sense within the context and format of content on the linking party's site.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						No use of Help's logo or other artwork will be allowed for linking absent a trademark
						license agreement.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Iframes</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Without prior approval and express written permission, you may not create frames around
						our Web pages or use other techniques that alter in any way the visual presentation or
						appearance of our Web site.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Reservation of Rights</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						We reserve the right at any time and in its sole discretion to request that you remove
						all links or any particular link to our Web site. You agree to immediately remove all
						links to our Web site upon such request. We also reserve the right to amend these terms
						and conditions and its linking policy at any time. By continuing to link to our Web
						site, you agree to be bound to and abide by these linking terms and conditions.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Removal of links from our app</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						If you find any link on our Web site or any linked web site objectionable for any
						reason, you may contact us about this. We will consider requests to remove links but
						will have no obligation to do so or to respond directly to you.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Whilst we endeavour to ensure that the information on this app is correct, we do not
						warrant its completeness or accuracy; nor do we commit to ensuring that the app
						remains available or that the material on the app is kept up to date.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Content Liability</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						We shall have no responsibility or liability for any content appearing on your Web site.
						You agree to indemnify and defend us against all claims arising out of or based upon
						your app. No link(s) may appear on any page on your Web site or within any context
						containing content or materials that may be interpreted as libelous, obscene or
						criminal, or which infringes, otherwise violates, or advocates the infringement or other
						violation of, any third party rights.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Disclaimer</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						To the maximum extent permitted by applicable law, we exclude all representations,
						warranties and conditions relating to our app and the use of this app
						(including, without limitation, any warranties implied by law in respect of satisfactory
						quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in
						this disclaimer will:
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						limit or exclude our or your liability for death or personal injury resulting from
						negligence;
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						limit or exclude our or your liability for fraud or fraudulent misrepresentation;
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						limit any of our or your liabilities in any way that is not permitted under applicable
						law; or
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						exclude any of our or your liabilities that may not be excluded under applicable law.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						The limitations and exclusions of liability set out in this Section and elsewhere in
						this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all
						liabilities arising under the disclaimer or in relation to the subject matter of this
						disclaimer, including liabilities arising in contract, in tort (including negligence)
						and for breach of statutory duty.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						To the extent that the app and the information and services on the app are
						provided free of charge, we will not be liable for any loss or damage of any nature.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Content Safety</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Help does not in any way condone or tolerate the usage of inappropriate or abusive
						imagery or text within the app. Any account who is associated with this type of material
						will be suspended from any further usage of Help &amp; will have to appeal to the Help
						organization in order to re instantiate the account.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						This Terms and conditions page was created at generator. If you have any queries
						regarding any of our terms, please contact us.
					</Text>
				</ScrollView>
			</HelpView>
		);
	}
}
