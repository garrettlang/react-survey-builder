// eslint-disable-next-line max-classes-per-file
import fetch from 'isomorphic-fetch';
import { saveAs } from 'file-saver';
import React from 'react';
import SignaturePad from 'react-signature-canvas';
import RangeSlider from 'react-bootstrap-range-slider';
import StarRating from './star-rating';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import myxss, { myContentXSS } from './myxss';
import { FaCamera, FaDownload, FaFile, FaTimes } from 'react-icons/fa';
import { Typeahead } from 'react-bootstrap-typeahead';
import ComponentErrorMessage from './component-error-message';
import { getIPAddress } from '../utils/ipUtils';
import moment from 'moment-timezone';
import { RiCheckboxBlankLine, RiCheckboxFill } from "react-icons/ri";
import { IoRadioButtonOff, IoRadioButtonOn } from 'react-icons/io5';
import { ToggleButton, Col, Row, Form, Container, Button, Image as ImageComponent } from 'react-bootstrap';
import { Controller, useFormContext } from 'react-hook-form';
import { IMask, IMaskInput } from 'react-imask';
import { isValidPhoneNumber } from 'libphonenumber-js';
import ID from '../UUID';
import { replaceInText } from '../utils/objectUtils';

const SurveyElements = {};

export const Header = (props) => {
	let classNames = 'static';
	if (props.item.bold) { classNames += ' bold'; }
	if (props.item.italic) { classNames += ' italic'; }
	if (props.headerClassName) { classNames += ` ${props.headerClassName}`; }

	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} />
			<h3 className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(replaceInText(props.item.content, props.item?.staticVariables)) }} />
		</div>
	);
};

export const ContentBody = (props) => {
	let classNames = 'static';

	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} />
			<div className={classNames} dangerouslySetInnerHTML={{ __html: myContentXSS.process(replaceInText(props.item.content, props.item?.staticVariables)) }} />
		</div>
	);
};

export const Paragraph = (props) => {
	let classNames = 'static';
	if (props.item.bold) { classNames += ' bold'; }
	if (props.item.italic) { classNames += ' italic'; }
	if (props.paragraphClassName) { classNames += ` ${props.paragraphClassName}`; }

	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} />
			<p className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(replaceInText(props.item.content, props.item?.staticVariables)) }} />
		</div>
	);
};

export const Label = (props) => {
	let classNames = 'static';
	if (props.item.bold) { classNames += ' bold'; }
	if (props.item.italic) { classNames += ' italic'; }
	if (props.labelClassName) { classNames += ` ${props.labelClassName}`; }

	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} />
			<label className={`form-label ${classNames}`} dangerouslySetInnerHTML={{ __html: myxss.process(replaceInText(props.item.content, props.item?.staticVariables)) }} />
		</div>
	);
};

export const LineBreak = (props) => {
	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} />
			<hr />
		</div>
	);
};

