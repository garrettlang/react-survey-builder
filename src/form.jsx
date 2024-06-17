import React from 'react';
import ReactDOM from 'react-dom';
import SurveyElements, { Image, Checkboxes, Signature, Download, Camera, FileUpload, PhoneNumber, DatePicker, TextInput, EmailInput, NumberInput, TextArea } from './survey-elements';
import { TwoColumnRow, ThreeColumnRow, MultiColumnRow } from './multi-column';
import { Fieldset } from './fieldset';
import { Step } from './step';
import CustomElement from './survey-elements/custom-element';
import Registry from './stores/registry';
import { Button, Form } from 'react-bootstrap';
import { Controller, FormProvider, useForm } from "react-hook-form";
import { isListNotEmpty, isObjectNotEmpty } from './utils/objectUtils';

const ReactSurvey = ({ validateForCorrectness = false, displayShort = false, readOnly = false, downloadPath, answers, onSubmit, onChange, items, submitButton = false, backButton = false, backAction = null, hideActions = false, hideLabels = false, variables, staticVariables, buttonClassName, checkboxButtonClassName, headerClassName, labelClassName, paragraphClassName, helpClassName, formId, print = false }) => {
	//#region useForms

	const methods = useForm({ mode: 'all', reValidateMode: 'onChange', criteriaMode: 'all', shouldFocusError: true, shouldUnregister: true });

	//#endregion
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
	const [formAnswers, setFormAnswers] = React.useState(null);

	const _getDefaultValue = ($dataItem) => {
		let defaultValue = answerData.current[$dataItem.fieldName];
		if ($dataItem.element === 'DatePicker') {
			const defaultToday = $dataItem.defaultToday ?? false;
			if (defaultToday && (defaultValue === '' || defaultValue === undefined)) {
				let today = new Date();

				let dd = today.getDate();
				let mm = today.getMonth() + 1;

				let yyyy = today.getFullYear();

				if (dd < 10) {
					dd = '0' + dd;
				}
				if (mm < 10) {
					mm = '0' + mm;
				}
				today = mm + '/' + dd + '/' + yyyy;

				defaultValue = today;
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

		const $formData = methods?.getValues();
		if ($dataItem.element === 'Rating') {
			$item.value = ref.inputField.current.state.rating;
		} else if ($dataItem.element === 'Tags') {
			$item.value = $formData[$dataItem.fieldName];
			// } else if (item.element === 'DatePicker') {
			// 	$item.value = ref.state.value;
		} else if ($dataItem.element === 'Camera') {
			$item.value = ref.state.img;
		} else if ($dataItem.element === 'FileUpload') {
			$item.value = ref.state.fileUpload;
		} else if ($dataItem.element === 'Signature') {
			$item.value = ref.state.value;
		} else if (ref && ref?.inputField && ref?.inputField?.current) {
			$item = ReactDOM.findDOMNode(ref.inputField.current);
			if ($item && typeof $item.value === 'string') {
				$item.value = $item.value.trim();
			}
		} else {
			$item.value = $formData[$dataItem.fieldName];
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

	const _collectFormData = ($dataItems, $formData) => {
		const formData = [];
		$dataItems.filter(i => i.static !== true).forEach((item) => {
			let itemData = {
				id: item.id,
				name: item.fieldName,
				customName: item.customName || item.fieldName,
				label: item.label !== null && item.label !== undefined && item.label !== '' ? item.label.trim() : '',
				value: $formData[item.fieldName],
				required: item.required || false
			};

			if (isListNotEmpty(item?.options)) {
				itemData.options = item?.options.map(i => i.value);
			}

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
				const $data = _collectFormData(items, $formData);
				onSubmit({
					formData: $formData,
					answers: $data
				});
				setFormAnswers($data);
			} else {
				const $form = ReactDOM.findDOMNode(form.current);
				$form.submit();
			}
		}
	}

	const handleChange = (event) => {
		// Call submit function on change
		const $data = _collectFormData(items, methods?.getValues() || []);
		// console.log('handleChange', $data);

		if (onChange) {
			onChange($data);
		}
		setFormAnswers($data);
	};

	const validateForm = () => {
		let hasErrors = false;
		let dataItems = items;

		if (displayShort) {
			dataItems = items.filter((i) => i.alternateForm === true);
		}

		dataItems.forEach((item) => {
			if (_isIncorrect(item)) {
				if (methods) {
					methods.setError(item.fieldName, { type: 'incorrect', message: `${item.label} was answered incorrectly` });
				}
				hasErrors = true;
			}
		});

		return hasErrors;
	};

	const getDataItemById = (id) => {
		let $dataItem = items.find(x => x.id === id);
		if ($dataItem !== undefined) {
			return {
				...$dataItem,
				fieldRules: getFieldRules($dataItem),
				print: print ?? false,
				readOnly: (readOnly || $dataItem.readOnly) ?? false,
				hideLabel: (hideLabels || $dataItem.hideLabel) ?? false,
				disabled: (readOnly || $dataItem.readOnly) ?? false,
				mutable: true,
				name: $dataItem.fieldName ?? $dataItem.name,
				key: `form_${$dataItem.id}`,
				item: $dataItem,
				defaultValue: _getDefaultValue($dataItem),
				staticVariables: staticVariables,
				labelClassName: labelClassName,
				helpClassName: helpClassName
			};
		}

		return null;
	};

	const getStandardElement = (item) => {
		if (!item) return null;

		if (item.custom) {
			return getCustomElement(item);
		}

		const Input = SurveyElements[item.element];

		return (
			<Input
				name={item.fieldName ?? item.name}
				key={`form_${item.id}`}
				item={item}
				defaultValue={_getDefaultValue(item)}
				onChange={handleChange}
				labelClassName={labelClassName}
				helpClassName={helpClassName}
			/>
		);
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
						checkboxButtonClassName={(item.element === 'RadioButtons' || item.element === 'Checkbox') ? (checkboxButtonClassName ?? null) : null}
						labelClassName={labelClassName}
						helpClassName={helpClassName}
					/>
				)}
			/>
		);
	};

	const getContainerElement = (item, Element) => {
		const controls = isObjectNotEmpty(item) && isListNotEmpty(item.childItems) ? item?.childItems?.map((childItem) => (childItem ? getFieldElement(getDataItemById(childItem)) : <div>&nbsp;</div>)) : [];

		return (
			<Element
				mutable={true}
				key={`form_${item.id}`}
				item={item}
				controls={controls}
				items={items}
				answers={formAnswers}
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
				headerClassName={headerClassName}
				paragraphClassName={paragraphClassName}
				labelClassName={labelClassName}
				helpClassName={helpClassName}
			/>
		);
	};

	const getCustomElement = (item) => {
		if (!item.component || typeof item.component !== 'function') {
			item.component = Registry.get(item.key);
			if (!item.component) {
				console.error(`${item.element} was not registered`);
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

		if (item.fieldRules !== undefined && item.fieldRules !== null) {
			fieldRules = { ...item.fieldRules };
		}

		if (item.required) {
			fieldRules.required = `${item.label} is required`;
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

	const getFieldElement = (item) => {
		if (!item) return null;

		item.fieldRules = getFieldRules(item);
		item.print = print ?? false;
		item.readOnly = (readOnly || item.readOnly) ?? false;
		item.hideLabel = (hideLabels || item.hideLabel) ?? false;
		item.disabled = (readOnly || item.readOnly) ?? false;
		item.mutable = true;
		item.staticVariables = staticVariables;
		item.labelClassName = labelClassName;
		item.helpClassName = helpClassName;

		switch (item.element) {
			case 'RadioButtons':
			case 'Range':
			case 'Checkbox':
				return getInputElement(item);
			case 'Rating':
			case 'Tags':
			case 'Dropdown':
			case 'TextInput':
			case 'EmailInput':
			case 'NumberInput':
			case 'TextArea':
			case 'PhoneNumber':
			case 'DatePicker':
				return getStandardElement(item);
			case 'CustomElement':
				return getCustomElement(item);
			case 'MultiColumnRow':
				return getContainerElement(item, MultiColumnRow);
			case 'ThreeColumnRow':
				return getContainerElement(item, ThreeColumnRow);
			case 'TwoColumnRow':
				return getContainerElement(item, TwoColumnRow);
			case 'Step':
				return getContainerElement(item, Step);
			case 'Fieldset':
				return getContainerElement(item, Fieldset);
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
								labelClassName={labelClassName}
								helpClassName={helpClassName}
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
								checkboxButtonClassName={checkboxButtonClassName ?? null}
								labelClassName={labelClassName}
								helpClassName={helpClassName}
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
								labelClassName={labelClassName}
								helpClassName={helpClassName}
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
								labelClassName={labelClassName}
								helpClassName={helpClassName}
							/>
						)}
					/>
				);
			default:
				return getSimpleElement(item);
		}
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

	const fieldItems = dataItems.filter(x => !x.parentId).map((item) => getFieldElement(item));

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

export default ReactSurvey;