// This screen will be the one where users will be displayed with some information about Help and what we do, then
// they will be able to stay notified to know when the app will be released by subscribing to a newsletter
import React, { useState, useEffect } from 'react';
import './ComingSoonMobile.css';
import HelpLogo from '../assets/Logo1PNG.png';
import strings from '../config/strings';
import '../config/fontStyles.css';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import HelpButton from '../components/HelpButton/HelpButton';
import HelpAlert from '../components/HelpAlert/HelpAlert';
import { SocialIcon } from 'react-social-icons';
import FeatureCardMobile from '../components/FeatureCardMobile/FeatureCardMobile';
import { useOrientation } from 'react-use';
import { addSubscriber } from '../config/FirebaseFunctions';

// Creates the functional component
const ComingSoonMobile = (props) => {
  // The state fields for the screen
  const [emailAddress, setEmailAddress] = useState('');
  const [emailAdded, setEmailAdded] = useState(false);
  const orientation = useOrientation();

  // This method will subscribe the user by simply add their email to a collection in Firebase
  const notifyMe = async () => {
    addSubscriber(emailAddress);
    setEmailAdded(true);
    setEmailAddress('');
  };

  useEffect(() => {
    addSubscriber(orientation);
  }, [])

  // Renders the component
  return (
    <div className='container'>
      <div className={'gradientContainer'}>
        <img alt={'Help - Get Things Done Logo'} src={HelpLogo} className={'helpLogo'} />
        <div className={'bigTitleTextStyle white bold'}>{strings.WeAreComingSoon}</div>
        <div className={'textSpacer'} />
        <div className={'biggerBigTextStyle white lineSpacer'}>{strings.HelpComingSoonMessage}</div>
        <div className={'textSpacer'} />
        <div className={'biggerBigTextStyle white lineSpacer'}>{strings.SubscribeMessage}</div>
        <div className={'subscribeRow'}>
          <HelpTextInput
            height={'6.5vh'}
            width={'48vw'}
            isMultiline={false}
            placeholder={strings.EmailAddress}
            onChangeText={(text) => setEmailAddress(text)}
            value={emailAddress}
            autoCompleteType='email'
          />
          <HelpButton
            title={strings.NotifyMe}
            isLightButton={true}
            onPress={() => notifyMe()}
            fontStyle={'bigTextStyle blue bold'}
            width={'30vw'}
            height={'6.5vh'}
          />
        </div>
        <div className={'socialMediaRow'}>
          <SocialIcon url={'https://twitter.com/llc_help'} />
          <SocialIcon url={'https://www.instagram.com/realhelpllc/'} />
          <SocialIcon url={'https://www.facebook.com/realhelpllc/'} />
          <SocialIcon url={'https://www.linkedin.com/company/helpllc/'} />
        </div>
      </div>
      <div className='whiteConatiner'>
        <section>
          <div className='featureCardTitle'>
            <text className='bigTitleTextStyle darkBlue bold'>{strings.OurServices}</text>
          </div>
          <div className='featureCardTitle'>
            <text className='bigTitleTextStyle blue'>{strings.WhatWeDoBest}</text>
          </div>
          <div className='featureColumn'>
            <FeatureCardMobile
              icon={'calendar-alt'}
              title={strings.SmartScheduling}
              text={strings.SmartSchedulingText}
            />
            <FeatureCardMobile
              icon={'chart-bar'}
              title={strings.AdvancedAnalytics}
              text={strings.AdvancedAnalyticsText}
            />
            <FeatureCardMobile
              icon={'dollar-sign'}
              title={strings.CentralizedPayments}
              text={strings.PaymentsText}
            />
            <FeatureCardMobile
              icon={'users'}
              title={strings.EmployeeManagement}
              text={strings.EmployeeText}
            />
          </div>
        </section>
      </div>
      <HelpAlert
        isVisible={emailAdded}
        onClose={() => setEmailAdded(false)}
        titleText={strings.Great}
        messageText={strings.EmailAddedMessage}
      />
    </div>
  );
};

// Exports the component
export default ComingSoonMobile;
