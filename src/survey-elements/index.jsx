// eslint-disable-next-line max-classes-per-file
import fetch from 'isomorphic-fetch';
import { saveAs } from 'file-saver';
import React from 'react';
import Select from 'react-select';
import SignaturePad from 'react-signature-canvas';
import RangeSlider from 'react-bootstrap-range-slider';

import StarRating from './star-rating';
import DatePicker from './date-picker';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import myxss from './myxss';
import { FaCamera, FaDownload, FaFile, FaTimes } from 'react-icons/fa';
import { Button, Form } from 'react-bootstrap';
import { IMaskInput } from "react-imask";

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
		//props.className = 'form-control';
		props.name = this.props.data.fieldName;
		props.help = this.props.data.help;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

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
					{props.help ? (<Form.Text muted>{props.help}</Form.Text>) : null}
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
		// props.className = 'form-control';
		props.name = this.props.data.fieldName;
		props.help = this.props.data.help;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

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
					{props.help ? (<Form.Text muted>{props.help}</Form.Text>) : null}
				</Form.Group>
			</div>
		);
	}
}

class PhoneNumber extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
		const { defaultValue, data } = props;
		this.state = { value: defaultValue };
	}

	handleChange = (e) => {
		this.setState({ value: e });
	};

	render() {
		const props = {};
		props.type = 'tel';
		props.className = 'form-control';
		props.name = this.props.data.fieldName;
		props.help = this.props.data.help;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					{labelLocation === "FLOATING" ? (
						<Form.Floating>
							<Form.Control id={props.name} {...props} onChange={this.handleChange} as={CustomPhoneInput} />
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
						</Form.Floating>
					) : (
						<>
							<ComponentLabel {...this.props} name={props.name} htmlFor={props.name} />
							<Form.Control id={props.name} {...props} onChange={this.handleChange} as={CustomPhoneInput} />
						</>
					)}
					{props.help ? (<Form.Text muted>{props.help}</Form.Text>) : null}
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
		props.help = this.props.data.help;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		props.min = this.props.data.minValue;
		props.max = this.props.data.maxValue;
		props.step = this.props.data.step;

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

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
					{props.help ? (<Form.Text muted>{props.help}</Form.Text>) : null}
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
		props.help = this.props.data.help;
		props.placeholder = this.props.data.placeholder ?? myxss.process(this.props.data.label);
		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

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
					{props.help ? (<Form.Text muted>{props.help}</Form.Text>) : null}
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
		//props.className = 'form-select';
		props.name = this.props.data.fieldName;
		props.placeholder = this.props.data.placeholder;
		props.help = this.props.data.help;
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		let labelLocation = 'ABOVE';
		if (this.props.data.labelLocation) { labelLocation = this.props.data.labelLocation; }

		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

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
					{props.help ? (<Form.Text muted>{props.help}</Form.Text>) : null}
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

	render() {
		const { defaultValue } = this.state;
		let canClear = !!defaultValue;
		const props = {};
		props.type = 'hidden';
		props.name = this.props.data.fieldName;

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

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.readOnly === true || !!sourceDataURL
						? (<img src={sourceDataURL} />)
						: (<SignaturePad {...padProps} />)
					}
					{canClear && (
						<FaTimes className='clear-signature' onClick={this.clear} title="Clear Signature" />)}
					<input {...props} />
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
		this.state = { value: this.getDefaultValue(defaultValue, data.options) };
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

	// state = { value: this.props.defaultValue !== undefined ? this.props.defaultValue.split(',') : [] };

	handleChange = (e) => {
		this.setState({ value: e || [] });
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

		props.options = options;
		if (!this.props.mutable) { props.value = options[0].text; } // to show a sample of what tags looks like
		if (this.props.mutable) {
			props.isDisabled = this.props.readOnly;
			props.value = this.state.value;
			props.ref = this.inputField;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					<Select {...props} />
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

	render() {
		const self = this;
		let classNames = '';// 'custom-control custom-checkbox';
		if (this.props.data.inline) { classNames += ' option-inline'; }

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
						props.name = `option_${option.key}`;

						props.type = 'checkbox';
						props.value = option.value;
						if (self.props.mutable) {
							props.defaultChecked = self.props.defaultValue !== undefined && self.props.defaultValue.indexOf(option.key) > -1;
						}
						if (this.props.readOnly) {
							props.disabled = 'disabled';
						}
						return (
							<Form.Check label={option.text} className={classNames} type="checkbox" key={thisKey} id={`fid_${thisKey}`}
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

class Checkbox extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	render() {
		const classNames = ''; // 'custom-control custom-checkbox';
		// if (this.props.data.inline) { classNames += ' option-inline'; }

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
		if (this.props.readOnly) {
			props.disabled = 'disabled';
		}

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
		let classNames = '';// 'custom-control custom-radio';
		if (this.props.data.inline) { classNames += ' option-inline'; }

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

						props.type = 'radio';
						props.value = option.value;
						if (self.props.mutable) {
							props.defaultChecked = (self.props.defaultValue !== undefined &&
								(self.props.defaultValue.indexOf(option.key) > -1 || self.props.defaultValue.indexOf(option.value) > -1));
						}
						if (this.props.readOnly) {
							props.disabled = 'disabled';
						}

						return (
							<Form.Check label={option.text} className={classNames} type="radio" key={thisKey} id={`fid_${thisKey}`}
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
				{this.props.data.src && <img src={this.props.data.src} width={this.props.data.width} height={this.props.data.height} />}
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
		}
	};

	clearImage = () => {
		this.setState({
			img: null,
			previewImg: null,
		});
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

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<Form.Group className="form-group mb-3">
					<ComponentLabel {...this.props} />
					{this.props.readOnly === true &&
						this.props.defaultValue &&
						this.props.defaultValue.length > 0 ? (
						<div>
							<img
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
									<img
										onLoad={() => URL.revokeObjectURL(this.state.previewImg)}
										src={this.state.previewImg}
										height="100"
										className="image-upload-preview"
									/>
									<br />
									<Button className="btn-image-clear" onClick={this.clearImage}>
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
		}
	};

	clearFileUpload = () => {
		this.setState({
			fileUpload: null,
		});
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
									<Button className='btn-file-upload-clear' onClick={this.clearFileUpload}					>
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
