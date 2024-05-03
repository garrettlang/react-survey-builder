import React from 'react';
import PropTypes from 'prop-types';

const PLACE_HOLDER = 'survey-place-holder';
const PLACE_HOLDER_HIDDEN = 'survey-place-holder-hidden';

class PlaceHolder extends React.Component {
	render() {
		const placeHolderClass = this.props.show ? PLACE_HOLDER : PLACE_HOLDER_HIDDEN;
		// eslint-disable-next-line no-nested-ternary
		const placeHolder = this.props.show ?
			(this.props.text === 'Dropzone' ? 'Dropzone' : this.props.text) : '';

		return (
			<div className={placeHolderClass}>
				<div>{placeHolder}</div>
			</div>
		);
	}
}

PlaceHolder.propTypes = {
	text: PropTypes.string,
	show: PropTypes.bool,
};

PlaceHolder.defaultProps = {
	text: 'Dropzone',
	show: false,
};

export default PlaceHolder;