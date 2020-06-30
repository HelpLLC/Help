// This screen will be the one where users will be displayed with some information about Help and what we do, then
// they will be able to stay notified to know when the app will be released by subscribing to a newsletter
import React, { useState } from 'react';
import './ComingSoon.css';
import HelpLogo from '../assets/Logo1PNG.png';
import strings from '../config/strings';
import '../config/fontStyles.css';
import HelpTextInput from '../components/HelpTextInput/HelpTextInput';
import HelpButton from '../components/HelpButton/HelpButton';
import HelpAlert from '../components/HelpAlert/HelpAlert';
import { SocialIcon } from 'react-social-icons';
import FeatureCard from '../components/FeatureCard/FeatureCard';
import { addSubscriber } from '../config/FirebaseFunctions';

// Creates the functional component
const ComingSoon = (props) => {
  // The state fields for the screen
  const [emailAddress, setEmailAddress] = useState('');
  const [emailAdded, setEmailAdded] = useState(false);

  // This method will subscribe the user by simply add their email to a collection in Firebase
  const notifyMe = async () => {
    addSubscriber(emailAddress);
    setEmailAdded(true);
    setEmailAddress('');
  };

  // Renders the component
  return (
    <div className='container'>
      <div className={'gradientContainer'}>
        <img alt={'Help - Get Things Done Logo'} src={HelpLogo} className={'helpLogo'} />
        <div className={'bigTextStyle white bold'}>{strings.WeAreComingSoon}</div>
        <div className={'textSpacer'} />
        <div className={'subTextStyle white'}>{strings.HelpComingSoonMessage}</div>
        <div className={'textSpacer'} />
        <div className={'mainTextStyle white'}>{strings.SubscribeMessage}</div>
        <div className={'subscribeRow'}>
          <HelpTextInput
            height={'8vh'}
            width={'30vw'}
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
            fontStyle={'mainTextStyle blue bold'}
            width={'15vw'}
            height={'8vh'}
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
            <text className='bigSubTitleTextStyle blue'>{strings.WhatWeDoBest}</text>
          </div>
          <div className='featureRow'>
            <FeatureCard
              icon={'calendar-alt'}
              title={strings.SmartScheduling}
              text={strings.SmartSchedulingText}
            />
            <FeatureCard
              icon={'chart-bar'}
              title={strings.AdvancedAnalytics}
              text={strings.AdvancedAnalyticsText}
            />
            <FeatureCard
              icon={'dollar-sign'}
              title={strings.CentralizedPayments}
              text={strings.PaymentsText}
            />
            <FeatureCard
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
export default ComingSoon;
