import React from 'react';
import myxss from './myxss';
import { Badge } from 'react-bootstrap';

const ComponentLabel = (props) => {
	const hasRequiredLabel = (props.data.hasOwnProperty('required') && props.data.required === true && !props.readOnly);
	let labelText = myxss.process(props.data.label);
	if (!labelText || !labelText.trim()) {
		return null;
	}
	labelText = `${labelText}${hasRequiredLabel ? '*' : ''}`;

	const hideRequiredAlert = props.hideRequiredAlert ?? props.data.hideRequiredAlert;

	return (
		<label className={props.className || ''}>
			<span dangerouslySetInnerHTML={{ __html: labelText }} />
			{hasRequiredLabel && !hideRequiredAlert && <Badge bg="danger" className="label-required">Required</Badge>}
		</label>
	);
};

export default ComponentLabel;
