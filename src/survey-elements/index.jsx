// eslint-disable-next-line max-classes-per-file
import fetch from 'isomorphic-fetch';
import { saveAs } from 'file-saver';
import React from 'react';
import Select from 'react-select';
import SignaturePad from 'react-signature-canvas';
import RangeSlider from 'react-bootstrap-range-slider';
import StarRating from './star-rating';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import myxss from './myxss';
import { FaCamera, FaDownload, FaFile, FaTimes } from 'react-icons/fa';
import { Button, Form, Image as ImageComponent } from 'react-bootstrap';
import { IMaskInput } from "react-imask";
import { Typeahead } from 'react-bootstrap-typeahead';

const CustomPhoneInput = React.forwardRef(({ onChange, ...otherProps }, ref) => (
	<IMaskInput
		{...otherProps}
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
				onChange(value);
			}
		}
	/>
));

const CustomDateInput = React.forwardRef(({ onChange, formatMask = 'MM/DD/YYYY', ...otherProps }, ref) => (
	<IMaskInput
		{...otherProps}
		mask={Date}
		lazy={false}
		overwrite={true}
		pattern={formatMask}
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
				onChange(value);
			}
		}
	/>
));

const SurveyElements = {};

class Header extends React.Component {
	render() {
		// const headerClasses = `dynamic-input ${this.props.data.element}-input`;
		let classNames = 'static';
		if (this.props.data.bold) { classNames += ' bold'; }
		if (this.props.data.italic) { classNames += ' italic'; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<h3 className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
			</div>
		);
	}
}

class Paragraph extends React.Component {
	render() {
		let classNames = 'static';
		if (this.props.data.bold) { classNames += ' bold'; }
		if (this.props.data.italic) { classNames += ' italic'; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<p className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
			</div>
		);
	}
}

class Label extends React.Component {
	render() {
		let classNames = 'static';
		if (this.props.data.bold) { classNames += ' bold'; }
		if (this.props.data.italic) { classNames += ' italic'; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<label className={`${classNames} form-label`} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
			</div>
		);
	}
}

class LineBreak extends React.Component {
	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<hr />
			</div>
		);
	}
}

