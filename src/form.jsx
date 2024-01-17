/**
  * <Form />
  */

import React from 'react';
import ReactDOM from 'react-dom';
import { EventEmitter } from 'fbemitter';
import { injectIntl } from 'react-intl';
import SurveyValidator from './survey-validator';
import SurveyElements from './survey-elements';
import { TwoColumnRow, ThreeColumnRow, MultiColumnRow } from './multi-column';
import { FieldSet } from './fieldset';
import CustomElement from './survey-elements/custom-element';
import Registry from './stores/registry';
import { Button } from 'react-bootstrap';

const { Image, Checkboxes, Signature, Download, Camera, FileUpload } = SurveyElements;

class ReactSurvey extends React.Component {
	form;

	inputs = {};

	answerData;

	constructor(props) {
		super(props);
		this.answerData = this._convert(props.answerData);
		this.emitter = new EventEmitter();
		this.getDataById = this.getDataById.bind(this);

		// Bind handleBlur and handleChange methods
		this.handleBlur = this.handleBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	_convert(answers) {
		if (Array.isArray(answers)) {
			const result = {};
			answers.forEach(x => {
				if (x.name.indexOf('tags_') > -1) {
					result[x.name] = x.value.map(y => y.value);
				} else {
					result[x.name] = x.value;
				}
			});
			return result;
		}
		return answers || {};
	}

	_getDefaultValue(item) {
		return this.answerData[item.fieldName];
	}

	_optionsDefaultValue(item) {
		const defaultValue = this._getDefaultValue(item);
		if (defaultValue) {
			return defaultValue;
		}

		const defaultChecked = [];
		item.options.forEach(option => {
			if (this.answerData[`option_${option.key}`]) {
				defaultChecked.push(option.key);
			}
		});
		return defaultChecked;
	}

	_getItemValue(item, ref) {
		let $item = {
			element: item.element,
			value: '',
		};
		if (item.element === 'Rating') {
			$item.value = ref.inputField.current.state.rating;
		} else if (item.element === 'Tags') {
			$item.value = ref.inputField.current.state.value;
		} else if (item.element === 'DatePicker') {
			$item.value = ref.state.value;
		} else if (item.element === 'Camera') {
			$item.value = ref.state.img;
		} else if (item.element === 'FileUpload') {
			$item.value = ref.state.fileUpload;
		} else if (ref && ref.inputField && ref.inputField.current) {
			$item = ReactDOM.findDOMNode(ref.inputField.current);
			if ($item && typeof $item.value === 'string') {
				$item.value = $item.value.trim();
			}
		}
		return $item;
	}

	_isIncorrect(item) {
		let incorrect = false;
		if (item.canHaveAnswer) {
			const ref = this.inputs[item.fieldName];
			if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
				item.options.forEach(option => {
					const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
					if ((option.hasOwnProperty('correct') && !$option.checked) || (!option.hasOwnProperty('correct') && $option.checked)) {
						incorrect = true;
					}
				});
			} else {
				const $item = this._getItemValue(item, ref);
				if (item.element === 'Rating') {
					if ($item.value.toString() !== item.correct) {
						incorrect = true;
					}
				} else if ($item.value.toLowerCase() !== item.correct.trim().toLowerCase()) {
					incorrect = true;
				}
			}
		}
		return incorrect;
	}