export const TextInput = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const inputProps = {
		type: 'text',
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password' // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<Form.Control
			onBlur={onBlur}
			onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
			value={value}
			name={name}
			ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			{...inputProps}
		/>
	)

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{defaultValue ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const EmailInput = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const validateEmail = (email) => email.match(
		// eslint-disable-next-line no-useless-escape
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	);

	const inputProps = {
		type: 'text',
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password' // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {
		minLength: {
			value: 4,
			message: `${item?.label} must be at least 4 characters long`
		},
		validate: (value) => validateEmail(value) || `${item?.label} field requires valid email address`
	};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<Form.Control
			onBlur={onBlur}
			onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
			value={value}
			name={name}
			ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			{...inputProps}
		/>
	)

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{defaultValue ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const PhoneNumber = ({ name, onChange, defaultValue = '', style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

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

	const validatePhoneNumber = (value) => {
		if (value !== undefined && value !== null && value !== '') {
			return isValidPhoneNumber(toE164PhoneNumber(value), 'US');
		}

		return true;
	};

	const inputProps = {
		type: 'text',
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password' // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {
		validate: (value) => validatePhoneNumber(value) || `${item?.label} field requires a valid phone number`
	};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	if (IMaskInput !== undefined) {
		controllerProps.render = ({
			field: { onChange, onBlur, value, name, ref },
			fieldState: { invalid, isTouched, isDirty, error },
			formState,
		}) => (
			<IMaskInput
				id={name + '-' + ID.uuid()}
				className="form-control"
				onBlur={onBlur}
				value={value}
				name={name}
				mask={'{+1} (#00) 000-0000'}
				lazy={false}
				overwrite={true}
				definitions={{
					'#': /[1-9]/,
				}}
				unmask={true} // true|false|'typed'
				inputRef={ref}
				// inputRef={inputRef}  // access to nested input
				// DO NOT USE onChange TO HANDLE CHANGES!
				// USE onAccept INSTEAD
				onAccept={
					// depending on prop above first argument is
					// `value` if `unmask=false`,
					// `unmaskedValue` if `unmask=true`,
					// `typedValue` if `unmask='typed'`
					(value, mask) => {
						if (onChange !== undefined) {
							onChange(value);
						}
						onChangeHandler(value);
					}
				}
				{...inputProps}
			/>
		);
	} else {
		controllerProps.render = ({
			field: { onChange, onBlur, value, name, ref },
			fieldState: { invalid, isTouched, isDirty, error },
			formState,
		}) => (
			<Form.Control
				onBlur={onBlur}
				onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
				value={value}
				name={name}
				ref={ref}
				isInvalid={invalid}
				id={name + '-' + ID.uuid()}
				{...inputProps}
			/>
		);
	}

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control
								name={name}
								id={name + '-' + ID.uuid()}
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Control
								name={name}
								id={name + '-' + ID.uuid()}
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{defaultValue ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const DatePicker = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
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

	const inputProps = {
		type: 'text',
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password' // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {
		validate: value => validateDate(value) || 'Please enter a valid Date in the format MM/DD/YYYY'
	};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	if (IMaskInput !== undefined && IMask !== undefined) {
		controllerProps.render = ({
			field: { onChange, onBlur, value, name, ref },
			fieldState: { invalid, isTouched, isDirty, error },
			formState,
		}) => (
			<IMaskInput
				id={name + '-' + ID.uuid()}
				className="form-control"
				onBlur={onBlur}
				value={value}
				name={name}
				mask={Date}
				lazy={false}
				overwrite={true}
				pattern={'MM/DD/YYYY'}
				format={function (date) {
					var day = date.getDate();
					var month = date.getMonth() + 1;
					var year = date.getFullYear();

					if (day < 10) day = "0" + day;
					if (month < 10) month = "0" + month;

					return [month, day, year].join('/');
				}}
				autofix={true}
				// min={new Date(1900, 0, 1)}
				// max={new Date()}
				blocks={{
					DD: { mask: IMask.MaskedRange, from: 1, to: 31, maxLength: 2, placeholderChar: 'D' },
					MM: { mask: IMask.MaskedRange, from: 1, to: 12, maxLength: 2, placeholderChar: 'M' },
					YYYY: { mask: IMask.MaskedRange, from: 1900, to: new Date().getFullYear() + 5, placeholderChar: 'Y' }
				}}
				parse={function (str) {
					var monthDayYear = str.split('/');
					return new Date(monthDayYear[2], monthDayYear[0] - 1, monthDayYear[1]);
				}}
				unmask={false} // true|false|'typed'
				inputRef={ref}
				// inputRef={inputRef}  // access to nested input
				// DO NOT USE onChange TO HANDLE CHANGES!
				// USE onAccept INSTEAD
				onAccept={
					// depending on prop above first argument is
					// `value` if `unmask=false`,
					// `unmaskedValue` if `unmask=true`,
					// `typedValue` if `unmask='typed'`
					(value, mask) => {
						if (onChange !== undefined) {
							onChange(value);
						}
						onChangeHandler(value)
					}
				}
				{...inputProps}
			/>
		);
	} else {
		controllerProps.render = ({
			field: { onChange, onBlur, value, name, ref },
			fieldState: { invalid, isTouched, isDirty, error },
			formState,
		}) => (
			<Form.Control
				onBlur={onBlur}
				onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
				value={value}
				name={name}
				ref={ref}
				isInvalid={invalid}
				id={name + '-' + ID.uuid()}
				{...inputProps}
			/>
		);
	}

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	// console.log('controllerProps', controllerProps);

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-' + ID.uuid()}
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-' + ID.uuid()}
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{defaultValue ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const NumberInput = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const inputProps = {
		type: 'number',
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password' // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<Form.Control
			onBlur={onBlur}
			onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
			value={value}
			name={name}
			ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			{...inputProps}
		/>
	)

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{defaultValue ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const TextArea = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const inputProps = {
		rows: item?.rows ?? 5,
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password' // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<Form.Control
			onBlur={onBlur}
			onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
			value={value}
			name={name}
			ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			as="textarea"
			{...inputProps}
		/>
	)

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								as="textarea"
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Control
								value={defaultValue}
								name={name}
								id={name + '-2-' + ID.uuid()}
								as="textarea"
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{defaultValue ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const Dropdown = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const inputProps = {
		type: 'text',
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password', // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	}

	let fieldRules = {};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<Form.Select
			onBlur={onBlur}
			onChange={e => { onChange(e.target.value); onChangeHandler(e.target.value); }}
			value={value}
			name={name}
			ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			{...inputProps}
		>
			{inputProps.placeholder ? <option value="">{inputProps.placeholder}</option> : null}
			{item?.options.map((option) => {
				const thisKey = `preview_${option.key}`;
				return <option value={option.value} key={thisKey}>{option.text}</option>;
			})}
		</Form.Select>
	)

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Select id={name + '-' + ID.uuid()} value={defaultValue} name={name} {...inputProps}>
								{inputProps.placeholder ? <option value="">{inputProps.placeholder}</option> : null}
								{item?.options.map((option) => {
									const thisKey = `preview_${option.key}`;
									return <option value={option.value} key={thisKey}>{option.text}</option>;
								})}
							</Form.Select>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Form.Select id={name + '-' + ID.uuid()} value={defaultValue} name={name} {...inputProps}>
								{inputProps.placeholder ? <option value="">{inputProps.placeholder}</option> : null}
								{item?.options.map((option) => {
									const thisKey = `preview_${option.key}`;
									return <option value={option.value} key={thisKey}>{option.text}</option>;
								})}
							</Form.Select>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{item?.options.find((option) => option.value === defaultValue)?.text}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export class Signature extends React.Component {
	constructor(props) {
		super(props);
		this.state = { value: props.value };
		this.inputField = React.createRef();
		this.canvas = React.createRef();
	}

	clear = () => {
		const $canvas_sig = this.canvas.current;
		if (this.props.value) {
			const $input_sig = this.inputField.current;

			let signature = {
				...this.props.value,
				signature: ''
			};

			$input_sig.value = signature;
			if (this.props.methods) {
				this.props.methods.setValue(this.props.name, signature);
			}
			this.setState({ value: signature });
		} else if ($canvas_sig) {
			$canvas_sig.clear();
		}
	}

	_getSignatureImg = async () => {
		const $canvas_sig = this.canvas.current;
		if ($canvas_sig) {
			const base64 = $canvas_sig.getTrimmedCanvas().toDataURL("image/png");
			const isEmpty = $canvas_sig.isEmpty();
			const $input_sig = this.inputField.current;

			let value = isEmpty ? '' : base64;
			let ipAddress = await getIPAddress();
			let date = new Date().toISOString();

			let signature = {
				...this.props.value,
				signature: value,
				ipAddress: ipAddress,
				date: date
			};

			$input_sig.value = signature;
			if (this.props.methods) {
				this.props.methods.setValue(this.props.name, signature);
			}
			this.setState({ value: signature });
		}
	}

	onChangeName = (event) => {
		const $input_sig = this.inputField.current;

		let signature = {
			...this.props.value,
			name: event.target.value
		};

		$input_sig.value = signature;
		if (this.props.methods) {
			this.props.methods.setValue(this.props.name, signature);
		}
		this.setState({ value: signature });
	}

	render() {
		let canClear = !!this.state.value;
		const props = {};
		props.name = this.props.name;
		// props.onChange = (event) => { console.log('onChangeSignature', event.target.value); this.props.onChange(event.target.value); };
		props.value = this.props.value;
		if (this.props.item.mutable) { props.ref = this.inputField; }

		const padProps = {};
		// umd requires canvasProps={{ width: 400, height: 150 }}
		if (this.props.item.mutable) {
			padProps.defaultValue = this.props.value?.signature;
			padProps.ref = this.canvas;
			canClear = !this.props.item.readOnly;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		let sourceDataURL;
		if (this.state.value?.signature && this.state.value?.signature.length > 0) {
			sourceDataURL = this.state.value?.signature;
		}

		padProps.canvasProps = {};

		if (this.props.item.print === true && !!sourceDataURL) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={this.props.name} />
						<div>
							<ImageComponent src={sourceDataURL} />
							<hr style={{ borderStyle: 'dashed' }} />
							<div><strong>Electronic Signature</strong> at {this.props.value?.date ? moment(this.props.value?.date).format('dddd  MMMM D, YYYY hh:mm A') : moment().format('dddd  MMMM D, YYYY hh:mm A')} by {this.props.value?.name} via IP Address {this.props.value?.ipAddress}</div>
							<hr />
						</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} htmlFor={this.props.name} />
					{this.props.readOnly === true ? (!!sourceDataURL ? (
						<div>
							<ImageComponent src={sourceDataURL} />
							<hr style={{ borderStyle: 'dashed' }} />
							<div><strong>Electronic Signature</strong> at {this.props.value?.date ? moment(this.props.value?.date).format('dddd  MMMM D, YYYY hh:mm A') : moment().format('dddd  MMMM D, YYYY hh:mm A')} by {this.props.value?.name} via IP Address {this.props.value?.ipAddress}</div>
							<hr />
						</div>
					) : null
					) : (
						<div>
							<div className="m-signature-pad">
								<div className="m-signature-pad--body">
									<SignaturePad {...padProps} onEnd={(e) => { this._getSignatureImg(); }} />
								</div>
								<div className="m-signature-pad--footer clearfix">
									{canClear && (<Button variant="default" size="sm" className='clear-signature float-end' onClick={this.clear} title="Clear Signature"><FaTimes /> clear</Button>)}
								</div>
							</div>

							<Form.Label>Please print your full legal name and today's date.</Form.Label>
							<Container>
								<Row>
									<Col sm={6}><Form.Control value={this.props.value?.name ?? ''} type="text" required placeholder='Full Legal Name' onChange={this.onChangeName} /></Col>
									<Col sm={6}>Today's Date: {moment().format('MM/DD/YYYY')}</Col>
								</Row>
							</Container>
						</div>
					)}

					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={this.props.name} />
					{this.props.methods ? (<input {...this.props.methods.register(this.props.name)} {...props} type='hidden' />) : (<input {...props} type='hidden' />)}
					{/* {this.props.methods ? (<input {...this.props.methods.register(`${this.props.name}_date`)} type='hidden' />) : (<input name={`${this.props.name}_date`} type='hidden' />)}
					{this.props.methods ? (<input {...this.props.methods.register(`${this.props.name}_ip_address`)} type='hidden' />) : (<input name={`${this.props.name}_ip_address`} type='hidden' />)} */}
				</Form.Group>
			</div>
		);
	}
}

export const Tags = ({ name, onChange, defaultValue, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const getDefaultValue = (val, options) => {
		if (val) {
			return options.filter((option) => val.indexOf(option.value) > -1);
		}

		return [];
	};

	const options = item?.options.map((option) => {
		return {
			value: option.value,
			label: option.text,
			key: option.value
		};
	});

	const inputProps = {
		multiple: true,
		required: item?.required ?? false,
		disabled: item?.disabled ?? false,
		autoComplete: 'new-password', // hack to prevent auto-complete for form fields
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	if (item?.placeholder) {
		inputProps.placeholder = item?.placeholder;
	} else if (item?.label) {
		inputProps.placeholder = item?.label;
	} else {
		inputProps.placeholder = 'Select...';
	}

	let fieldRules = {};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<Typeahead
			labelKey={(option) => option.label}
			onBlur={onBlur}
			onChange={(selected) => {
				// console.log(selected);
				if (selected.length >= 1) {
					//console.log(selected[0]);
					onChange(selected.map((i) => i.value));
					onChangeHandler(selected.map((i) => i.value));
				} else if (selected.length === 0) {
					onChange([]);
					onChangeHandler([]);
				}
			}}
			options={options}
			selected={getDefaultValue(value, options)}
			name={name}
			ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			{...inputProps}
		/>
	)

	if (defaultValue !== undefined) {
		controllerProps.defaultValue = defaultValue;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let labelLocation = 'ABOVE';
	if (item?.labelLocation) {
		labelLocation = item?.labelLocation;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Typeahead
								labelKey={(option) => option.label}
								options={options}
								name={name}
								id={name + '-' + ID.uuid()}
								{...inputProps}
							/>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
							<Typeahead
								labelKey={(option) => option.label}
								options={options}
								name={name}
								id={name + '-' + ID.uuid()}
								{...inputProps}
							/>
						</>
					)}
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{item?.options.filter((option) => defaultValue?.includes(option.value)).map((option) => option.text).join(', ')}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				{labelLocation === "FLOATING" ? (
					<Form.Floating>
						<Controller control={methods.control} {...controllerProps} />
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					</Form.Floating>
				) : (
					<>
						<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
						<Controller control={methods.control} {...controllerProps} />
					</>
				)}
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export class Checkboxes extends React.Component {
	constructor(props) {
		super(props);
		this.options = {};
	}

	onCheckboxChange = (checkboxValue, event) => {
		let checkedValues = this.props.value;
		if (this.props.onChange) {
			if (event.target.checked) {
				this.props.onChange(checkedValues.concat(checkboxValue));
			} else {
				this.props.onChange(checkedValues.filter((v) => v !== checkboxValue));
			}
		}
	}

	render() {
		const self = this;
		const name = self?.props?.name ?? self?.props?.item?.customName ?? self?.props?.item?.fieldName;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={name} />
						<div>{this.props.item.options.filter((option) => this.props.value.includes(option.value)).map((option) => option.text).join(', ')}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} htmlFor={name} />
					{this.props.item.help ? (<div><Form.Text muted>{this.props.item.help}</Form.Text></div>) : null}
					{this.props.item.options.map((option) => {
						const props = {};
						props.name = `option_${option.key}`;
						props.value = option.value;
						props.checked = self.props.value ? self.props.value.indexOf(option.value) > -1 : false;
						//props.inline = self.props.item.inline ?? false;
						if (self.props.item.disabled) { props.disabled = 'disabled'; }

						return (
							<ToggleButton
								type="checkbox"
								variant={this.props.checkboxButtonClassName ?? "outline-light"}
								className="btn-survey-builder-checkbox w-100"
								key={`preview_${option.key}`}
								id={name + '-' + ID.uuid()}
								inputRef={c => {
									if (c && self.props.item.mutable) {
										self.options[`child_ref_${option.key}`] = c;
									}
								}}
								onChange={(e) => { self.onCheckboxChange(option.value, e); }}
								{...props}
							>
								<div className={`d-flex align-items-center justify-content-start text-black text-survey-builder-checkbox`}>
									{(props.checked !== true) && <RiCheckboxBlankLine size={"40px"} className="me-3 flex-shrink-0" />}
									{(props.checked === true) && <RiCheckboxFill size={"40px"} className="me-3 flex-shrink-0" />}
									<div className="text-start">
										{option.text}
									</div>
								</div>
							</ToggleButton>
						);
					})}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}
}

export class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }
		const props = {};
		// eslint-disable-next-line no-undef
		props.name = this?.props?.name ?? this?.props?.item?.customName ?? this?.props?.item?.fieldName;

		props.onChange = (event) => {
			if (this.props.onChange) {
				this.props.onChange(event.target.checked);
			}
		};
		//props.isInvalid = this.props.isInvalid;
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.inputRef = this.inputField; }

		props.checked = this.props.value;
		//props.inline = this.props.item.inline ?? false;

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div><span dangerouslySetInnerHTML={{ __html: this.props.item.boxLabel }} />: {this.props.value === true ? 'Yes' : 'No'}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel className="form-label" {...this.props} />
					<ToggleButton
						type="checkbox"
						variant={this.props.checkboxButtonClassName ?? "outline-light"}
						className="btn-survey-builder-checkbox w-100"
						value={props.name}
						id={props.name + '-' + ID.uuid()}
						{...props}
					>
						<div className={`d-flex align-items-center justify-content-between text-black text-survey-builder-checkbox`}>
							{(props.checked !== true) && <RiCheckboxBlankLine size={"40px"} className="me-3 flex-shrink-0" />}
							{(props.checked === true) && <RiCheckboxFill size={"40px"} className="me-3 flex-shrink-0" />}
							<div className="text-start">
								{<span dangerouslySetInnerHTML={{ __html: this.props.item.boxLabel }} />}
							</div>
						</div>
					</ToggleButton>
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
				</Form.Group>
			</div>
		);
	}
}

export class RadioButtons extends React.Component {
	constructor(props) {
		super(props);
		this.options = {};
	}

	render() {
		const self = this;
		const name = self?.props?.name ?? self?.props?.item?.customName ?? self?.props?.item?.fieldName;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={this.props.name} />
						<div>{this.props.item.options.filter((option) => this.props.value === option.value).map((option) => option.text).join(', ')}</div>
					</Form.Group>
				</div>
			);
		}
		// console.log('self.props', self.props);

		return (
			<div style={{ ...self.props.style }} className={baseClasses}>
				<ComponentHeader {...self.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...self.props} />
					{self.props.item.help ? (<div><Form.Text muted>{self.props.item.help}</Form.Text></div>) : null}
					{self.props.item.options.map((option) => {
						// console.log('option', option);
						return (
							<ToggleButton
								label={option.text}
								type="radio"
								variant={self.props.checkboxButtonClassName ?? "outline-light"}
								className="btn-survey-builder-checkbox w-100"
								key={`preview_${option.key}`}
								id={name + '-' + ID.uuid()}
								inputRef={c => {
									if (c && self.props.item.mutable) {
										self.options[`child_ref_${option.key}`] = c;
									}
								}}
								disabled={self?.props?.item?.disabled}
								name={name}
								value={option.value}
								checked={self?.props?.value === option.value}
								onChange={(e) => { if (self?.props?.onChange !== undefined) { console.log(e.target.value); self.props.onChange(e.target.value); } }}
							>
								<div className={`d-flex align-items-center justify-content-start text-black text-survey-builder-checkbox`}>
									{(self?.props?.value !== option.value) && <IoRadioButtonOff size={"40px"} className="me-3 flex-shrink-0" />}
									{(self?.props?.value === option.value) && <IoRadioButtonOn size={"40px"} className="me-3 flex-shrink-0" />}
									<div className="text-start">
										{<span dangerouslySetInnerHTML={{ __html: option.text }} />}
									</div>
								</div>
							</ToggleButton>
						);
					})}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}
}

export const Image = (props) => {
	const style = (props.item.center) ? { textAlign: 'center' } : null;

	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style, ...style }} className={baseClasses} >
			<ComponentHeader {...props} />
			{props.item.src && <ImageComponent src={props.item.src} width={props.item.width} height={props.item.height} />}
			{!props.item.src && <div className="no-image">No Image</div>}
		</div>
	);
};

