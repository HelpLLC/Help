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

export default class privacyScreen extends Component {
	componentDidMount() {
		FirebaseFunctions.setCurrentScreen('PrivacyScreen', 'privacyScreen');
	}

	//Renders the screen
	render() {
		return (
			<HelpView style={screenStyle.container}>
				<TopBanner
					title={strings.PrivacyPolicyString}
					leftIconName='angle-left'
					leftOnPress={() => this.props.navigation.goBack()}
				/>
				<ScrollView
					style={{ flex: 1, backgroundColor: colors.lightGray }}
					contentContainerStyle={{
						paddingVertical: screenHeight * 0.02,
						marginHorizontal: screenWidth * 0.02
					}}>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>Welcome to our Privacy Policy</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						-- Your privacy is critically important to us.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>Help is located at:</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						Help LLC 13543 NE 200th St Washington, United States 4252299185
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						It is Help LLC's policy to respect your privacy regarding any information we may collect
						while operating our website. This Privacy Policy applies to
						https://helpcocontact.wixsite.com/website (hereinafter, "us", "we", or
						"https://helpcocontact.wixsite.com/website"). We respect your privacy and are committed
						to protecting personally identifiable information you may provide us through the
						Website. We have adopted this privacy policy ("Privacy Policy") to explain what
						information may be collected on our Website, how we use this information, and under what
						circumstances we may disclose the information to third parties. This Privacy Policy
						applies only to information we collect through the Website and does not apply to our
						collection of information from other sources. This Privacy Policy, together with the
						Terms and conditions posted on our Website, set forth the general rules and policies
						governing your use of our Website. Depending on your activities when visiting our
						Website, you may be required to agree to additional terms and conditions.
					</Text>

					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Website Visitors Like most website operators, Help LLC collects
						non-personally-identifying information of the sort that web browsers and servers
						typically make available, such as the browser type, language preference, referring site,
						and the date and time of each visitor request. Help LLC's purpose in collecting non-
						personally identifying information is to better understand how Help LLC's visitors use
						its website. From time to time, Help LLC may release non-personally-identifying
						information in the aggregate, e.g., by publishing a report on trends in the usage of its
						website. Help LLC also collects potentially personally - identifying information like
						Internet Protocol(IP) addresses for logged in users and for users leaving comments on
						https://helpcocontact.wixsite.com/website blog posts. Help LLC only discloses logged in
						user and commenter IP addresses under the same circumstances that it uses and discloses
						personally-identifying information as described below.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Gathering of Personally - Identifying Information Certain visitors to Help LLC's
						websites choose to interact with Help LLC in ways that require Help LLC to gather
						personally-identifying information. The amount and type of information that Help LLC
						gathers depends on the nature of the interaction. For example, we ask visitors who sign
						up for a blog at https://helpcocontact.wixsite.com/website to provide a username and
						email address.
					</Text>
					<Text style={[fontStyles.bigTextStyle, fontStyles.black]}>License</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Security The security of your Personal Information is important to us, but remember
						that no method of transmission over the Internet, or method of electronic storage is 100
						% secure. While we strive to use commercially acceptable means to protect your Personal
						Information, we cannot guarantee its absolute security.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Advertisements Ads appearing on our website may be delivered to users by advertising
						partners, who may set cookies. These cookies allow the ad server to recognize your
						computer each time they send you an online advertisement to compile information about
						you or others who use your computer. This information allows ad networks to, among other
						things, deliver targeted advertisements that they believe will be of most interest to
						you. This Privacy Policy covers the use of cookies by Help LLC and does not cover the
						use of cookies by any advertisers.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Links To External Sites Our Service may contain links to external sites that are not
						operated by us. If you click on a third party link, you will be directed to that third
						party's site. We strongly advise you to review the Privacy Policy and terms and
						conditions of every site you visit. 'We have no control over, and assume no
						responsibility for the content, privacy policies or practices of any third party sites,
						products or services.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Aggregated Statistics 'Help LLC may collect statistics about the behavior of visitors
						to its website.Help LLC may display this information publicly or provide it to others.
						However, Help LLC does not disclose your personally - identifying information.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Cookies To enrich and perfect your online experience, Help LLC uses "Cookies", similar
						technologies and services provided by others to display personalized content,
						appropriate advertising and store your preferences on your computer. A cookie is a
						string of information that a website stores on a visitor's computer, and that the
						visitor's browser provides to the website each time the visitor returns .Help LLC uses
						cookies to help Help LLC identify and track visitors, their usage of
						https://helpcocontact.wixsite.com/website, and their website access preferences. Help
						LLC visitors who do not wish to have cookies placed on their computers should set their
						browsers to refuse cookies before using Help LLC's websites, with the drawback that
						certain features of Help LLC's websites may not function properly without the aid of
						cookies. By continuing to navigate our website without changing your cookie settings,
						you hereby acknowledge and agree to Help LLC's use of cookies.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Privacy Policy Changes Although most changes are likely to be minor, Help LLC may
						change its Privacy Policy from time to time, and in Help LLC's sole discretion. Help LLC
						encourages visitors to frequently check this page for any changes to its Privacy Policy.
						Your continued use of this site after any change in this Privacy Policy will constitute
						your acceptance of such change.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Email Addresses Collected email addresses in order to create account information from
						customers.
					</Text>
					<Text style={[fontStyles.subTextStyle, fontStyles.black]}>
						- Credit and Contact Information This privacy policy was created at
						https://termsandconditionstemplate.com/privacy-policy-generator. If you have any
						questions about this Privacy Policy, please contact us via email or phone.
					</Text>
				</ScrollView>
			</HelpView>
		);
	}
}