class TextInput extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.type = 'text';
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.value); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} {...props} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class EmailInput extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.type = 'text';
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.value); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} {...props} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class PhoneNumber extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.type = 'text';
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }
		props.autoComplete = "new-password";

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} {...props} as={CustomPhoneInput} />
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Form.Control id={props.name} {...props} as={CustomPhoneInput} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class DatePicker extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.type = 'text';
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		props.formatMask = this.props.data.formatMask || 'MM/DD/YYYY';

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }
		props.autoComplete = "new-password";

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} {...props} as={CustomDateInput} />
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Form.Control id={props.name} {...props} as={CustomDateInput} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class NumberInput extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.type = 'number';
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.value); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }

		props.min = this.props.data.minValue;
		props.max = this.props.data.maxValue;
		props.step = this.props.data.step;

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} {...props} />
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Form.Control id={props.name} {...props} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class TextArea extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);

		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.value); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control as="textarea" id={props.name} {...props} />
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Form.Control as="textarea" id={props.name} {...props} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder || 'Select One';
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.value); } }
		if (this.props.value) { props.value = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Select id={props.name} {...props}>
								{props.placeholder ? <option value="">{props.placeholder}</option> : null}
								{this.props.data.options.map((option) => {
									const thisKey = `preview_${option.key}`;
									return <option value={option.value} key={thisKey}>{option.text}</option>;
								})}
							</Form.Select>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Form.Select id={props.name} {...props}>
								{props.placeholder ? <option value="">{props.placeholder}</option> : null}
								{this.props.data.options.map((option) => {
									const thisKey = `preview_${option.key}`;
									return <option value={option.value} key={thisKey}>{option.text}</option>;
								})}
							</Form.Select>
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class Signature extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultValue: props.defaultValue,
		};
		this.inputField = React.createRef();
		this.canvas = React.createRef();
	}

	clear = () => {
		if (this.state.defaultValue) {
			this.setState({ defaultValue: '' });
		} else if (this.canvas.current) {
			this.canvas.current.clear();
		}
	}

	_getSignatureImg = () => {
		const $canvas_sig = this.canvas.current;
		if ($canvas_sig) {
			const base64 = $canvas_sig.toDataURL().replace('data:image/png;base64,', '');
			const isEmpty = $canvas_sig.isEmpty();
			const $input_sig = this.inputField.current;
			const name = this.props.data.fieldName;

			if (isEmpty) {
				$input_sig.value = '';
				if (this.props.methods) {
					this.props.methods.setValue(name, '');
				}
			} else {
				$input_sig.value = base64;
				if (this.props.methods) {
					this.props.methods.setValue(name, base64);
				}
			}
		}
	}

	render() {
		const { defaultValue } = this.state;
		let canClear = !!defaultValue;
		const props = {};
		props.type = 'hidden';
		props.name = this.props.data.fieldName;
		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.value); } }
		if (this.props.value) { props.value = this.props.value; }

		if (this.props.mutable) {
			props.defaultValue = defaultValue;
			props.ref = this.inputField;
		}
		const padProps = {};
		// umd requires canvasProps={{ width: 400, height: 150 }}
		if (this.props.mutable) {
			padProps.defaultValue = defaultValue;
			padProps.ref = this.canvas;
			canClear = !this.props.readOnly;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		let sourceDataURL;
		if (defaultValue && defaultValue.length > 0) {
			sourceDataURL = `data:image/png;base64,${defaultValue}`;
		}

		padProps.canvasProps = {};

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.readOnly === true || !!sourceDataURL
						? (<img src={sourceDataURL} />)
						: (
							<div className="m-signature-pad">
								<div className="m-signature-pad--body">

									<SignaturePad {...padProps} onEnd={(e) => { this._getSignatureImg(); }} />
								</div>
								<div className="m-signature-pad--footer clearfix">
									{canClear && (<Button variant="default" size="sm" className='clear-signature float-end' onClick={this.clear} title="Clear Signature"><FaTimes /> clear</Button>)}
								</div>
							</div>
						)
					}
					{this.props.methods ? (<input {...this.props.methods.register(props.name)} {...props} />) : (<input {...props} />)}
				</Form.Group>
			</div>
		);
	}
}