	_isInvalid(item) {
		let invalid = false;
		if (item.required === true) {
			const ref = this.inputs[item.fieldName];
			if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
				let checked_options = 0;
				item.options.forEach(option => {
					const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
					if ($option.checked) {
						checked_options += 1;
					}
				});
				if (checked_options < 1) {
					// errors.push(item.label + ' is required!');
					invalid = true;
				}
			} else {
				const $item = this._getItemValue(item, ref);
				if (item.element === 'Rating') {
					if ($item.value === 0) {
						invalid = true;
					}
				} else if ($item.value === undefined || $item.value.length < 1) {
					invalid = true;
				}
			}
		}
		return invalid;
	}

	_collect(item) {
		const itemData = {
			id: item.id,
			name: item.fieldName,
			customName: item.customName || item.fieldName,
			help: item.help,
			label: item.label !== null && item.label !== undefined && item.label !== '' ? item.label.trim() : ''
		};
		if (!itemData.name) return null;
		const ref = this.inputs[item.fieldName];
		if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
			const checked_options = [];
			item.options.forEach(option => {
				const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
				if ($option.checked) {
					checked_options.push(option.key);
				}
			});
			itemData.value = checked_options;
		} else if (item.element === 'Checkbox') {
			if (!ref || !ref.inputField || !ref.inputField.current) {
				itemData.value = false;
			} else {
				itemData.value = ref.inputField.current.checked;
			}
		} else {
			if (!ref) return null;
			itemData.value = this._getItemValue(item, ref).value;
		}
		itemData.required = item.required || false;
		return itemData;
	}

	_collectFormData(data) {
		const formData = [];
		data.forEach(item => {
			const item_data = this._collect(item);
			if (item_data) {
				formData.push(item_data);
			}
		});
		return formData;
	}

	_getSignatureImg(item) {
		const ref = this.inputs[item.fieldName];
		const $canvas_sig = ref.canvas.current;
		if ($canvas_sig) {
			const base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
			const isEmpty = $canvas_sig.isEmpty();
			const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
			if (isEmpty) {
				$input_sig.value = '';
			} else {
				$input_sig.value = base64;
			}
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		let errors = [];
		if (!this.props.skipValidations) {
			errors = this.validateForm();
			// Publish errors, if any.
			this.emitter.emit('surveyValidation', errors);
		}

		// Only submit if there are no errors.
		if (errors.length < 1) {
			const { onSubmit } = this.props;
			if (onSubmit) {
				const data = this._collectFormData(this.props.data);
				onSubmit(data);
			} else {
				const $form = ReactDOM.findDOMNode(this.form);
				$form.submit();
			}
		}
	}

	handleBlur(event) {
		// Call submit function on blur
		if (this.props.onBlur) {
			const { onBlur } = this.props;
			const data = this._collectFormData(this.props.data);
			onBlur(data);
		}
	}

	handleChange(event) {
		// Call submit function on change
		if (this.props.onChange) {
			const { onChange } = this.props;
			const data = this._collectFormData(this.props.data);
			onChange(data);
		}
	}

	validateForm() {
		const errors = [];
		let data_items = this.props.data;
		const { intl } = this.props;

		if (this.props.displayShort) {
			data_items = this.props.data.filter((i) => i.alternateForm === true);
		}

		data_items.forEach(item => {
			if (item.element === 'Signature') {
				this._getSignatureImg(item);
			}

			if (this._isInvalid(item)) {
				errors.push(`${item.label} ${intl.formatMessage({ id: 'message.is-required' })}!`);
			}

			if (item.element === 'EmailInput') {
				const ref = this.inputs[item.fieldName];
				const emailValue = this._getItemValue(item, ref).value;
				if (emailValue) {
					const validateEmail = (email) => email.match(
						// eslint-disable-next-line no-useless-escape
						/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					);
					const checkEmail = validateEmail(emailValue);
					if (!checkEmail) {
						errors.push(`${item.label} ${intl.formatMessage({ id: 'message.invalid-email' })}`);
					}
				}
			}

			if (item.element === 'PhoneNumber') {
				const ref = this.inputs[item.fieldName];
				const phoneValue = this._getItemValue(item, ref).value;
				if (phoneValue) {
					const validatePhone = (phone) => phone.match(
						// eslint-disable-next-line no-useless-escape
						/^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g
					);
					const checkPhone = validatePhone(phoneValue);
					if (!checkPhone) {
						errors.push(`${item.label} ${intl.formatMessage({ id: 'message.invalid-phone-number' })}`);
					}
				}
			}

			if (this.props.validateForCorrectness && this._isIncorrect(item)) {
				errors.push(`${item.label} ${intl.formatMessage({ id: 'message.was-answered-incorrectly' })}!`);
			}
		});

		return errors;
	}

	getDataById(id) {
		const { data } = this.props;
		return data.find(x => x.id === id);
	}

	getInputElement(item) {
		if (item.custom) {
			return this.getCustomElement(item);
		}
		const Input = SurveyElements[item.element];
		return (<Input
			handleChange={this.handleChange}
			ref={c => this.inputs[item.fieldName] = c}
			mutable={true}
			key={`form_${item.id}`}
			data={item}
			readOnly={this.props.readOnly}
			hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert}
			defaultValue={this._getDefaultValue(item)} />);
	}

	getContainerElement(item, Element) {
		const controls = item.childItems.map(x => (x ? this.getInputElement(this.getDataById(x)) : <div>&nbsp;</div>));
		return (<Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert} />);
	}

	getSimpleElement(item) {
		const Element = SurveyElements[item.element];
		return (<Element mutable={true} key={`form_${item.id}`} data={item} hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert} />);
	}

	getCustomElement(item) {
		const { intl } = this.props;

		if (!item.component || typeof item.component !== 'function') {
			item.component = Registry.get(item.key);
			if (!item.component) {
				console.error(`${item.element} ${intl.formatMessage({ id: 'message.was-not-registered' })}`);
			}
		}

		const inputProps = item.forwardRef && {
			handleChange: this.handleChange,
			defaultValue: this._getDefaultValue(item),
			ref: c => this.inputs[item.fieldName] = c,
		};
		return (
			<CustomElement
				mutable={true}
				readOnly={this.props.readOnly}
				hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert}
				key={`form_${item.id}`}
				data={item}
				{...inputProps}
			/>
		);
	}

	handleRenderSubmit = () => {
		const name = this.props.actionName || this.props.actionName;
		const actionName = name || 'Submit';
		const { submitButton = false } = this.props;

		return submitButton || <Button variant="primary" type='submit'>{actionName}</Button>;
	}

	handleRenderBack = () => {
		const name = this.props.backName || this.props.backName;
		const backName = name || 'Cancel';
		const { backButton = false } = this.props;

		return backButton || <Button variant="secondary" href={this.props.backAction} className='btn-cancel'>{backName}</Button>;
	}

	render() {
		let data_items = this.props.data;

		if (this.props.displayShort) {
			data_items = this.props.data.filter((i) => i.alternateForm === true);
		}

		data_items.forEach((item) => {
			if (item && item.readOnly && item.variableKey && this.props.variables[item.variableKey]) {
				this.answerData[item.fieldName] = this.props.variables[item.variableKey];
			}
		});

		const items = data_items.filter(x => !x.parentId).map(item => {
			if (!item) return null;
			switch (item.element) {
				case 'TextInput':
				case 'EmailInput':
				case 'PhoneNumber':
				case 'NumberInput':
				case 'TextArea':
				case 'Dropdown':
				case 'DatePicker':
				case 'RadioButtons':
				case 'Rating':
				case 'Tags':
				case 'Range':
				case 'Checkbox':
					return this.getInputElement(item);
				case 'CustomElement':
					return this.getCustomElement(item);
				case 'MultiColumnRow':
					return this.getContainerElement(item, MultiColumnRow);
				case 'ThreeColumnRow':
					return this.getContainerElement(item, ThreeColumnRow);
				case 'TwoColumnRow':
					return this.getContainerElement(item, TwoColumnRow);
				case 'FieldSet':
					return this.getContainerElement(item, FieldSet);
				case 'Signature':
					return <Signature ref={c => this.inputs[item.fieldName] = c} readOnly={this.props.readOnly || item.readOnly} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._getDefaultValue(item)} />;
				case 'Checkboxes':
					return <Checkboxes ref={c => this.inputs[item.fieldName] = c} readOnly={this.props.readOnly} handleChange={this.handleChange} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._optionsDefaultValue(item)} hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert} />;
				case 'Image':
					return <Image ref={c => this.inputs[item.fieldName] = c} handleChange={this.handleChange} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._getDefaultValue(item)} hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert} />;
				case 'Download':
					return <Download downloadPath={this.props.downloadPath} mutable={true} key={`form_${item.id}`} data={item} hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert} />;
				case 'Camera':
					return <Camera ref={c => this.inputs[item.fieldName] = c} readOnly={this.props.readOnly || item.readOnly} mutable={true} key={`form_${item.id}`} data={item} defaultValue={this._getDefaultValue(item)} hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert} />;
				case 'FileUpload':
					return (
						<FileUpload
							ref={(c) => (this.inputs[item.fieldName] = c)}
							readOnly={this.props.readOnly || item.readOnly}
							mutable={true}
							key={`form_${item.id}`}
							data={item}
							hideRequiredAlert={this.props.hideRequiredAlert || item.hideRequiredAlert}
							defaultValue={this._getDefaultValue(item)}
						/>
					);
				default:
					return this.getSimpleElement(item);
			}
		});

		const formTokenStyle = {
			display: 'none',
		};

		return (
			<div>
				<SurveyValidator emitter={this.emitter} />
				<div className='react-survey-builder-form'>
					<form encType='multipart/form-data' ref={c => this.form = c} action={this.props.formAction} onBlur={this.handleBlur} onChange={this.handleChange} onSubmit={this.handleSubmit} method={this.props.formMethod}>
						{this.props.authenticity_token &&
							<div style={formTokenStyle}>
								<input name='utf8' type='hidden' value='&#x2713;' />
								<input name='authenticity_token' type='hidden' value={this.props.authenticity_token} />
								<input name='task_id' type='hidden' value={this.props.task_id} />
							</div>
						}
						{items}
						<div className={this.props.buttonClassName ? this.props.buttonClassName : 'btn-toolbar'}>
							{!this.props.hideActions &&
								this.handleRenderSubmit()
							}
							{!this.props.hideActions && this.props.backAction &&
								this.handleRenderBack()
							}
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default injectIntl(ReactSurvey);
ReactSurvey.defaultProps = { validateForCorrectness: false };