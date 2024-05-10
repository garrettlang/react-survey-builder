import React from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ID from './UUID';
import { isObjectNotEmpty } from './utils/objectUtils';

const DynamicOptionList = (props) => {
	const [element, setElement] = React.useState(props.element ?? {});
	const [dirty, setDirty] = React.useState(false);

	const _setValue = (text) => {
		return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
	};

	const editOption = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? {...element} : {};
		const val = (thisElement.options[optionIndex].value !== _setValue(thisElement.options[optionIndex].text)) ? thisElement.options[optionIndex].value : _setValue(e.target.value);

		thisElement.options[optionIndex].text = e.target.value;
		thisElement.options[optionIndex].value = val;

		setElement(thisElement);
		setDirty(true);
	};

	const editValue = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? {...element} : {};
		const val = (e.target.value === '') ? _setValue(thisElement.options[optionIndex].text) : e.target.value;
		thisElement.options[optionIndex].value = val;

		setElement(thisElement);
		setDirty(true);
	};

	// eslint-disable-next-line no-unused-vars
	const editOptionCorrect = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? {...element} : {};
		if (thisElement.options[optionIndex].hasOwnProperty('correct')) {
			delete (thisElement.options[optionIndex].correct);
		} else {
			thisElement.options[optionIndex].correct = true;
		}
		setElement(thisElement);
		props.updateElement(thisElement);
	};

	const updateOption = () => {
		const thisElement = isObjectNotEmpty(element) ? {...element} : {};
		// to prevent ajax calls with no change
		if (dirty) {
			props.updateElement(thisElement);
			setDirty(false);
		}
	};

	const addOption = (index) => {
		const thisElement = isObjectNotEmpty(element) ? {...element} : {};
		thisElement.options.splice(index + 1, 0, { value: '', text: '', key: ID.uuid() });
		props.updateElement(thisElement);
	};

	const removeOption = (index) => {
		const thisElement = isObjectNotEmpty(element) ? {...element} : {};
		thisElement.options.splice(index, 1);
		props.updateElement(thisElement);
	};

	React.useEffect(() => {
		if (dirty) {
			const thisElement = isObjectNotEmpty(element) ? { ...element, dirty: true } : { dirty: true };

			props.updateElement(thisElement);
		}
	}, []);

	return (
		<div className="dynamic-option-list">
			<ul>
				<li>
					<Row>
						<Col sm={6}><b>Options</b></Col>
						{props.canHaveOptionValue &&
							<Col sm={2}><b>Value</b></Col>}
						{props.canHaveOptionValue && props.canHaveOptionCorrect &&
							<Col sm={4}><b>Correct</b></Col>}
					</Row>
				</li>
				{props.element.options.map((option, index) => {
					const val = (option.value !== _setValue(option.text)) ? option.value : '';
					return (
						<li className="clearfix" key={`edit_${option.key}`}>
							<Row>
								<Col sm={6}>
									<Form.Control tabIndex={index + 1} style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={updateOption} onChange={(e) => { editOption(index, e); }} />
								</Col>
								{props.canHaveOptionValue &&
									<Col sm={2}>
										<Form.Control type="text" name={`value_${index}`} value={val} onChange={(e) => { editValue(index, e); }} />
									</Col>}
								{props.canHaveOptionValue && props.canHaveOptionCorrect &&
									<Col sm={1}>
										<Form.Check type="checkbox" value="1" onChange={(e) => { editOptionCorrect(index, e); }} checked={option.hasOwnProperty('correct')} />
									</Col>}
								<Col sm={3}>
									<div className="dynamic-options-actions-buttons">
										<Button variant="success" onClick={() => { addOption(index); }}><FaPlusCircle /></Button>
										{index > 0
											&& <Button variant="danger" onClick={() => { removeOption(index); }}><FaMinusCircle /></Button>
										}
									</div>
								</Col>
							</Row>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default DynamicOptionList;