class Tags2 extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
		const { defaultValue, data } = props;
		if (props.value) {
			this.state = { value: props.value };
		} else {
			this.state = { value: defaultValue };
		}
	}

	getDefaultValue(defaultValue, options) {
		if (defaultValue) {
			if (typeof defaultValue === 'string') {
				const vals = defaultValue.split(',').map(x => x.trim());
				return options.filter(x => vals.indexOf(x.value) > -1);
			}
			return options.filter(x => defaultValue.indexOf(x.value) > -1);
		}
		return [];
	}

	handleChange = (e) => {
		this.setState({ value: e.map(i => i.value).join(',') || null });

		if (this.props.onChange) {
			this.props.onChange(e ? e.map(i => i.value).join(',') : null);
		}
	};

	render() {
		const options = this.props.data.options.map(option => {
			option.label = option.text;
			return option;
		});
		const props = {};
		props.isMulti = true;
		props.name = this.props.data.fieldName;
		props.onChange = this.handleChange;


		//if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		//if (this.props.onBlur) { props.onBlur = this.props.onBlur; }

		props.options = options;
		if (!this.props.mutable) { props.value = options[0].text; } // to show a sample of what tags looks like
		if (this.props.mutable) {
			props.isDisabled = this.props.readOnly;
			props.value = this.getDefaultValue(this.state.value, options);
			props.ref = this.inputField;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
					<Select id={props.name} {...props} />

					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class Tags extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
		const { defaultValue, data } = props;
		if (props.value) {
			this.state = { value: props.value };
		} else {
			this.state = { value: defaultValue };
		}
	}

	getDefaultValue(defaultValue, options) {
		console.log(defaultValue)
		if (defaultValue) {
			if (typeof defaultValue === 'string') {
				const vals = defaultValue.split(',').map(x => x.trim());
				return options.filter(x => vals.indexOf(x.value) > -1);
			}
			return options.filter(x => defaultValue.indexOf(x.value) > -1);
		}
		return [];
	}

	handleChange = (selected) => {
		if (selected !== undefined && selected !== null && selected.length > 0) {
			this.setState({ value: selected.map(i => i.id).join(',') });

			if (this.props.onChange) {
				this.props.onChange(selected.map(i => i.id).join(','));
			}
		} else {
			this.setState({ value: [] });

			if (this.props.onChange) {
				this.props.onChange([]);
			}
		}
	};

	render() {
		const options = this.props.data.options.map((option) => {
			option.label = option.text;
			option.id = option.value;
			return option;
		});
		const props = {};
		props.multiple = true;
		props.name = this.props.data.fieldName;
		props.onChange = this.handleChange;
		props.placeholder = this.props.data.placeholder || 'Select...';
		props.required = this.props.data.required;

		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }

		props.options = options;
		if (this.props.mutable) {
			props.disabled = this.props.readOnly;
			props.selected = this.getDefaultValue(this.state.value, options);
			props.ref = this.inputField;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Typeahead labelKey={(option) => option.label} id={props.name} {...props} />
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Typeahead labelKey={(option) => option.label} id={props.name} {...props} />
						</>
					)}
					{this.props.data.help ? (<Form.Text muted>{this.props.data.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class Checkboxes extends React.Component {
	constructor(props) {
		super(props);
		this.options = {};
		this.checkedValues = [];
	}

	onCheckboxChange = (checkboxValue, event) => {
		if (this.props.onChange) {
			if (event.target.checked) {
				this.props.onChange(this.checkedValues.concat(checkboxValue));
			} else {
				this.props.onChange(this.checkedValues.filter((v) => v !== checkboxValue));
			}
		}
	}

	render() {
		const self = this;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.value) { this.checkedValues = this.props.value; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.data.options.map((option) => {
						const thisKey = `preview_${option.key}`;
						const props = {};
						props.name = `option_${option.key}`;


						if (self.props.data.inline) { props.inline = true; }

						props.value = option.value;
						if (self.props.mutable) {
							props.defaultChecked = self.props.defaultValue !== undefined && self.props.defaultValue.indexOf(option.key) > -1;
						}
						if (self.props.readOnly) { props.disabled = 'disabled'; }
						if (self.props.value) { props.checked = this.props.value.indexOf(option.value) > -1; }

						return (
							<Form.Check
								label={option.text}
								type="checkbox"
								key={thisKey}
								id={`fid_${thisKey}`}
								ref={c => {
									if (c && self.props.mutable) {
										self.options[`child_ref_${option.key}`] = c;
									}
								}}
								onChange={(e) => { self.onCheckboxChange(option.value, e); }}
								{...props}
							/>
						);
					})}
				</Form.Group>
			</div>
		);
	}
}

class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }
		const props = {};
		// eslint-disable-next-line no-undef
		props.name = this.props.data.fieldName;
		props.type = 'checkbox';
		props.defaultChecked = this.props.data.defaultChecked;
		if (this.props.mutable) {
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onChange = (e) => { this.props.onChange(e.target.checked); } }
		if (this.props.value) { props.checked = this.props.value; }
		if (this.props.isInvalid) { props.isInvalid = this.props.isInvalid; }
		if (this.props.onBlur) { props.onBlur = this.props.onBlur; }
		if (this.props.readOnly) { props.disabled = 'disabled'; }
		if (this.props.data.inline) { props.inline = true; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel className="form-label" {...this.props} />
					<Form.Check label={<span dangerouslySetInnerHTML={{ __html: this.props.data.boxLabel }} />} type="checkbox" id={this.props.data.fieldName} {...props} />
				</Form.Group>
			</div>
		);
	}
}

class RadioButtons extends React.Component {
	constructor(props) {
		super(props);
		this.options = {};
	}

	render() {
		const self = this;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.data.options.map((option) => {
						const thisKey = `preview_${option.key}`;
						const props = {};
						props.name = self.props.data.fieldName;

						props.value = option.value;
						if (self.props.mutable) {
							props.defaultChecked = (self.props.defaultValue !== undefined && self.props.defaultValue.indexOf(option.value) > -1);
						}

						if (self.props.onChange) { props.onChange = (e) => { self.props.onChange(e.target.value); } }
						if (self.props.value) { props.checked = self.props.value === option.value; }
						if (self.props.readOnly) { props.disabled = 'disabled'; }
						if (self.props.data.inline) { props.inline = true; }

						return (
							<Form.Check
								label={option.text}
								type="radio"
								key={thisKey}
								id={`fid_${thisKey}`}
								ref={c => {
									if (c && self.props.mutable) {
										self.options[`child_ref_${option.key}`] = c;
									}
								}}
								{...props}
							/>
						);
					})}
				</Form.Group>
			</div>
		);
	}
}

