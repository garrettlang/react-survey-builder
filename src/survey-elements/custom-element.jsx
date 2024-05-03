import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import { Form } from 'react-bootstrap/esm';
import ComponentErrorMessage from './component-error-message';

class CustomElement extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const { bare } = this.props.item;
		const props = {};
		props.name = this.props.item.fieldName;
		props.defaultValue = this.props.defaultValue;

		if (this.props.item.forwardRef) { props.ref = this.inputField; }
		if (this.props.item.disabled) { props.disabled = 'disabled'; }

		// Return if component is invalid.
		if (!this.props.item.component) return null;
		const Element = this.props.item.component;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div className={baseClasses} style={{ ...this.props.style }}>
				<ComponentHeader {...this.props} />
				{bare ? (
					<Element id={props.name} item={this.props.item} {...this.props.item.props} {...props} />
					) : (
						<Form.Group className="form-group mb-3">
							<ComponentLabel className="form-label" {...this.props} htmlFor={props.name} />
							<Element id={props.name} item={this.props.item} {...this.props.item.props} {...props} />
							{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
							<ComponentErrorMessage name={props.name} />
						</Form.Group>
					)}
			</div>
		);
	}
}

CustomElement.propTypes = {};

export default CustomElement;