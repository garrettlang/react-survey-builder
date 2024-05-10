import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import { Form } from 'react-bootstrap';
import ComponentErrorMessage from './component-error-message';

const CustomElement = ({ item, defaultValue, style, ...props }) => {
	const inputField = React.useRef();

	const inputProps = {
		name: item.fieldName ?? item.name,
		defaultValue: defaultValue
	};

	if (item.forwardRef) { inputProps.ref = inputField; }
	if (item.disabled) { inputProps.disabled = true; }

	// Return if component is invalid.
	if (!item.component) return null;

	const Element = item.component;

	let baseClasses = 'SortableItem rfb-item';
	if (item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div className={baseClasses} style={{ ...style }}>
			<ComponentHeader item={item} {...props} />
			{item?.bare ? (
				<Element id={inputProps.name} item={item} {...item.props} {...inputProps} />
			) : (
				<Form.Group className="form-group mb-3">
					<ComponentLabel className="form-label" item={item} {...props} htmlFor={inputProps.name} />
					<Element id={inputProps.name} item={item} {...item.props} {...inputProps} />
					{item?.help ? (<Form.Text muted>{item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={inputProps.name} />
				</Form.Group>
			)}
		</div>
	);
};

CustomElement.propTypes = {};

export default CustomElement;