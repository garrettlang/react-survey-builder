import React from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Button, Col, Form, Row } from 'react-bootstrap/esm';
import ID from './UUID';

export default class DynamicOptionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			element: this.props.element,
			item: this.props.item,
			dirty: false,
		};
	}

	_setValue(text) {
		return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
	}

	editOption(optionIndex, e) {
		const thisElement = this.state.element;
		const val = (thisElement.options[optionIndex].value !== this._setValue(thisElement.options[optionIndex].text)) ? thisElement.options[optionIndex].value : this._setValue(e.target.value);

		thisElement.options[optionIndex].text = e.target.value;
		thisElement.options[optionIndex].value = val;
		this.setState({
			element: thisElement,
			dirty: true,
		});
	}

	editValue(optionIndex, e) {
		const thisElement = this.state.element;
		const val = (e.target.value === '') ? this._setValue(thisElement.options[optionIndex].text) : e.target.value;
		thisElement.options[optionIndex].value = val;
		this.setState({
			element: thisElement,
			dirty: true,
		});
	}

	// eslint-disable-next-line no-unused-vars
	editOptionCorrect(optionIndex, e) {
		const thisElement = this.state.element;
		if (thisElement.options[optionIndex].hasOwnProperty('correct')) {
			delete (thisElement.options[optionIndex].correct);
		} else {
			thisElement.options[optionIndex].correct = true;
		}
		this.setState({ element: thisElement });
		this.props.updateElement.call(this.props.preview, thisElement);
	}

	updateOption() {
		const thisElement = this.state.element;
		// to prevent ajax calls with no change
		if (this.state.dirty) {
			this.props.updateElement.call(this.props.preview, thisElement);
			this.setState({ dirty: false });
		}
	}

	addOption(index) {
		const thisElement = this.state.element;
		thisElement.options.splice(index + 1, 0, { value: '', text: '', key: ID.uuid() });
		this.props.updateElement.call(this.props.preview, thisElement);
	}

	removeOption(index) {
		const thisElement = this.state.element;
		thisElement.options.splice(index, 1);
		this.props.updateElement.call(this.props.preview, thisElement);
	}

	render() {
		if (this.state.dirty) {
			this.state.element.dirty = true;
		}
		return (
			<div className="dynamic-option-list">
				<ul>
					<li>
						<Row>
							<Col sm={6}><b>Options</b></Col>
							{this.props.canHaveOptionValue &&
								<Col sm={2}><b>Value</b></Col>}
							{this.props.canHaveOptionValue && this.props.canHaveOptionCorrect &&
								<Col sm={4}><b>Correct</b></Col>}
						</Row>
					</li>
					{
						this.props.element.options.map((option, index) => {
							const thisKey = `edit_${option.key}`;
							const val = (option.value !== this._setValue(option.text)) ? option.value : '';
							return (
								<li className="clearfix" key={thisKey}>
									<Row>
										<Col sm={6}>
											<Form.Control tabIndex={index + 1} style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={this.updateOption.bind(this)} onChange={this.editOption.bind(this, index)} />
										</Col>
										{this.props.canHaveOptionValue &&
											<Col sm={2}>
												<Form.Control type="text" name={`value_${index}`} value={val} onChange={this.editValue.bind(this, index)} />
											</Col>}
										{this.props.canHaveOptionValue && this.props.canHaveOptionCorrect &&
											<Col sm={1}>
												<Form.Check type="checkbox" value="1" onChange={this.editOptionCorrect.bind(this, index)} checked={option.hasOwnProperty('correct')} />
											</Col>}
										<Col sm={3}>
											<div className="dynamic-options-actions-buttons">
												<Button variant="success" onClick={this.addOption.bind(this, index)}><FaPlusCircle /></Button>
												{index > 0
													&& <Button variant="danger" onClick={this.removeOption.bind(this, index)}><FaMinusCircle /></Button>
												}
											</div>
										</Col>
									</Row>
								</li>
							);
						})
					}
				</ul>
			</div>
		);
	}
}