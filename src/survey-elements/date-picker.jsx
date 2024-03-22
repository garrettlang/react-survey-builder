import React from 'react';
import { format, parse } from 'date-fns';
import ComponentHeader from './component-header';
import ComponentLabel from './component-label';
import { Form, InputGroup } from 'react-bootstrap';

// This is the utility function that will attempt to parse a date string
// using several different formats until it finds one that works.
class DatePicker extends React.Component {
	constructor(props) {
		super(props);
		this.inputField = React.createRef();

		const { formatMask } = DatePicker.updateFormat(props, null);
		const state = DatePicker.updateDateTime(props, { formatMask }, formatMask);

		// Ensure state.value and state.internalValue are not undefined
		state.value = state.value || '';
		state.internalValue = state.internalValue || '';

		this.state = state;
	}

	static updateDateTime(props, state, formatMask) {
		let value;
		let internalValue;
		const { defaultToday } = props.data;
		const iOSFormatMask = 'yyyy-MM-dd';
		if (defaultToday && (props.defaultValue === '' || props.defaultValue === undefined)) {
			const dateToFormat = new Date();
			value = dateToFormat.toString() === 'Invalid Date' ? '' : format(dateToFormat, iOSFormatMask);
			internalValue = dateToFormat.toString() === 'Invalid Date' ? '' : dateToFormat; // Ensure not undefined
		} else {
			value = props.defaultValue || ''; // Ensure not undefined
			if (value === '') {
				internalValue = '';
			} else {
				const parsedDate = parse(value, formatMask, new Date());
				internalValue = parsedDate.toString() === 'Invalid Date' ? '' : parsedDate; // Ensure not undefined
			}
		}
		return {
			value,
			internalValue,
			placeholder: formatMask.toLowerCase(),
			defaultToday,
			formatMask,
		};
	}

	handleBirthdayFocus() {
		this.setState({
			birthdayFocused: true,
		}, () => {
			document.getElementById('year').placeholder = 'YYYY';
			document.getElementById('day').placeholder = 'DD';
			document.getElementById('month').placeholder = 'MM';
		});
	}

	handleDateChange(event) {
		const { month, day, year } = this.state;
		const newValue = event.target.value;

		switch (event.target.name) {
			case 'month':
				if (newValue > 12) {
					this.setState({ month: '12' });
				} else {
					this.setState({ month: newValue });
				}
				break;
			case 'day':
				if (newValue > 31) {
					this.setState({ day: '31' });
				} else {
					this.setState({ day: newValue });
				}
				break;
			case 'year':
				if (newValue > new Date().getFullYear()) {
					this.setState({ year: new Date().getFullYear().toString() });
				} else {
					this.setState({ year: newValue });
				}
				break;
			default:
				break;
		}

		const updatedMonth = event.target.name === 'month' ? newValue : month;
		const updatedDay = event.target.name === 'day' ? newValue : day;
		const updatedYear = event.target.name === 'year' ? newValue : year;

		this.setState({
			value: {
				year: updatedYear,
				month: updatedMonth,
				day: updatedDay,
			}
		});
	}

	static updateFormat(props, oldFormatMask) {
		const { showTimeSelect, showTimeSelectOnly, showTimeInput } = props.data;
		const dateFormat = showTimeSelect && showTimeSelectOnly ? '' : props.data.dateFormat;
		const timeFormat = (showTimeSelect || showTimeInput) ? props.data.timeFormat : '';
		const formatMask = (`${dateFormat} ${timeFormat}`).trim();
		const updated = formatMask !== oldFormatMask;

		return { updated, formatMask };
	}

	static getDerivedStateFromProps(props, state) {
		const { updated, formatMask } = DatePicker.updateFormat(props, state.formatMask);
		if ((props.data.defaultToday !== state.defaultToday) || updated) {
			return DatePicker.updateDateTime(props, state, formatMask);
		}
		return null;
	}

	render() {
		const { placeholder } = this.props.data;
		const props = {};
		props.type = 'date';
		props.className = 'form-control';
		props.name = this.props.data.fieldName;
		const readOnly = this.props.data.readOnly || this.props.readOnly;
		this.state.formatMask.toLowerCase();
		if (this.props.mutable) {
			props.defaultValue = this.props.defaultValue;
			props.ref = this.inputField;
		}

		let baseClasses = 'SortableItem rfb-item';
		if (this.props.data.pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div className={baseClasses} style={{ ...this.props.style }}>
				<ComponentHeader {...this.props} />
				<Form.Group>
					<ComponentLabel {...this.props} />
					<div>
						{readOnly &&
							<Form.Control type="text"
								name={props.name}
								ref={props.ref}
								readOnly={readOnly}
								placeholder={placeholder || this.state.placeholder}
								value={this.state.value}
								 />
						}
						{!readOnly &&
							<InputGroup style={{ border: '1px solid #ced4da', borderRadius: '0.25rem', marginTop: 10 }}>
								<Form.Control value={this.state.month} onKeyUp={(e) => e.target.value && e.target.value.length === 2 && document.getElementById('day').focus()} name="month" id="month" onChange={(e) => this.handleDateChange(e)} type="text" style={{ border: 'none' }} onFocus={(e) => this.handleBirthdayFocus()} placeholder={placeholder || this.state.placeholder} maxLength="2" pattern="\d*" />
								{this.state.birthdayFocused &&
									<>
										<span style={{ display: this.state.year || this.state.day || this.state.month ? '' : 'none', alignSelf: 'center' }}>/</span>
										<Form.Control value={this.state.day} onKeyUp={(e) => e.target.value && e.target.value.length === 2 && document.getElementById('year').focus()} name="day" id="day" type="text" style={{ border: 'none' }} onChange={(e) => this.handleDateChange(e)} onFocus={(e) => this.handleBirthdayFocus()} maxLength="2" pattern="\d*" />
										<span style={{ display: this.state.year || this.state.day || this.state.month ? '' : 'none', alignSelf: 'center' }}>/</span>
										<Form.Control value={this.state.year} name="year" id="year" type="text" style={{ border: 'none' }} onFocus={(e) => this.handleBirthdayFocus()} maxLength="4" pattern="\d*" onChange={(e) => this.handleDateChange(e)} />
									</>
								}
							</InputGroup>
						}
					</div>
				</Form.Group>
			</div>
		);
	}
}
export default DatePicker;
