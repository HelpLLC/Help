// The main app file which is launched when the site is launched
import React from 'react';
import ComingSoon from './screens/ComingSoon';
import ComingSoonMobile from './screens/ComingSoonMobile';
import { isMobile } from 'react-device-detect';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Loads the FontAwesome components
library.add(fab, fas);

// This creates the functional component
const App = () => {
	// Renders the correct UI based on if it's on mobile or it's on web
	if (isMobile === true) {
		return <ComingSoonMobile />;
	} else {
		return <ComingSoon />;
	}
};

// Exports the functional component
export default App;
