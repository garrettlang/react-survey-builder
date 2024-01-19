/**
  * <FormFields />
  */

import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';
import SurveyElements from './survey-elements';
import { TwoColumnRow, ThreeColumnRow, MultiColumnRow } from './multi-column';
import { FieldSet } from './fieldset';
import CustomElement from './survey-elements/custom-element';
import Registry from './stores/registry';
import { Button, Form } from 'react-bootstrap';
import { Controller, useFormContext } from "react-hook-form";
import ComponentErrorMessage from "./survey-elements/component-error-message";
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';

const { Image, Checkboxes, Signature, Download, Camera, FileUpload } = SurveyElements;

const ReactSurveyFormFields = ({ validateForCorrectness = false, skipValidations = false, displayShort = false, hideRequiredAlert = false, readOnly = false, downloadPath, intl, answers, onSubmit, onChange, onBlur, data, submitButton = false, backButton = false, actionName = null, backName = null, backAction = null, hideActions = false, formAction, formMethod, variables, authenticity_token, task_id, buttonClassName, formId }) => {
	const methods = useFormContext();

	//#region helper functions

	const _convert = (answers) => {
		if (Array.isArray(answers)) {
			const result = {};
			answers.forEach(x => {
				if (x.name.indexOf('tags_') > -1) {
					if (Array.isArray(x.value)) {
						result[x.name] = x.value.map(y => y.value).join(',');
					} else {
						result[x.name] = x.value;
					}
				} else {
					result[x.name] = x.value;
				}
			});

			return result;
		}

		return answers || {};
	};

	const form = React.useRef();
	const inputs = React.useRef({});
	const answerData = React.useRef(_convert(answers));

	const _getDefaultValue = (item) => {
		let defaultValue = answerData.current[item.fieldName];
		if (item.element === 'DatePicker') {
			const defaultToday = item.defaultToday ?? false;
			const formatMask = item.formatMask || 'MM/DD/YYYY';
			if (defaultToday && (defaultValue === '' || defaultValue === undefined)) {
				defaultValue = moment().format(formatMask);
			}
		}

		return defaultValue;
	};

	const _optionsDefaultValue = (item) => {
		const defaultValue = _getDefaultValue(item);
		if (defaultValue) {
			return defaultValue;
		}

		const defaultChecked = [];
		item.options.forEach(option => {
			if (answerData.current[`option_${option.key}`]) {
				defaultChecked.push(option.key);
			}
		});

		return defaultChecked;
	};

	const _getItemValue = (item, ref) => {
		let $item = {
			element: item.element,
			value: '',
		};
		if (item.element === 'Rating') {
			$item.value = ref.inputField.current.state.rating;
		} else if (item.element === 'Tags') {
			$item.value = ref.state.value;
			// } else if (item.element === 'DatePicker') {
			// 	$item.value = ref.state.value;
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
	};

	const _isIncorrect = (item) => {
		let incorrect = false;
		if (item.canHaveAnswer) {
			const ref = inputs.current[item.fieldName];
			if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
				item.options.forEach((option) => {
					const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
					if ((option.hasOwnProperty('correct') && !$option.checked) || (!option.hasOwnProperty('correct') && $option.checked)) {
						incorrect = true;
					}
				});
			} else {
				const $item = _getItemValue(item, ref);
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
	};

	const _isInvalid = (item) => {
		let invalid = false;
		if (item.required === true) {
			const ref = inputs.current[item.fieldName];
			if (item.element === 'Checkboxes' || item.element === 'RadioButtons') {
				let checked_options = 0;
				item.options.forEach((option) => {
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
				const $item = _getItemValue(item, ref);
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
	};

	const _collect = (item) => {
		const itemData = {
			id: item.id,
			name: item.fieldName,
			customName: item.customName || item.fieldName,
			help: item.help,
			label: item.label !== null && item.label !== undefined && item.label !== '' ? item.label.trim() : ''
		};

		if (!itemData.name) return null;

		const ref = inputs.current[item.fieldName];
		if (item.element === 'Checkboxes') {
			const checkedOptions = [];
			item.options.forEach((option) => {
				const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
				if ($option.checked) {
					checkedOptions.push(option.value);
				}
			});

			itemData.value = checkedOptions;
		} else if (item.element === 'RadioButtons') {
			item.options.forEach((option) => {
				const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
				if ($option.checked) {
					itemData.value = option.value;
				}
			});
		} else if (item.element === 'Checkbox') {
			if (!ref || !ref.inputField || !ref.inputField.current) {
				itemData.value = false;
			} else {
				itemData.value = ref.inputField.current.checked;
			}
		} else {
			if (!ref) return null;

			itemData.value = _getItemValue(item, ref).value;
		}

		itemData.required = item.required || false;

		return itemData;
	};

	const _collectFormData = ($data) => {
		const formData = [];
		$data.forEach((item) => {
			const itemData = _collect(item);
			if (itemData) {
				formData.push(itemData);
			}
		});

		return formData;
	};

	const _getSignatureImg = (item) => {
		const ref = inputs.current[item.fieldName];
		const $canvas_sig = ref.canvas.current;
		if ($canvas_sig) {
			const base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
			const isEmpty = $canvas_sig.isEmpty();
			const $input_sig = ReactDOM.findDOMNode(ref.inputField.current);
			if (isEmpty) {
				$input_sig.value = '';
				methods.setValue(item.fieldName, '');
			} else {
				$input_sig.value = base64;
				methods.setValue(item.fieldName, base64);
			}
		}
	};

	//#endregion
	//#region form methods

	const handleSubmit = ($formData, event) => {
		event.preventDefault();

		console.log('handleSubmit', $formData);

		let errors = [];
		if (!skipValidations) {
			errors = validateForm();
			// Publish errors, if any.
			//emitter.emit('surveyValidation', errors);
		}

		// Only submit if there are no errors.
		if (errors.length < 1) {
			if (onSubmit) {
				const $data = _collectFormData(data);
				onSubmit($data);
			} else {
				const $form = ReactDOM.findDOMNode(form.current);
				$form.submit();
			}
		}
	}

	const handleChange = (event) => {
		// console.log('handleChange');
		// Call submit function on change
		if (onChange) {
			const $data = _collectFormData(data);
			onChange($data);
		}
	}

	const validateForm = () => {
		const errors = [];
		let dataItems = data;

		if (displayShort) {
			dataItems = data.filter((i) => i.alternateForm === true);
		}

		dataItems.forEach((item) => {
			if (item.element === 'Signature') {
				_getSignatureImg(item);
			}

			if (_isInvalid(item)) {
				errors.push(`${item.label} ${intl.formatMessage({ id: 'message.is-required' })}!`);
			}

			if (item.element === 'EmailInput') {
				const ref = inputs.current[item.fieldName];
				const emailValue = _getItemValue(item, ref).value;
				if (emailValue) {
					const checkEmail = validateEmail(emailValue);
					if (!checkEmail) {
						errors.push(`${item.label} ${intl.formatMessage({ id: 'message.invalid-email' })}`);
					}
				}
			}

			if (item.element === 'PhoneNumber') {
				const ref = inputs.current[item.fieldName];
				const phoneValue = _getItemValue(item, ref).value;
				if (phoneValue) {
					const checkPhone = validatePhone(phoneValue);
					if (!checkPhone) {
						errors.push(`${item.label} ${intl.formatMessage({ id: 'message.invalid-phone-number' })}`);
					}
				}
			}

			if (validateForCorrectness && _isIncorrect(item)) {
				methods.setError(item.fieldName, { type: 'incorrect', message: `${item.label} ${intl.formatMessage({ id: 'message.was-answered-incorrectly' })}` });
				errors.push(`${item.label} ${intl.formatMessage({ id: 'message.was-answered-incorrectly' })}!`);
			}
		});

		return errors;
	};

	const validateEmail = (email) => email.match(
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

	const validatePhone = (phone) => phone.match(
		// eslint-disable-next-line no-useless-escape
		/^[+]?(1\-|1\s|1|\d{3}\-|\d{3}\s|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/g
	);

	const validateDate = (dateString) => {
		if (dateString !== undefined && dateString !== null && dateString !== "") {
			let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;

			// Matching the date through regular expression      
			if (dateString.match(dateformat)) {
				let operator = dateString.split('/');

				// Extract the string into month, date and year      
				let datepart = [];
				if (operator.length > 1) {
					datepart = dateString.split('/');
				}
				let month = parseInt(datepart[0]);
				let day = parseInt(datepart[1]);
				let year = parseInt(datepart[2]);

				if (day > 31 || day < 1) {
					return false;
				}

				let currentYear = new Date().getFullYear();
				if (year < 1900 || year > (currentYear + 5)) {
					return false;
				}

				// Create a list of days of a month      
				let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				if (month === 1 || month > 2) {
					if (day > ListofDays[month - 1]) {
						// to check if the date is out of range     
						return false;
					}
				} else if (month === 2) {
					let leapYear = false;
					if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
					if ((leapYear === false) && (day >= 29)) return false;
					else
						if ((leapYear === true) && (day > 29)) {
							// console.log('Invalid date format!');
							return false;
						}
				} else if (month > 12 || month < 1) {
					return false;
				}
			} else {
				// console.log("Invalid date format!");
				return false;
			}
		}
		return true;
	};

	const getDataById = (id) => {
		return data.find(x => x.id === id);
	};

	const getInputElement = (item) => {
		if (item.custom) {
			return getCustomElement(item);
		}

		const Input = SurveyElements[item.element];

		return (
			<React.Fragment key={`form_fragment_${item.id}`}>
				<Controller
					key={`form_${item.id}`}
					control={methods.control}
					name={item.fieldName}
					rules={item.fieldRules}
					defaultValue={_getDefaultValue(item)}
					disabled={readOnly || item.readOnly}
					required={item.required}
					render={({
						field: { onChange, onBlur, value, name, ref },
						fieldState: { invalid, isTouched, isDirty, error },
						formState,
					}) => (
						<Input
							onBlur={onBlur}
							onChange={onChange}
							value={value}
							name={name}
							ref={c => inputs.current[item.fieldName] = c}
							isInvalid={invalid}
							handleChange={handleChange}
							mutable={true}
							data={item}
							readOnly={readOnly || item.readOnly}
							hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert}
						/>
					)}
				/>

				<ComponentErrorMessage name={item.fieldName} />
			</React.Fragment>
		);
	}

	const getContainerElement = (item, Element) => {
		const controls = item.childItems.map(x => (x ? getInputElement(getDataById(x)) : <div>&nbsp;</div>));
		return (<Element mutable={true} key={`form_${item.id}`} data={item} controls={controls} hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert} />);
	};

	const getSimpleElement = (item) => {
		const Element = SurveyElements[item.element];
		return (<Element mutable={true} key={`form_${item.id}`} data={item} hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert} />);
	};

	const getCustomElement = (item) => {
		if (!item.component || typeof item.component !== 'function') {
			item.component = Registry.get(item.key);
			if (!item.component) {
				console.error(`${item.element} ${intl.formatMessage({ id: 'message.was-not-registered' })}`);
			}
		}

		const inputProps = item.forwardRef && {
			handleChange: handleChange,
			defaultValue: _getDefaultValue(item),
			ref: (c) => inputs.current[item.fieldName] = c,
		};

		return (
			<React.Fragment key={`form_fragment_${item.id}`}>
				<Controller
					key={`form_${item.id}`}
					control={methods.control}
					name={item.fieldName}
					rules={item.fieldRules}
					defaultValue={_getDefaultValue(item)}
					disabled={readOnly || item.readOnly}
					required={item.required}
					render={({
						field: { onChange, onBlur, value, name, ref },
						fieldState: { invalid, isTouched, isDirty, error },
						formState,
					}) => (
						<CustomElement
							onBlur={onBlur}
							onChange={onChange}
							value={value}
							name={name}
							ref={c => inputs.current[item.fieldName] = c}
							isInvalid={invalid}
							handleChange={handleChange}
							mutable={true}
							data={item}
							readOnly={readOnly || item.readOnly}
							hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert}
							{...inputProps}
						/>
					)}
				/>
				<ComponentErrorMessage name={item.fieldName} />
			</React.Fragment>
		);
	};

	const getFieldRules = (item) => {
		let fieldRules = {};

		if (item.fieldRules !== undefined && item.fieldRules !== null && !isEmpty(item.fieldRules)) {
			fieldRules = { ...item.fieldRules };
		}

		if (item.required) {
			fieldRules.required = `${item.label} ${intl.formatMessage({ id: 'message.is-required' })}`;
		}

		switch (item.element) {
			case 'EmailInput':
				fieldRules.minLength = {
					value: 4,
					message: `${item.label} must be at least 4 characters long`
				};
				fieldRules.validate = (value) => validateEmail(value) || `${item.label} ${intl.formatMessage({ id: 'message.invalid-email' })}`;
			case 'PhoneNumber':
				fieldRules.validate = (value) => validatePhone(value) || `${item.label} ${intl.formatMessage({ id: 'message.invalid-phone-number' })}`;
			case 'DatePicker':
				fieldRules.validate = (value) => validateDate(value) || `${item.label} ${intl.formatMessage({ id: 'message.invalid-date' })}`;
			default:
				break;
		}

		return fieldRules;
	};

	const handleRenderSubmit = () => {
		const actionName = actionName || 'Submit';
		let buttonProps = {};
		if (formId) { buttonProps.form = formId; }

		return submitButton || <Button variant="primary" type='submit'>{actionName}</Button>;
	};

	const handleRenderBack = () => {
		const backName = backName || 'Cancel';

		return backButton || <Button variant="secondary" onClick={backAction} className='btn-cancel'>{backName}</Button>;
	};

	//#endregion

	let dataItems = data;

	if (displayShort) {
		dataItems = data.filter((i) => i.alternateForm === true);
	}

	dataItems.forEach((item) => {
		if (item && item.readOnly && item.variableKey && variables[item.variableKey]) {
			answerData.current[item.fieldName] = variables[item.variableKey];
		}
	});

	const items = dataItems.filter(x => !x.parentId).map((item) => {
		if (!item) return null;

		item.fieldRules = getFieldRules(item);

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
				return getInputElement(item);
			case 'CustomElement':
				return getCustomElement(item);
			case 'MultiColumnRow':
				return getContainerElement(item, MultiColumnRow);
			case 'ThreeColumnRow':
				return getContainerElement(item, ThreeColumnRow);
			case 'TwoColumnRow':
				return getContainerElement(item, TwoColumnRow);
			case 'FieldSet':
				return getContainerElement(item, FieldSet);
			case 'Signature':
				return (
					<React.Fragment key={`form_fragment_${item.id}`}>
						<Controller
							key={`form_${item.id}`}
							control={methods.control}
							name={item.fieldName}
							rules={item.fieldRules}
							defaultValue={_getDefaultValue(item)}
							disabled={readOnly || item.readOnly}
							required={item.required}
							render={({
								field: { onChange, onBlur, value, name, ref },
								fieldState: { invalid, isTouched, isDirty, error },
								formState,
							}) => (
								<Signature
									methods={methods}
									onBlur={onBlur}
									onChange={onChange}
									value={value}
									name={name}
									ref={c => inputs.current[item.fieldName] = c}
									handleChange={handleChange}
									mutable={true}
									data={item}
									readOnly={readOnly || item.readOnly}
									hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert}
								/>
							)}
						/>
						<ComponentErrorMessage name={item.fieldName} />
					</React.Fragment>
				);
			case 'Checkboxes':
				return (
					<React.Fragment key={`form_fragment_${item.id}`}>
						<Controller
							key={`form_${item.id}`}
							control={methods.control}
							name={item.fieldName}
							rules={item.fieldRules}
							defaultValue={_optionsDefaultValue(item)}
							disabled={readOnly || item.readOnly}
							required={item.required}
							render={({
								field: { onChange, onBlur, value, name, ref },
								fieldState: { invalid, isTouched, isDirty, error },
								formState,
							}) => (
								<Checkboxes
									onBlur={onBlur}
									onChange={onChange}
									value={value}
									name={name}
									ref={c => inputs.current[item.fieldName] = c}
									isInvalid={invalid}
									handleChange={handleChange}
									mutable={true}
									data={item}
									readOnly={readOnly || item.readOnly}
									hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert}
								/>
							)}
						/>
						<ComponentErrorMessage name={item.fieldName} />
					</React.Fragment>
				);
			case 'Image':
				return <Image ref={c => inputs.current[item.fieldName] = c} handleChange={handleChange} mutable={true} key={`form_${item.id}`} data={item} defaultValue={_getDefaultValue(item)} hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert} />;;
			case 'Download':
				return <Download downloadPath={downloadPath} mutable={true} key={`form_${item.id}`} data={item} hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert} />;
			case 'Camera':
				return (
					<React.Fragment key={`form_fragment_${item.id}`}>
						<Controller
							key={`form_${item.id}`}
							control={methods.control}
							name={item.fieldName}
							rules={item.fieldRules}
							defaultValue={_getDefaultValue(item)}
							disabled={readOnly || item.readOnly}
							required={item.required}
							render={({
								field: { onChange, onBlur, value, name, ref },
								fieldState: { invalid, isTouched, isDirty, error },
								formState,
							}) => (
								<Camera
									onBlur={onBlur}
									onChange={onChange}
									value={value}
									name={name}
									ref={c => inputs.current[item.fieldName] = c}
									isInvalid={invalid}
									defaultValue={_getDefaultValue(item)}
									handleChange={handleChange}
									mutable={true}
									data={item}
									readOnly={readOnly || item.readOnly}
									hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert}
								/>
							)}
						/>
						<ComponentErrorMessage name={item.fieldName} />
					</React.Fragment>
				);
			case 'FileUpload':
				return (
					<React.Fragment key={`form_fragment_${item.id}`}>
						<Controller
							key={`form_${item.id}`}
							control={methods.control}
							name={item.fieldName}
							rules={item.fieldRules}
							defaultValue={_getDefaultValue(item)}
							disabled={readOnly || item.readOnly}
							required={item.required}
							render={({
								field: { onChange, onBlur, value, name, ref },
								fieldState: { invalid, isTouched, isDirty, error },
								formState,
							}) => (
								<FileUpload
									onBlur={onBlur}
									onChange={onChange}
									value={value}
									name={name}
									ref={c => inputs.current[item.fieldName] = c}
									isInvalid={invalid}
									defaultValue={_getDefaultValue(item)}
									handleChange={handleChange}
									mutable={true}
									data={item}
									readOnly={readOnly || item.readOnly}
									hideRequiredAlert={hideRequiredAlert || item.hideRequiredAlert}
								/>
							)}
						/>
						<ComponentErrorMessage name={item.fieldName} />
					</React.Fragment>
				);
			default:
				return getSimpleElement(item);
		}
	});

	let formProps = {};
	if (formId) { formProps.id = formId; }

	return (
		<div>
			<div className='react-survey-builder-form'>
				<Form onSubmit={methods.handleSubmit(handleSubmit)} {...formProps}>
					{items}
					<div className={buttonClassName ? buttonClassName : 'btn-toolbar'}>
						{!hideActions && handleRenderSubmit()}
						{!hideActions && backAction && handleRenderBack()}
					</div>
				</Form>
			</div>
		</div>
	);

};

export default injectIntl(ReactSurveyFormFields);