export const Rating = ({ name, onChange, value, style, item, ...props }) => {
	const methods = useFormContext();

	const onChangeHandler = (value) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	const inputProps = {
		required: item?.required ?? false,
		disabled: item?.disabled ?? false
	};

	if (item?.label) {
		inputProps.label = item?.label;
	}

	let fieldRules = {};
	if (item?.required ?? false) {
		fieldRules.required = 'Required Field';
	}

	let controllerProps = {
		name: name,
		rules: fieldRules
	};

	controllerProps.render = ({
		field: { onChange, onBlur, value, name, ref },
		fieldState: { invalid, isTouched, isDirty, error },
		formState,
	}) => (
		<StarRating
			onBlur={onBlur}
			onRatingClick={(event, { rating }) => { onChange(rating); onChangeHandler(rating); }}
			rating={!isNaN(value) ? parseFloat(value, 10) : 0}
			name={name}
			editing={item.mutable}
			// ref={ref}
			isInvalid={invalid}
			id={name + '-' + ID.uuid()}
			{...inputProps}
		/>

	)

	if (value !== undefined) {
		controllerProps.defaultValue = !isNaN(value) ? parseFloat(value, 10) : 0;
	}

	if (item?.disabled !== undefined) {
		controllerProps.disabled = item?.disabled ?? false;
	}

	if (item?.required !== undefined) {
		controllerProps.required = item?.required ?? false;
	}

	let baseClasses = 'SortableItem rfb-item';
	if (item?.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	if (!methods) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<ComponentHeader item={item} {...props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<StarRating
						onRatingClick={(event, { rating }) => { onChange(rating); onChangeHandler(rating); }}
						rating={!isNaN(value) ? Number(value) : 0}
						name={name}
						editing={false}
						id={name + '-' + ID.uuid()}
						{...inputProps}
					/>
					{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}

	if (item?.print === true) {
		return (
			<div style={{ ...style }} className={baseClasses}>
				<Form.Group className="form-group mb-3">
					<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
					<div>{value ?? ''}</div>
				</Form.Group>
			</div>
		);
	}

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} {...props} />
			<Form.Group className="form-group mb-3">
				<ComponentLabel item={item} className={item?.labelClassName} htmlFor={name} />
				<Controller control={methods.control} {...controllerProps} />
				{item?.help ? (<Form.Text muted>{item?.help}</Form.Text>) : null}
				<ComponentErrorMessage name={name} />
			</Form.Group>
		</div>
	);
};

