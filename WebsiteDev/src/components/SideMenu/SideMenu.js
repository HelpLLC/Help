import React, { useState } from 'react';
import '../../config/fontStyles.css';
import Sidebar from 'react-sidebar';
import '../../config/fontStyles.css';
import SideMenuContent from './SideMenuContent';
import SideMenuTitle from './SideMenuTitle';
import PropTypes from 'prop-types';
import SideMenuStyle from './SideMenuStyle';

const styles = SideMenuStyle;

export default function SideMenu(props) {
	const [open, setOpen] = useState(false);

	SideMenu.propTypes = {
		title: PropTypes.string.isRequired,
	};

	const sidebar = <SideMenuContent />;

	const onSetOpen = () => {
		setOpen(true);
	};

	const sidebarProps = {
		sidebar,
		docked: true,
		sidebarClassName: 'custom-sidebar-class',
		contentId: 'custom-sidebar-content-id',
		open: open,
		touch: true,
		shadow: true,
		pullRight: false,
		touchHandleWidth: 20,
		dragToggleDistance: 30,
		transitions: true,
		onSetOpen: onSetOpen,
	};

	return (
		<Sidebar {...sidebarProps}>
			<SideMenuTitle>
				<div style={styles.content}></div>
			</SideMenuTitle>
		</Sidebar>
	);
}
