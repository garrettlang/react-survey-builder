import React from 'react';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import { Form } from 'react-bootstrap';

class CustomElement extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const { bare } = this.props.data;
		const props = {};
		props.name = this.props.data.fieldName;
		props.defaultValue = this.props.defaultValue;

		if (this.props.mutable && this.props.data.forwardRef) {
			props.ref = this.inputField;
		}

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

		// Return if component is invalid.
		if (!this.props.data.component) return null;
		const Element = this.props.data.component;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div className={baseClasses} style={{ ...this.props.style }}>
				<ComponentHeader {...this.props} />
				{bare ?
					<Element data={this.props.data} {...this.props.data.props} {...props} /> :
					<Form.Group>
						<ComponentLabel className="form-label" {...this.props} />
						<Element data={this.props.data} {...this.props.data.props} {...props} />
					</Form.Group>
				}
			</div>
		);
	}
}

CustomElement.propTypes = {};

export default CustomElement;