export const HyperLink = (props) => {
	let baseClasses = 'SortableItem rfb-item';
	if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} />
			<Form.Group className="form-group mb-3">
				<Form.Label>
					<a target="_blank" href={props.item.href} dangerouslySetInnerHTML={{ __html: myxss.process(props.item.content) }} />
				</Form.Label>
			</Form.Group>
		</div>
	);
};

export const Download = (props) => {
		let baseClasses = 'SortableItem rfb-item';
		if (props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...props.style }} className={baseClasses}>
				<ComponentHeader {...props} />
				<Form.Group className="form-group mb-3">
					<a href={`${props.downloadPath}?id=${props.item.filePath}`}>{props.item.content}</a>
				</Form.Group>
			</div>
		);
};

export class Camera extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
		this.state = { img: props.value };
	}

	handleChange = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			this.setState({ img: event.target.files[0] });

			if (this.props.onChange) {
				this.props.onChange(event.target.files[0]);
			}
		}
	};

	clearImage = () => {
		this.setState({ img: null });

		if (this.props.onChange) {
			this.props.onChange(null);
		}
	};

	getImageSizeProps({ width, height }) {
		const imgProps = { width: '100%' };

		if (width) {
			imgProps.width = width < window.innerWidth
				? width
				: 0.9 * window.innerWidth;
		}

		if (height) {
			imgProps.height = height;
		}

		return imgProps;
	}

	render() {
		const imageStyle = { objectFit: 'scale-down', objectPosition: (this.props.item.center) ? 'center' : 'left' };
		const fileInputStyle = this.state.img ? { display: 'none' } : null;

		const props = {};
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder || 'Select an image from your computer or device.';
		props.onChange = this.handleChange;
		props.onClick = (event) => { event.target.value = null; };
		props.isInvalid = this.props.isInvalid;
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		let sourceDataURL;
		if (this.props.item.readOnly === true && this.props.value && this.props.value.length > 0) {
			console.log(this.props.value)
			if (this.props.value.indexOf(this.props.name > -1)) {
				sourceDataURL = this.props.value;
			} else {
				sourceDataURL = `data:image/png;base64,${this.props.value}`;
			}
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.item.readOnly === true && this.props.value && this.props.value.length > 0 ? (
						<div>
							<ImageComponent
								style={imageStyle}
								src={sourceDataURL}
								{...this.getImageSizeProps(this.props.item)}
							/>
						</div>
					) : (
						<div className="image-upload-container">
							<div style={fileInputStyle}>
								<Form.Control
									type="file"
									accept="image/*"
									capture="camera"
									className="image-upload"
									{...props}
								/>
								<div className="image-upload-control d-grid gap-2 w-100">
									<Button variant={this.props?.checkboxButtonClassName ?? "outline-dark"} className="d-flex align-items-center justify-content-between fw-bold" size="lg">
										Take Photo <FaCamera />
									</Button>
								</div>
							</div>

							{this.props.value && (
								<div>
									<div className="clearfix">
										<ImageComponent
											// onLoad={() => URL.revokeObjectURL(this.state.previewImg)}
											src={URL.createObjectURL(this.props.value)}
											height="100"
											className="image-upload-preview"
										/>
									</div>
									<Button variant="default" size="sm" onClick={this.clearImage}>
										<FaTimes /> Clear Photo
									</Button>
								</div>
							)}
						</div>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={this.props.name} />
				</Form.Group>
			</div>
		);
	}
}

