import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { range } from 'lodash';

function DatePickerComponent(props) {
	const { showTimeInput, dateFormat, selected, onChange, isClearable, portalId } = props;
	const ButtonDatePicker = ({ value, onClick }) => (
		<button type="button" className="form-control" style={{ minWidth: 140, textAlign: 'left' }} onClick={onClick}>
			{value || 'mm/dd/yyyy'}
		</button>
	);
	const years = range(2010, new Date().getFullYear() + 10, 1);
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	return (
		<ReactDatePicker
			name={props.name}
			ref={props.ref}
			selected={selected}
			onChange={date => onChange(date)}
			todayButton={'Today'}
			className="form-control"
			showTimeSelect={props.showTimeSelect}
			showTimeSelectOnly={props.showTimeSelectOnly}
			showTimeInput={showTimeInput}
			autoComplete="off"
			placeholderText={props.placeholderText}
			portalId={portalId}
			dateFormat={dateFormat}
			isClearable={isClearable}
			customInput={<ButtonDatePicker />}
			renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
				<div>
					<button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} type="button">
						{'<'}
					</button>
					<select value={date.getFullYear()} onChange={({ target: { value } }) => changeYear(value)}>
						{years.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>

					<select value={months[date.getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
						{months.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>

					<button onClick={increaseMonth} disabled={nextMonthButtonDisabled} type="button">
						{'>'}
					</button>
				</div>
			)}
		/>
	);
}

export default DatePickerComponent;