class Image extends React.Component {
	render() {
		const style = (this.props.data.center) ? { textAlign: 'center' } : null;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style, ...style }} className={baseClasses} >
				<ComponentHeader {...this.props} />
				{this.props.data.src && <ImageComponent src={this.props.data.src} width={this.props.data.width} height={this.props.data.height} />}
				{!this.props.data.src && <div className="no-image">No Image</div>}
			</div>
		);
	}
}

class Rating extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const props = {};
		props.name = this.props.data.fieldName;
		props.ratingAmount = 5;

		if (this.props.mutable) {
			props.rating = (this.props.defaultValue !== undefined) ? parseFloat(this.props.defaultValue, 10) : 0;
			props.editing = true;
			props.disabled = this.props.readOnly;
			props.ref = this.inputField;
		}

		if (this.props.onChange) { props.onRatingClick = (e, { rating }) => { this.props.onChange(rating); } }
		if (this.props.value) { props.rating = this.props.value; }
		if (this.props.readOnly) { props.disabled = true; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					<StarRating {...props} />
				</Form.Group>
			</div>
		);
	}
}

class HyperLink extends React.Component {
	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<Form.Label>
						<a target="_blank" href={this.props.data.href} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.data.content) }} />
					</Form.Label>
				</Form.Group>
			</div>
		);
	}
}

class Download extends React.Component {
	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<a href={`${this.props.downloadPath}?id=${this.props.data.filePath}`}>{this.props.data.content}</a>
				</Form.Group>
			</div>
		);
	}
}

class Camera extends React.Component {
	constructor(props) {
		super(props);
		this.state = { img: null, previewImg: null };
	}

	displayImage = (e) => {
		const self = this;
		const target = e.target;
		if (target.files && target.files.length) {
			self.setState({ img: target.files[0], previewImg: URL.createObjectURL(target.files[0]) });
			if (this.props.onChange) {
				this.props.onChange(target.files[0]);
			}
		}
	};

	clearImage = (e) => {
		this.setState({
			img: null,
			previewImg: null,
		});
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
		const imageStyle = { objectFit: 'scale-down', objectPosition: (this.props.data.center) ? 'center' : 'left' };
		let baseClasses = 'SortableItem rfb-item';
		const name = this.props.data.fieldName;
		const fileInputStyle = this.state.img ? { display: 'none' } : null;
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }
		let sourceDataURL;
		if (this.props.readOnly === true && this.props.defaultValue && this.props.defaultValue.length > 0) {
			if (this.props.defaultValue.indexOf(name > -1)) {
				sourceDataURL = this.props.defaultValue;
			} else {
				sourceDataURL = `data:image/png;base64,${this.props.defaultValue}`;
			}
		}

		if (this.props.value) { sourceDataURL = this.props.value; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.readOnly === true &&
						this.props.defaultValue &&
						this.props.defaultValue.length > 0 ? (
						<div>
							<ImageComponent
								style={imageStyle}
								src={sourceDataURL}
								{...this.getImageSizeProps(this.props.data)}
							/>
						</div>
					) : (
						<div className="image-upload-container">
							<div style={fileInputStyle}>
								<input
									name={name}
									type="file"
									accept="image/*"
									capture="camera"
									className="image-upload"
									onChange={this.displayImage}
								/>
								<div className="image-upload-control">
									<Button variant="light">
										<FaCamera /> Upload Photo
									</Button>
									<p>Select an image from your computer or device.</p>
								</div>
							</div>

							{this.state.img && (
								<div>
									<ImageComponent
										onLoad={() => URL.revokeObjectURL(this.state.previewImg)}
										src={this.state.previewImg}
										height="100"
										className="image-upload-preview"
									/>
									<br />
									<Button variant="default" size="sm" className="btn-image-clear" onClick={this.clearImage}>
										<FaTimes /> Clear Photo
									</Button>
								</div>
							)}
						</div>
					)}
				</Form.Group>
			</div>
		);
	}
}

class FileUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = { fileUpload: null };
	}

	displayFileUpload = (e) => {
		const self = this;
		const target = e.target;
		let file;

		if (target.files && target.files.length > 0) {
			file = target.files[0];

			self.setState({
				fileUpload: file,
			});

			if (this.props.onChange) {
				this.props.onChange(file);
			}
		}
	};

	clearFileUpload = () => {
		this.setState({
			fileUpload: null,
		});

		if (this.props.onChange) {
			this.props.onChange(null);
		}
	};

	saveFile = async (e) => {
		e.preventDefault();
		const sourceUrl = this.props.defaultValue;
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
			type: this.props.data.fileType || response.headers.get('Content-Type'),
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
		let baseClasses = 'SortableItem rfb-item';
		const name = this.props.data.fieldName;
		const fileInputStyle = this.state.fileUpload ? { display: 'none' } : null;
		if (this.props.data.pageBreakBefore) {
			baseClasses += ' alwaysbreak';
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.readOnly === true &&
						this.props.defaultValue &&
						this.props.defaultValue.length > 0 ? (
						<div>
							<Button variant="default" onClick={this.saveFile}>
								<FaDownload /> Download File
							</Button>
						</div>
					) : (
						<div className='image-upload-container'>
							<div style={fileInputStyle}>
								<input
									name={name}
									type='file'
									accept={this.props.data.fileType || '*'}
									className='image-upload'
									onChange={this.displayFileUpload}
								/>
								<div className='image-upload-control'>
									<Button variant="light">
										<FaFile /> Upload File
									</Button>
									<p>Select a file from your computer or device.</p>
								</div>
							</div>

							{this.state.fileUpload && (
								<div>
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
									<br />
									<Button variant="default" size="sm" className='btn-file-upload-clear' onClick={this.clearFileUpload}					>
										<FaTimes /> Clear File
									</Button>
								</div>
							)}
						</div>
					)}
				</Form.Group>
			</div>
		);
	}
}

class Range extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
		this.state = {
			value: props.defaultValue !== undefined ? parseInt(props.defaultValue, 10) : parseInt(props.data.defaultValue, 10),
		};
	}

	changeValue = (e) => {
		const { target } = e;
		this.setState({
			value: target.value,
		});

		if (this.props.onChange) {
			this.props.onChange(target.value);
		}
	}

	render() {
		const props = {};
		const name = this.props.data.fieldName;

		props.type = 'range';
		props.list = `tickmarks_${name}`;
		props.min = this.props.data.minValue;
		props.max = this.props.data.maxValue;
		props.step = this.props.data.step;

		props.value = this.state.value;
		props.onChange = this.changeValue;

		if (this.props.mutable) {
			props.ref = this.inputField;
		}

		const datalist = [];
		for (let i = parseInt(props.min, 10); i <= parseInt(props.max, 10); i += parseInt(props.step, 10)) {
			datalist.push(i);
		}

		const oneBig = 100 / (datalist.length - 1);

		const _datalist = datalist.map((d, idx) => <option key={`${props.list}_${idx}`}>{d}</option>);

		const visible_marks = datalist.map((d, idx) => {
			const option_props = {};
			let w = oneBig;
			if (idx === 0 || idx === datalist.length - 1) { w = oneBig / 2; }
			option_props.key = `${props.list}_label_${idx}`;
			option_props.style = { width: `${w}%` };
			if (idx === datalist.length - 1) { option_props.style = { width: `${w}%`, textAlign: 'right' }; }
			return <label {...option_props}>{d}</label>;
		});

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					<div className="range">
						<div className="clearfix">
							<span className="float-start">{this.props.data.minLabel}</span>
							<span className="float-end">{this.props.data.maxLabel}</span>
						</div>
						<RangeSlider {...props} />
					</div>
					<div className="visible_marks">
						{visible_marks}
					</div>
					<input name={name} value={this.state.value} type="hidden" />
					<datalist id={props.list}>
						{_datalist}
					</datalist>
				</Form.Group>
			</div>
		);
	}
}

SurveyElements.Header = Header;
SurveyElements.Paragraph = Paragraph;
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