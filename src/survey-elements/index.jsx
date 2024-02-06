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
import { Button, Col, Container, Form, Image as ImageComponent, Row } from 'react-bootstrap';
import { IMaskInput } from "react-imask";
import { Typeahead } from 'react-bootstrap-typeahead';
import ComponentErrorMessage from './component-error-message';
import { getIPAddress } from '../utils/ipUtils';
import moment from 'moment-timezone';

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
		let classNames = 'static';
		if (this.props.item.bold) { classNames += ' bold'; }
		if (this.props.item.italic) { classNames += ' italic'; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<h3 className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.item.content) }} />
			</div>
		);
	}
}

class ContentBody extends React.Component {
	render() {
		let classNames = 'static';

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<div className={classNames} dangerouslySetInnerHTML={{ __html: myContentXSS.process(this.props.item.content) }} />
			</div>
		);
	}
}

class Paragraph extends React.Component {
	render() {
		let classNames = 'static';
		if (this.props.item.bold) { classNames += ' bold'; }
		if (this.props.item.italic) { classNames += ' italic'; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<p className={classNames} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.item.content) }} />
			</div>
		);
	}
}

class Label extends React.Component {
	render() {
		let classNames = 'static';
		if (this.props.item.bold) { classNames += ' bold'; }
		if (this.props.item.italic) { classNames += ' italic'; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<label className={`${classNames} form-label`} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.item.content) }} />
			</div>
		);
	}
}

class LineBreak extends React.Component {
	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder;
		props.onChange = (event) => { this.props.onChange(event.target.value); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} type='text' {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} type='text' {...props} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder;
		props.onChange = (event) => { this.props.onChange(event.target.value); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} type='text' {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} type='text' {...props} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder;
		props.onChange = (val) => { this.props.onChange(val); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} type='text' {...props} as={CustomPhoneInput} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} type='text' {...props} as={CustomPhoneInput} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder;
		props.onChange = (val) => { this.props.onChange(val); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		props.formatMask = this.props.item.formatMask || 'MM/DD/YYYY';

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} type='text' {...props} as={CustomDateInput} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} type='text' {...props} as={CustomDateInput} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder;
		props.onChange = (event) => { this.props.onChange(event.target.value); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		props.min = this.props.item.minValue;
		props.max = this.props.item.maxValue;
		props.step = this.props.item.step;

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} type='number' {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control id={props.name} type='number' {...props} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder;
		props.onChange = (event) => { this.props.onChange(event.target.value); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control as="textarea" id={props.name} {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Control as="textarea" id={props.name} {...props} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder || 'Select One';
		props.onChange = (event) => { this.props.onChange(event.target.value); };
		props.value = this.props.value;
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.item.options.find((option) => option.value === (this.props.value))?.text}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Select id={props.name} {...props}>
								{props.placeholder ? <option value="">{props.placeholder}</option> : null}
								{this.props.item.options.map((option) => {
									const thisKey = `preview_${option.key}`;
									return <option value={option.value} key={thisKey}>{option.text}</option>;
								})}
							</Form.Select>
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Form.Select id={props.name} {...props}>
								{props.placeholder ? <option value="">{props.placeholder}</option> : null}
								{this.props.item.options.map((option) => {
									const thisKey = `preview_${option.key}`;
									return <option value={option.value} key={thisKey}>{option.text}</option>;
								})}
							</Form.Select>
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
				</Form.Group>
			</div>
		);
	}
}

class Signature extends React.Component {
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
			let date = moment().toISOString();

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

		padProps.canvasProps = { };

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

class Tags extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	getDefaultValue(val, options) {
		if (val) {
			return options.filter((option) => val.indexOf(option.value) > -1);
		}

		return [];
	}

	render() {
		const options = this.props.item.options.map((option) => {
			return {
				value: option.value,
				label: option.text,
				key: option.value
			};
		});

		const props = {};
		props.name = this.props.name;
		props.placeholder = this.props.item.placeholder || 'Select...';
		props.onChange = (val) => { this.props.onChange(val !== undefined && val !== null && val.length > 0 ? val.map((i) => i.value) : []); };
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		props.multiple = true;
		props.selected = this.getDefaultValue(this.props.value, options);
		props.options = options;
		// props.required = this.props.item.required;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		let labelLocation = 'ABOVE';
		if (this.props.item.labelLocation) { labelLocation = this.props.item.labelLocation; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.item.options.filter((option) => this.props.value.includes(option.value)).map((option) => option.text).join(', ')}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Typeahead labelKey={(option) => option.label} id={props.name} {...props} />
							<ComponentLabel {...this.props} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} htmlFor={props.name} />
							<Typeahead labelKey={(option) => option.label} id={props.name} {...props} />
						</>
					)}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
				</Form.Group>
			</div>
		);
	}
}

