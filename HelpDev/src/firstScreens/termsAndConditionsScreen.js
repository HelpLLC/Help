//This page will display the terms and conditions that must be accepted by every single that uses help
//This will be navigated to from the sign up screens or the settings screen.
import React, { Component } from 'react';
import { Text, ScrollView } from 'react-native';
import HelpView from '../components/HelpView';
import screenStyle from 'config/styles/screenStyle';

export default class termsAndConditionsScreen extends Component {
    //Renders the screen
    render() {
        return (
            <HelpView style={screenStyle.container}>
                <ScrollView style={{ flex: 1 }}>
                    <Text>Welcome to Help</Text>
                    <Text>These terms and conditions outline the rules and regulations for the use of Help's Website.</Text> 
                    <Text>Help is located at:</Text> 
                    <Text>13543 NE 200th St Woodinville 98072 - WA , United States
                    </Text>
                    <Text>By accessing this website we assume you accept these terms and conditions in full. Do not continue to use Help's website
          if you do not accept all of the terms and conditions stated on this page.</Text>
                    <Text>The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice
                      and any or all Agreements: "Client", "You" and "Your" refers to you, the person accessing this website
                      and accepting the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers
                      to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves, or either the Client
                      or ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake
                      the process of our assistance to the Client in the most appropriate manner, whether by formal meetings
                      of a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect
                      of provision of the Company's stated services/products, in accordance with and subject to, prevailing law
                      of United States. Any use of the above terminology or other words in the singular, plural,
          capitalisation and/or he/she or they, are taken as interchangeable and therefore as referring to same.</Text><Text>Cookies</Text>
                    <Text>We employ the use of cookies. By using Help's website you consent to the use of cookies
          in accordance with Help's privacy policy.</Text><Text>Most of the modern day interactive web sites
                    use cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site
                    to enable the functionality of this area and ease of use for those people visiting. Some of our
          affiliate / advertising partners may also use cookies.</Text><Text>License</Text>
                    <Text>Unless otherwise stated, Help and/or it's licensors own the intellectual property rights for
                      all material on Help. All intellectual property rights are reserved. You may view and/or print
          pages from https://helpcocontact.wixsite.com/mysite for your own personal use subject to restrictions set in these terms and conditions.</Text>
                    <Text>You must not:</Text>
                    
                        <Text>Republish material from https://helpcocontact.wixsite.com/mysite</Text>
                        <Text>Sell, rent or sub-license material from https://helpcocontact.wixsite.com/mysite</Text>
                        <Text>Reproduce, duplicate or copy material from https://helpcocontact.wixsite.com/mysite</Text>
                    
                    <Text>Redistribute content from Help (unless content is specifically made for redistribution).</Text>
                    <Text>Hyperlinking to our Content</Text>
                    
                        <Text>The following organizations may link to our Web site without prior written approval:
            
                                <Text>Government agencies;</Text>
                                <Text>Search engines;</Text>
                                <Text>News organizations;</Text>
                                <Text>Online directory distributors when they list us in the directory may link to our Web site in the same
                manner as they hyperlink to the Web sites of other listed businesses; and</Text>
                                <Text>Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls,
                and charity fundraising groups which may not hyperlink to our Web site.</Text>
                            
                        </Text>
                        <Text>These organizations may link to our home page, to publications or to other Web site information so long
                          as the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or
                          approval of the linking party and its products or services; and (c) fits within the context of the linking
                          party's site.
          </Text>
                        <Text>We may consider and approve in our sole discretion other link requests from the following types of organizations:
            
                                <Text>commonly-known consumer and/or business information sources such as Chambers of Commerce, American
                Automobile Association, AARP and Consumers Union;</Text>
                                <Text>dot.com community sites;</Text>
                                <Text>associations or other groups representing charities, including charity giving sites,</Text>
                                <Text>online directory distributors;</Text>
                                <Text>internet portals;</Text>
                                <Text>accounting, law and consulting firms whose primary clients are businesses; and</Text>
                                <Text>educational institutions and trade associations.</Text>
                            
                        </Text>
                    
                    <Text>We will approve link requests from these organizations if we determine that: (a) the link would not reflect
                      unfavorably on us or our accredited businesses (for example, trade associations or other organizations
                      representing inherently suspect types of business, such as work-at-home opportunities, shall not be allowed
                      to link); (b)the organization does not have an unsatisfactory record with us; (c) the benefit to us from
          the visibility associated with the hyperlink outweighs the absence of Help and (d) where the
                        link is in the context of general resource information or is otherwise consistent with editorial content
          in a newsletter or similar product furthering the mission of the organization.</Text>
                    <Text>These organizations may link to our home page, to publications or to other Web site information so long as
                      the link: (a) is not in any way misleading; (b) does not falsely imply sponsorship, endorsement or approval
                      of the linking party and it products or services; and (c) fits within the context of the linking party's
          site.</Text>
                    <Text>If you are among the organizations listed in paragraph 2 above and are interested in linking to our website,
          you must notify us by sending an e-mail to helpcocontact@gmail.com.
                        Please include your name, your organization name, contact information (such as a phone number and/or e-mail
                        address) as well as the URL of your site, a list of any URLs from which you intend to link to our Web site,
          and a list of the URL(s) on our site to which you would like to link. Allow 2-3 weeks for a response.</Text>
                    <Text>Approved organizations may hyperlink to our Web site as follows:</Text>
                    
                        <Text>By use of our corporate name; or</Text>
                        <Text>By use of the uniform resource locator (Web address) being linked to; or</Text>
                        <Text>By use of any other description of our Web site or material being linked to that makes sense within the
            context and format of content on the linking party's site.</Text>
                    
                    <Text>No use of Help's logo or other artwork will be allowed for linking absent a trademark license
          agreement.</Text>
                    <Text>Iframes</Text>
                    <Text>Without prior approval and express written permission, you may not create frames around our Web pages or
          use other techniques that alter in any way the visual presentation or appearance of our Web site.</Text>
                    <Text>Reservation of Rights</Text>
                    <Text>We reserve the right at any time and in its sole discretion to request that you remove all links or any particular
                      link to our Web site. You agree to immediately remove all links to our Web site upon such request. We also
                      reserve the right to amend these terms and conditions and its linking policy at any time. By continuing
          to link to our Web site, you agree to be bound to and abide by these linking terms and conditions.</Text>
                    <Text>Removal of links from our website</Text>
                    <Text>If you find any link on our Web site or any linked web site objectionable for any reason, you may contact
                      us about this. We will consider requests to remove links but will have no obligation to do so or to respond
          directly to you.</Text>
                    <Text>Whilst we endeavour to ensure that the information on this website is correct, we do not warrant its completeness
                      or accuracy; nor do we commit to ensuring that the website remains available or that the material on the
          website is kept up to date.</Text>
                    <Text>Content Liability</Text>
                    <Text>We shall have no responsibility or liability for any content appearing on your Web site. You agree to indemnify
                      and defend us against all claims arising out of or based upon your Website. No link(s) may appear on any
                      page on your Web site or within any context containing content or materials that may be interpreted as
                      libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or
          other violation of, any third party rights.</Text>
                    <Text>Disclaimer</Text>
                    <Text>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website (including, without limitation, any warranties implied by law in respect of satisfactory quality, fitness for purpose and/or the use of reasonable care and skill). Nothing in this disclaimer will:</Text>
                    
                        <Text>limit or exclude our or your liability for death or personal injury resulting from negligence;</Text>
                        <Text>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</Text>
                        <Text>limit any of our or your liabilities in any way that is not permitted under applicable law; or</Text>
                        <Text>exclude any of our or your liabilities that may not be excluded under applicable law.</Text>
                    
                    <Text>The limitations and exclusions of liability set out in this Section and elsewhere in this disclaimer: (a)
                      are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer or
                      in relation to the subject matter of this disclaimer, including liabilities arising in contract, in tort
          (including negligence) and for breach of statutory duty.</Text>
                    <Text>To the extent that the website and the information and services on the website are provided free of charge,
          we will not be liable for any loss or damage of any nature.</Text>
                    <Text>Content Safety</Text>
                    <Text>Help does not in any way condone or tolerate the usage of inappropriate or abusive imagery or text within the app. Any account who is associated with this type of material will be suspended from any further usage of Help &amp; will have to appeal to the Help organization in order to re instantiate the account.</Text>
                    <Text>This Terms and conditions page was created at generator. If you have
          any queries regarding any of our terms, please contact us.</Text>
          </ScrollView>
            </HelpView>
        )
    }
}