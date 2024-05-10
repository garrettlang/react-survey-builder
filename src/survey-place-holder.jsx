import React from 'react';
import PropTypes from 'prop-types';

const PlaceHolder = ({ show = false, text = "" }) => {
	return (
		<div className={show ? 'survey-place-holder' : 'survey-place-holder-hidden'}>
			<div>{show ? (text === 'Dropzone' ? 'Dropzone' : text) : ''}</div>
		</div>
	);
};

PlaceHolder.propTypes = {
	text: PropTypes.string,
	show: PropTypes.bool,
};

PlaceHolder.defaultProps = {
	text: 'Dropzone',
	show: false,
};

export default PlaceHolder;