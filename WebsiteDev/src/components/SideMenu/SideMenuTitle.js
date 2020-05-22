import React from 'react';
import PropTypes from 'prop-types';
import SideMenuStyle from './SideMenuStyle';

const styles = SideMenuStyle;

export default function SideMenuTitle(props) {
	SideMenuTitle.propTypes = {
		style: PropTypes.object,
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		children: PropTypes.object,
	};

	const rootStyle = props.style ? { ...styles.root, ...props.style } : styles.root;

	return (
		<div style={rootStyle}>
			<div style={styles.header}>{props.title}</div>
			{props.children}
		</div>
	);
}