export class FileUpload extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
		this.state = { fileUpload: props.value };
	}

	handleChange = (event) => {
		if (event.target.files && event.target.files.length > 0) {
			this.setState({ fileUpload: event.target.files[0] });

			if (this.props.onChange) {
				this.props.onChange(event.target.files[0]);
			}
		}
	};

	clearFileUpload = () => {
		this.setState({ fileUpload: null });

		if (this.props.onChange) {
			this.props.onChange(null);
		}
	};

	saveFile = async (e) => {
		e.preventDefault();
		const sourceUrl = this.props.value;
		const response = await fetch(sourceUrl, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json; charset=utf-8',
			},
			responseType: 'blob',
		});
		const dispositionHeader = response.headers.get('Content-Disposition');
		const resBlob = await response.blob();
		// eslint-disable-next-line no-undef
		const blob = new Blob([resBlob], {
			type: this.props.item.fileType || response.headers.get('Content-Type'),
		});
		if (dispositionHeader && dispositionHeader.indexOf(';filename=') > -1) {
			const fileName = dispositionHeader.split(';filename=')[1];
			saveAs(blob, fileName);
		} else {
			const fileName = sourceUrl.substring(sourceUrl.lastIndexOf('/') + 1);
			saveAs(response.url, fileName);
		}
	};

	render() {
		const fileInputStyle = this.state.fileUpload ? { display: 'none' } : null;

		const props = {};
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder || 'Select a file from your computer or device.';
		props.onChange = this.handleChange;
		props.onClick = (event) => { event.target.value = null; };
		props.isInvalid = this.props.isInvalid;
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.item.readOnly === true && this.props.value && this.props.value.length > 0 ? (
						<div>
							<Button variant="default" onClick={this.saveFile}>
								<FaDownload /> Download File
							</Button>
						</div>
					) : (
						<div className='image-upload-container'>
							<div style={fileInputStyle}>
								<Form.Control
									type="file"
									accept={this.props.item.fileType || '*'}
									className="image-upload"
									{...props}
								/>
								<div className='image-upload-control'>
									<Button variant="light">
										<FaFile /> Upload File
									</Button>
									<span>Select a file from your computer or device.</span>
								</div>
							</div>

							{this.state.fileUpload && (
								<div>
									<div className="clearfix">
										<div className='file-upload-preview'>
											<div style={{ display: 'inline-block', marginRight: '5px' }}					>
												{`Name: ${this.state.fileUpload.name}`}
											</div>
											<div style={{ display: 'inline-block', marginLeft: '5px' }}>
												{this.state.fileUpload.size.length > 6
													? `Size:  ${Math.ceil(
														this.state.fileUpload.size / (1024 * 1024)
													)} mb`
													: `Size:  ${Math.ceil(
														this.state.fileUpload.size / 1024
													)} kb`}
											</div>
										</div>
									</div>
									<Button variant="default" size="sm" className='btn-file-upload-clear' onClick={this.clearFileUpload}					>
										<FaTimes /> Clear File
									</Button>
								</div>
							)}
						</div>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={this.props.name} />
				</Form.Group>
			</div>
		);
	}
}

