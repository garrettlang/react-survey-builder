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
import { Controller, FormProvider } from "react-hook-form";
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { isValidPhoneNumber } from 'react-phone-number-input';

const { Image, Checkboxes, Signature, Download, Camera, FileUpload } = SurveyElements;

const ReactSurveyFormFields = ({ validateForCorrectness = false, displayShort = false, readOnly = false, downloadPath, intl, answers, onSubmit, onChange, onBlur, items, submitButton = false, backButton = false, actionName = null, backName = null, backAction = null, hideActions = false, formAction, formMethod, variables, authenticity_token, task_id, buttonClassName, checkboxButtonClassName, formId, methods, print = false }) => {
	if (!methods) return null;

	//#region helper functions

	const _convert = ($dataAnswers) => {
		if (Array.isArray($dataAnswers)) {
			const result = {};
			$dataAnswers.forEach((answer) => {
				result[answer.name] = answer.value;
			});

			return result;
		}

		return $dataAnswers || {};
	};

	const form = React.useRef();
	const inputs = React.useRef({});
	const answerData = React.useRef(_convert(answers));

	const _getDefaultValue = ($dataItem) => {
		let defaultValue = answerData.current[$dataItem.fieldName];
		if ($dataItem.element === 'DatePicker') {
			const defaultToday = $dataItem.defaultToday ?? false;
			const formatMask = $dataItem.formatMask || 'MM/DD/YYYY';
			if (defaultToday && (defaultValue === '' || defaultValue === undefined)) {
				defaultValue = moment().format(formatMask);
			}
		}

		if ($dataItem.element === 'Checkbox') {
			const defaultChecked = $dataItem.defaultChecked ?? false;
			if (defaultChecked === true) {
				defaultValue = true;
			}
		}

		if (defaultValue === undefined) {
			if ($dataItem.element === 'Checkboxes' || $dataItem.element === 'Tags') {
				defaultValue = [];
			} else if ($dataItem.element === 'NumberInput' || $dataItem.element === 'Range') {
				defaultValue = $dataItem.minValue ?? 0;
			} else {
				defaultValue = '';
			}
		}

		return defaultValue;
	};

	const _optionsDefaultValue = ($dataItem) => {
		const defaultValue = _getDefaultValue($dataItem);
		if (defaultValue) {
			return defaultValue;
		}

		const defaultChecked = [];
		$dataItem.options.forEach(option => {
			if (answerData.current[`option_${option.key}`]) {
				defaultChecked.push(option.key);
			}
		});

		return defaultChecked;
	};

	const _getItemValue = ($dataItem, ref) => {
		let $item = {
			element: $dataItem.element,
			value: '',
		};
		if ($dataItem.element === 'Rating') {
			$item.value = ref.inputField.current.state.rating;
		} else if ($dataItem.element === 'Tags') {
			$item.value = ref.props.value;
			// } else if (item.element === 'DatePicker') {
			// 	$item.value = ref.state.value;
		} else if ($dataItem.element === 'Camera') {
			$item.value = ref.state.img;
		} else if ($dataItem.element === 'FileUpload') {
			$item.value = ref.state.fileUpload;
		} else if ($dataItem.element === 'Signature') {
			$item.value = ref.state.value;
		} else if (ref && ref.inputField && ref.inputField.current) {
			$item = ReactDOM.findDOMNode(ref.inputField.current);
			if ($item && typeof $item.value === 'string') {
				$item.value = $item.value.trim();
			}
		}

		return $item;
	};

	const _isIncorrect = ($dataItem) => {
		let incorrect = false;

		const canHaveAnswer = ['NumberInput', 'EmailInput', 'TextInput', 'PhoneNumber', 'TextArea', 'DatePicker', 'Dropdown', 'Tags', 'Checkboxes', 'Checkbox', 'RadioButtons', 'Rating', 'Range'].indexOf($dataItem.element) !== -1;
		if (canHaveAnswer) {
			const ref = inputs.current[$dataItem.fieldName];
			if ($dataItem.element === 'Checkboxes' || $dataItem.element === 'RadioButtons') {
				$dataItem.options.forEach((option) => {
					const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
					if ((option.hasOwnProperty('correct') && !$option.checked) || (!option.hasOwnProperty('correct') && $option.checked)) {
						incorrect = true;
					}
				});
			} else {
				const $item = _getItemValue($dataItem, ref);
				if ($dataItem.element === 'Rating' || $dataItem.element === 'Range' || $dataItem.element === 'NumberInput') {
					// number to string
					if ($item.value.toString() !== $dataItem.correct) {
						incorrect = true;
					}
				} else if ($dataItem.element === 'Checkbox') {
					// boolean to string
					if ($item.value.toString() !== $dataItem.correct) {
						incorrect = true;
					}
				} else if ($item.value.toLowerCase() !== $dataItem.correct.trim().toLowerCase()) {
					incorrect = true;
				}
			}
		}

		return incorrect;
	};

	const _isInvalid = ($dataItem) => {
		let invalid = false;
		if ($dataItem.required === true) {
			const ref = inputs.current[$dataItem.fieldName];
			if ($dataItem.element === 'Checkboxes' || $dataItem.element === 'RadioButtons') {
				let checked_options = 0;
				$dataItem.options.forEach((option) => {
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
				const $item = _getItemValue($dataItem, ref);
				if ($dataItem.element === 'Rating') {
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

	const _collect = ($dataItem) => {
		const itemData = {
			id: $dataItem.id,
			name: $dataItem.fieldName,
			customName: $dataItem.customName || $dataItem.fieldName,
			label: $dataItem.label !== null && $dataItem.label !== undefined && $dataItem.label !== '' ? $dataItem.label.trim() : ''
		};

		if (!itemData.name) return null;

		const ref = inputs.current[$dataItem.fieldName];
		if ($dataItem.element === 'Checkboxes') {
			const checkedOptions = [];
			$dataItem.options.forEach((option) => {
				const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
				if ($option.checked) {
					checkedOptions.push(option.value);
				}
			});

			itemData.value = checkedOptions;
		} else if ($dataItem.element === 'RadioButtons') {
			$dataItem.options.forEach((option) => {
				const $option = ReactDOM.findDOMNode(ref.options[`child_ref_${option.key}`]);
				if ($option.checked) {
					itemData.value = option.value;
				}
			});
		} else if ($dataItem.element === 'Checkbox') {
			if (!ref || !ref.inputField || !ref.inputField.current) {
				itemData.value = false;
			} else {
				itemData.value = ref.inputField.current.checked;
			}
		} else {
			if (!ref) return null;

			itemData.value = _getItemValue($dataItem, ref).value;
		}

		itemData.required = $dataItem.required || false;

		return itemData;
	};

	const _collectFormData = ($dataItems) => {
		const formData = [];
		$dataItems.forEach((item) => {
			const itemData = _collect(item);
			if (itemData) {
				formData.push(itemData);
			}
		});

		return formData;
	};

	//#endregion
	//#region form methods

	const handleSubmit = ($formData, event) => {
		event.preventDefault();

		let hasErrors = false;
		if (validateForCorrectness) {
			hasErrors = validateForm();
		}

		// Only submit if there are no errors.
		if (hasErrors === false) {
			if (onSubmit) {
				const $data = _collectFormData(items);
				onSubmit({
					formData: $formData,
					answers: $data
				});
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
			const $data = _collectFormData(items);
			onChange($data);
		}
	}

	const validateForm = () => {
		let hasErrors = false;
		let dataItems = items;

		if (displayShort) {
			dataItems = items.filter((i) => i.alternateForm === true);
		}

		dataItems.forEach((item) => {
			if (_isIncorrect(item)) {
				if (methods) {
					methods.setError(item.fieldName, { type: 'incorrect', message: `${item.label} ${intl.formatMessage({ id: 'message.was-answered-incorrectly' })}` });
				}
				hasErrors = true;
			}
		});

		return hasErrors;
	};

	const validateEmail = (email) => email.match(
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

	const toE164PhoneNumber = (phoneNumberValue) => {
		if (phoneNumberValue !== undefined && phoneNumberValue !== null) {
			//Filter only numbers from the input
			let cleaned = ('' + phoneNumberValue).replace(/\D/g, '');

			//Check if the input is of correct
			let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

			if (match) {
				//Remove the matched extension code
				//Change this to format for any country code.
				let intlCode = (match[1] ? '+1' : '+1')
				return [intlCode, match[2], match[3], match[4]].join('');
			}

			return '';
		} else {
			return '';
		}
	};

	const validatePhone = (phone) => {
		return isValidPhoneNumber(toE164PhoneNumber(phone), 'US');
	};

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

	const getDataItemById = (id) => {
		let $dataItem = items.find(x => x.id === id);
		if ($dataItem !== undefined) {
			return {
				...$dataItem,
				fieldRules: getFieldRules($dataItem),
				print: print ?? false,
				readOnly: (readOnly || $dataItem.readOnly) ?? false,
				disabled: (readOnly || $dataItem.readOnly) ?? false,
				mutable: true
			};
		}

		return null;
	};

	const getInputElement = (item) => {
		if (!item) return null;

		if (item.custom) {
			return getCustomElement(item);
		}

		const Input = SurveyElements[item.element];

		return (
			<Controller
				key={`form_${item.id}`}
				control={methods.control}
				name={item.fieldName}
				rules={item.fieldRules}
				defaultValue={_getDefaultValue(item)}
				disabled={item.disabled}
				required={item.required}
				render={({
					field: { onChange, onBlur, value, name, ref },
					fieldState: { invalid, isTouched, isDirty, error },
					formState,
				}) => (
					<Input
						onBlur={onBlur}
						onChange={(e) => { onChange(e); handleChange(e); }}
						value={value}
						name={name}
						ref={c => inputs.current[item.fieldName] = c}
						isInvalid={invalid}
						item={item}
						className={(item.element === 'RadioButtons' || item.element === 'Checkbox') ? (checkboxButtonClassName ?? null) : null}
					/>
				)}
			/>
		);
	};

	const getContainerElement = (item, Element) => {
		const controls = item.childItems.map((childItem) => (childItem ? getInputElement(getDataItemById(childItem)) : <div>&nbsp;</div>));

		return (
			<Element
				mutable={true}
				key={`form_${item.id}`}
				item={item}
				controls={controls}
			/>
		);
	};

	const getSimpleElement = (item) => {
		const Element = SurveyElements[item.element];

		return (
			<Element
				mutable={true}
				key={`form_${item.id}`}
				item={item}
			/>
		);
	};

	const getCustomElement = (item) => {
		if (!item.component || typeof item.component !== 'function') {
			item.component = Registry.get(item.key);
			if (!item.component) {
				console.error(`${item.element} ${intl.formatMessage({ id: 'message.was-not-registered' })}`);
			}
		}

		return (
			<Controller
				key={`form_${item.id}`}
				control={methods.control}
				name={item.fieldName}
				rules={item.fieldRules}
				defaultValue={_getDefaultValue(item)}
				disabled={item.disabled}
				required={item.required}
				render={({
					field: { onChange, onBlur, value, name, ref },
					fieldState: { invalid, isTouched, isDirty, error },
					formState,
				}) => (
					<CustomElement
						onBlur={onBlur}
						onChange={(e) => { onChange(e); handleChange(e); }}
						value={value}
						name={name}
						ref={c => inputs.current[item.fieldName] = c}
						isInvalid={invalid}
						item={item}
					/>
				)}
			/>
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
				break;
			case 'PhoneNumber':
				fieldRules.validate = (value) => validatePhone(value) || `${item.label} ${intl.formatMessage({ id: 'message.invalid-phone-number' })}`;
				break;
			case 'DatePicker':
				fieldRules.validate = (value) => validateDate(value) || `${item.label} ${intl.formatMessage({ id: 'message.invalid-date' })}`;
				break;
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

	let dataItems = items ? [...items] : [];

	if (displayShort) {
		dataItems = items ? [...items].filter((i) => i.alternateForm === true) : [];
	}

	dataItems.forEach((item) => {
		if (item && item.readOnly && item.variableKey && variables[item.variableKey]) {
			answerData.current[item.fieldName] = variables[item.variableKey];
		}
	});

	const fieldItems = dataItems.filter(x => !x.parentId).map((item) => {
		if (!item) return null;

		item.fieldRules = getFieldRules(item);
		item.print = print ?? false;
		item.readOnly = (readOnly || item.readOnly) ?? false;
		item.disabled = (readOnly || item.readOnly) ?? false;
		item.mutable = true;

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
					<Controller
						key={`form_${item.id}`}
						control={methods.control}
						name={item.fieldName}
						rules={item.fieldRules}
						defaultValue={_getDefaultValue(item)}
						disabled={item.disabled}
						required={item.required}
						render={({
							field: { onChange, onBlur, value, name, ref },
							fieldState: { invalid, isTouched, isDirty, error },
							formState,
						}) => (
							<Signature
								methods={methods}
								onBlur={onBlur}
								onChange={(e) => { onChange(e); handleChange(e); }}
								value={value}
								name={name}
								ref={c => inputs.current[item.fieldName] = c}
								item={item}
							/>
						)}
					/>
				);
			case 'Checkboxes':
				return (
					<Controller
						key={`form_${item.id}`}
						control={methods.control}
						name={item.fieldName}
						rules={item.fieldRules}
						defaultValue={_optionsDefaultValue(item)}
						disabled={item.disabled}
						required={item.required}
						render={({
							field: { onChange, onBlur, value, name, ref },
							fieldState: { invalid, isTouched, isDirty, error },
							formState,
						}) => (
							<Checkboxes
								onBlur={onBlur}
								onChange={(e) => { onChange(e); handleChange(e); }}
								value={value}
								name={name}
								ref={c => inputs.current[item.fieldName] = c}
								isInvalid={invalid}
								item={item}
								className={checkboxButtonClassName ?? null}
							/>
						)}
					/>
				);
			case 'Image':
				return (
					<Image ref={c => inputs.current[item.fieldName] = c} key={`form_${item.id}`} item={item} />
				);
			case 'Download':
				return (
					<Download downloadPath={downloadPath} key={`form_${item.id}`} item={item} />
				);
			case 'Camera':
				return (
					<Controller
						key={`form_${item.id}`}
						control={methods.control}
						name={item.fieldName}
						rules={item.fieldRules}
						defaultValue={_getDefaultValue(item)}
						disabled={item.disabled}
						required={item.required}
						render={({
							field: { onChange, onBlur, value, name, ref },
							fieldState: { invalid, isTouched, isDirty, error },
							formState,
						}) => (
							<Camera
								onBlur={onBlur}
								onChange={(e) => { onChange(e); handleChange(e); }}
								value={value}
								name={name}
								ref={c => inputs.current[item.fieldName] = c}
								isInvalid={invalid}
								item={item}
							/>
						)}
					/>
				);
			case 'FileUpload':
				return (
					<Controller
						key={`form_${item.id}`}
						control={methods.control}
						name={item.fieldName}
						rules={item.fieldRules}
						defaultValue={_getDefaultValue(item)}
						disabled={item.disabled}
						required={item.required}
						render={({
							field: { onChange, onBlur, value, name, ref },
							fieldState: { invalid, isTouched, isDirty, error },
							formState,
						}) => (
							<FileUpload
								onBlur={onBlur}
								onChange={(e) => { onChange(e); handleChange(e); }}
								value={value}
								name={name}
								ref={c => inputs.current[item.fieldName] = c}
								isInvalid={invalid}
								item={item}
							/>
						)}
					/>
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
				<FormProvider {...methods}>
					<Form onSubmit={methods.handleSubmit(handleSubmit)} {...formProps}>
						{fieldItems}
						<div className={buttonClassName ? buttonClassName : 'btn-toolbar'}>
							{!hideActions && handleRenderSubmit()}
							{!hideActions && backAction && handleRenderBack()}
						</div>
					</Form>
				</FormProvider>
			</div>
		</div>
	);
};

export default injectIntl(ReactSurveyFormFields);