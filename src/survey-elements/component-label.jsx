import React from 'react';
import myxss from './myxss';

const ComponentLabel = ({ item, className, htmlFor }) => {
	const hasRequiredLabel = (item.hasOwnProperty('required') && item.required === true && !item.readOnly);
	
	let labelText = myxss.process(item.label);
	if (!labelText || !labelText.trim()) {
		return null;
	}

	labelText = `${labelText}${hasRequiredLabel ? '*' : ''}`;

	const hideLabel = item.hideLabel ?? false;
	if (hideLabel) return null;

	return (
		<label className={className || ''} htmlFor={htmlFor}>
			<span dangerouslySetInnerHTML={{ __html: labelText }} />
		</label>
	);
};

export default ComponentLabel;