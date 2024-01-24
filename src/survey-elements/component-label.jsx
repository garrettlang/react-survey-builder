import React from 'react';
import myxss from './myxss';
import { Badge } from 'react-bootstrap';

const ComponentLabel = ({ item, className, htmlFor }) => {
	const hasRequiredLabel = (item.hasOwnProperty('required') && item.required === true && !item.readOnly);
	let labelText = myxss.process(item.label);
	if (!labelText || !labelText.trim()) {
		return null;
	}
	labelText = `${labelText}${hasRequiredLabel ? '*' : ''}`;

	const hideRequiredAlert = item.hideRequiredAlert;

	const hideLabel = item.hideLabel ?? false;
	if (hideLabel) return null;

	return (
		<label className={className || ''} htmlFor={htmlFor}>
			<span dangerouslySetInnerHTML={{ __html: labelText }} />
			{hasRequiredLabel && !hideRequiredAlert && <Badge bg="danger" className="label-required">Required</Badge>}
		</label>
	);
};

export default ComponentLabel;