export class Range extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		const name = this.props.name;
		props.name = this.props.name;
		props.value = this.props.value;
		props.onChange = (event) => { this.props.onChange(event.target.value); };
		if (this.props.item.disabled) { props.disabled = true; }
		if (this.props.item.mutable) { props.ref = this.inputField; }
		else {
			if (props.value === undefined) {
				props.value = this.props.item.defaultValue;
			}
		}

		props.type = 'range';
		props.list = `tickmarks_${name}`;
		props.min = this.props.item.minValue;
		props.max = this.props.item.maxValue;
		props.step = this.props.item.step;

		const datalist = [];
		for (let i = parseInt(props.min, 10); i <= parseInt(props.max, 10); i += parseInt(props.step, 10)) {
			datalist.push(i);
		}

		const oneBig = 100 / (datalist.length - 1);

		const _datalist = datalist.map((d, idx) => <option key={`${props.list}_${idx}`}>{d}</option>);

		const visibleMarks = datalist.map((d, idx) => {
			const optionProps = {};
			let w = oneBig;
			if (idx === 0 || idx === datalist.length - 1) { w = oneBig / 2; }
			optionProps.key = `${props.list}_label_${idx}`;
			optionProps.style = { width: `${w}%` };
			if (idx === datalist.length - 1) { optionProps.style = { width: `${w}%`, textAlign: 'right' }; }
			return <label {...optionProps}>{d}</label>;
		});

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} htmlFor={name} />
					<div className="range">
						<div className="clearfix">
							<span className="float-start">{this.props.item.minLabel}</span>
							<span className="float-end">{this.props.item.maxLabel}</span>
						</div>
						<RangeSlider {...props} />
					</div>
					<div className="visible_marks">
						{visibleMarks}
					</div>
					<datalist id={props.list}>
						{_datalist}
					</datalist>
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={name} />
				</Form.Group>
			</div>
		);
	}
}

SurveyElements.Header = Header;
SurveyElements.Paragraph = Paragraph;
SurveyElements.ContentBody = ContentBody;
SurveyElements.Label = Label;
SurveyElements.LineBreak = LineBreak;
SurveyElements.TextInput = TextInput;
SurveyElements.EmailInput = EmailInput;
SurveyElements.PhoneNumber = PhoneNumber;
SurveyElements.NumberInput = NumberInput;
SurveyElements.TextArea = TextArea;
SurveyElements.Dropdown = Dropdown;
SurveyElements.Signature = Signature;
SurveyElements.Checkboxes = Checkboxes;
SurveyElements.Checkbox = Checkbox;
SurveyElements.DatePicker = DatePicker;
SurveyElements.RadioButtons = RadioButtons;
SurveyElements.Image = Image;
SurveyElements.Rating = Rating;
SurveyElements.Tags = Tags;
SurveyElements.HyperLink = HyperLink;
SurveyElements.Download = Download;
SurveyElements.Camera = Camera;
SurveyElements.FileUpload = FileUpload;
SurveyElements.Range = Range;

export default SurveyElements;