class Checkboxes extends React.Component {
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

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={this.props.name} />
						<div>{this.props.item.options.filter((option) => this.props.value.includes(option.value)).map((option) => option.text).join(', ')}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} htmlFor={this.props.name} />
					{this.props.item.options.map((option) => {
						const props = {};
						props.name = `option_${option.key}`;
						props.value = option.value;
						props.checked = self.props.value ? self.props.value.indexOf(option.value) > -1 : false;
						props.inline = self.props.item.inline ?? false;
						if (self.props.item.disabled) { props.disabled = 'disabled'; }

						return (
							<Form.Check
								label={option.text}
								type="checkbox"
								key={`preview_${option.key}`}
								id={`fid_preview_${option.key}`}
								ref={c => {
									if (c && self.props.item.mutable) {
										self.options[`child_ref_${option.key}`] = c;
									}
								}}
								onChange={(e) => { self.onCheckboxChange(option.value, e); }}
								{...props}
							/>
						);
					})}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={this.props.name} />
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
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }
		const props = {};
		// eslint-disable-next-line no-undef
		props.name = this.props.name;
		props.onChange = (event) => { this.props.onChange(event.target.checked); };
		props.isInvalid = this.props.isInvalid;
		props.onBlur = this.props.onBlur;
		props.autoComplete = "new-password";
		if (this.props.item.disabled) { props.disabled = 'disabled'; }
		if (this.props.item.mutable) { props.ref = this.inputField; }

		props.checked = this.props.value;
		props.inline = this.props.item.inline ?? false;

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
					<Form.Check label={<span dangerouslySetInnerHTML={{ __html: this.props.item.boxLabel }} />} type="checkbox" id={props.name} {...props} />
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
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

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.item.options.map((option) => {
						const props = {};
						props.name = self.props.name;
						props.value = option.value;
						props.checked = self.props.value === option.value;
						props.onChange = (event) => { self.props.onChange(event.target.value); };
						if (self.props.item.disabled) { props.disabled = 'disabled'; }
						props.inline = self.props.item.inline ?? false;

						return (
							<Form.Check
								label={option.text}
								type="radio"
								key={`preview_${option.key}`}
								id={`fid_preview_${option.key}`}
								ref={c => {
									if (c && self.props.item.mutable) {
										self.options[`child_ref_${option.key}`] = c;
									}
								}}
								{...props}
							/>
						);
					})}
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={this.props.name} />
				</Form.Group>
			</div>
		);
	}
}

class Image extends React.Component {
	render() {
		const style = (this.props.item.center) ? { textAlign: 'center' } : null;

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style, ...style }} className={baseClasses} >
				<ComponentHeader {...this.props} />
				{this.props.item.src && <ImageComponent src={this.props.item.src} width={this.props.item.width} height={this.props.item.height} />}
				{!this.props.item.src && <div className="no-image">No Image</div>}
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
		props.name = this.props.name;
		props.ratingAmount = 5;
		props.rating = this.props.value !== undefined && this.props.value !== null && this.props.value !== '' ? parseFloat(this.props.value, 10) : 0;
		props.disabled = this.props.item.readOnly;
		if (this.props.item.disabled) { props.disabled = true; }
		props.onRatingClick = (event, { rating }) => { this.props.onChange(rating); };

		if (this.props.item.mutable) {
			props.editing = true;
			props.ref = this.inputField;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.item.print === true) {
			return (
				<div style={{ ...this.props.style }} className={baseClasses}>
					<Form.Group className="form-group mb-3">
						<ComponentLabel {...this.props} htmlFor={props.name} />
						<div>{this.props.value}</div>
					</Form.Group>
				</div>
			);
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} htmlFor={props.name} />
					<StarRating {...props} />
					{this.props.item.help ? (<Form.Text muted>{this.props.item.help}</Form.Text>) : null}
					<ComponentErrorMessage name={props.name} />
				</Form.Group>
			</div>
		);
	}
}

class HyperLink extends React.Component {
	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<Form.Label>
						<a target="_blank" href={this.props.item.href} dangerouslySetInnerHTML={{ __html: myxss.process(this.props.item.content) }} />
					</Form.Label>
				</Form.Group>
			</div>
		);
	}
}

class Download extends React.Component {
	render() {
		let baseClasses = 'SortableItem rfb-item';
		if (this.props.item.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<a href={`${this.props.downloadPath}?id=${this.props.item.filePath}`}>{this.props.item.content}</a>
				</Form.Group>
			</div>
		);
	}
}

class Camera extends React.Component {
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
		props.onBlur = this.props.onBlur;
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
								<div className="image-upload-control">
									<Button variant="light">
										<FaCamera /> Upload Photo
									</Button>
									<span>Select an image from your computer or device.</span>
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

class FileUpload extends React.Component {
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
		props.onBlur = this.props.onBlur;
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

class Range extends React.Component {
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
