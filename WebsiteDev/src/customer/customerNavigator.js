import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';
import SideMenu from "../components/customerSideMenu/customerSideMenu";
import BusinessViewScreen from "./Dashboard/businessViewScreen/businessViewScreen";
import RequestServiseScreen from './Dashboard/requestServiceScreen/requestServiceScreen';

const body = {
    height: '100%',
    width: '85%',
    boxSizing: "border-box",
    flexDirection: "row",
    margin: 0,
    border: 0
};
const flexBox = {
    height: '100%',
    width: '100%',
    flexDirection: "row",
    display: "flex",
}
export default () => {
	return (
		<BrowserRouter>
			<Switch>
				{/* <Route exact path='/'>
					<div className={'bodyOuter'}>
						<div className={'bodyInner'}>
							{header}
							<LandingPage />
						</div>
						{footer}
					</div>
				</Route> */}
				<Route path='/business' >
                    <div style={flexBox}>
                        <SideMenu selected={0}/>
                        <BusinessViewScreen />
                    </div>
				</Route>
				<Route path='/requestservice'>
                    <div style={flexBox}>
                        <SideMenu selected={0}/>
                        <RequestServiseScreen />
                    </div>
				</Route>
			</Switch>
		</BrowserRouter>
	);
}
