import React from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ID from './UUID';
import { isObjectNotEmpty } from './utils/objectUtils';

const DynamicOptionList = ({ dirty, setDirty, element, setElement, updateElement, ...props }) => {
	const _setValue = (text) => {
		return text.replace(/[^A-Z0-9]+/ig, '_').toUpperCase();
	};

	const editOption = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		const val = (thisElement.options[optionIndex].value !== _setValue(thisElement.options[optionIndex].text)) ? thisElement.options[optionIndex].value : _setValue(e.target.value);

		thisElement.options[optionIndex].text = e.target.value;
		thisElement.options[optionIndex].value = val;

		setElement(thisElement);
		setDirty(true);
	};

	const editValue = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		const val = (e.target.value === '') ? _setValue(thisElement.options[optionIndex].text) : e.target.value;
		thisElement.options[optionIndex].value = val;

		setElement(thisElement);
		setDirty(true);
	};

	const editDescription = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		const val = e.target.value;
		thisElement.options[optionIndex].description = val;

		setElement(thisElement);
		setDirty(true);
	};

	const editIcon = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		const val = e.target.value;
		thisElement.options[optionIndex].icon = val;

		setElement(thisElement);
		setDirty(true);
	};

	const editImage = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		const val = e.target.value;
		thisElement.options[optionIndex].image = val;

		setElement(thisElement);
		setDirty(true);
	};

	// eslint-disable-next-line no-unused-vars
	const editOptionCorrect = (optionIndex, e) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		if (thisElement.options[optionIndex].hasOwnProperty('correct')) {
			delete (thisElement.options[optionIndex].correct);
		} else {
			thisElement.options[optionIndex].correct = true;
		}
		setElement(thisElement);
		updateElement(thisElement);
	};

	const updateOption = () => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		// to prevent ajax calls with no change
		if (dirty) {
			updateElement(thisElement);
			setDirty(false);
		}
	};

	const addOption = (index) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		thisElement.options.splice(index + 1, 0, { value: '', text: '', icon: '', image: '', key: ID.uuid() });
		updateElement(thisElement);
	};

	const removeOption = (index) => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		thisElement.options.splice(index, 1);
		updateElement(thisElement);
	};

	return (
		<div className="dynamic-option-list">
			<ul>
				<li>
					<Row>
						<Col sm={4}><b>Options</b></Col>
						<Col sm={2}><b>Image</b></Col>
						<Col sm={3}><b>Value</b></Col>
						<Col sm={1}><b>Correct</b></Col>
						<Col sm={2}></Col>
					</Row>
				</li>
				{element.options.map((option, index) => {
					return (
						<li className="clearfix" key={`edit_${option.key}`}>
							<Row>
								<Col sm={4}>
									<Form.Label>Label/Text</Form.Label>
									<Form.Control tabIndex={index + 1} style={{ width: '100%' }} type="text" name={`text_${index}`} placeholder="Option text" value={option.text} onBlur={updateOption} onChange={(e) => { editOption(index, e); }} />
									{props.canHaveDescription &&
										<>
											<Form.Label>Description</Form.Label>
											<Form.Control style={{ width: '100%' }} type="text" name={`description_${index}`} value={option.description} onChange={(e) => { editDescription(index, e); }} />
										</>
									}
								</Col>
								<Col sm={2}>
									{props.canHaveIcon &&
										<>
											<Form.Label>React-Icon Module</Form.Label>
											<Form.Control type="text" name={`icon_${index}`} value={option.icon} onBlur={(e) => { editIcon(index, e); }} onChange={(e) => { editIcon(index, e); }} />
										</>
									}
									{props.canHaveImage &&
										<>
											<Form.Label>Image URL</Form.Label>
											<Form.Control type="text" name={`image_${index}`} value={option.image} onChange={(e) => { editImage(index, e); }} />
										</>
									}
								</Col>
								<Col sm={3}>
									{props.canHaveOptionValue &&
										<Form.Control type="text" name={`value_${index}`} value={option.value} onChange={(e) => { editValue(index, e); }} />
									}
								</Col>
								<Col sm={1}>
									{props.canHaveOptionValue && props.canHaveOptionCorrect &&
										<Form.Check type="checkbox" value="1" onChange={(e) => { editOptionCorrect(index, e); }} checked={option.hasOwnProperty('correct')} />
									}
								</Col>
								<Col sm={2}>
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