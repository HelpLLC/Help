import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
// import HelpTextInput from '../../../components/HelpTextInput/HelpTextInput';
// import HelpButton from '../../../components/HelpButton/HelpButton';
// import SideMenu from '../../../components/SideMenu/SideMenu';
import './PastRequests.css';
import ServiceHistoryCard from '../../../components/ServiceHistoryCard/ServiceHistoryCard';
import SideMenu from '../../../components/SideMenu/SideMenu';
import '../../../config/fontStyles.css';
import './PastRequests.css';
// import strings from '../../../config/strings';
// import profile_pic from './profile_pic.png'; // Tell webpack this JS file uses this image

export default function PastRequests(props) {
	let history = useHistory();

	return (
      <div className="container"> 
      <div className="sidebarHolder">
      <SideMenu />
      </div>
      <div className="pageContent">
         <div className="title bigTextStyle darkBlue">
            <text>Past Services Requests</text>
         </div>
         <div className="cards">
          <ServiceHistoryCard  />
         </div>
         <div className="cards">
          <ServiceHistoryCard  />
         </div>
         <div className="cards">
          <ServiceHistoryCard  />
         </div>
      </div>
</div>
   );
}
