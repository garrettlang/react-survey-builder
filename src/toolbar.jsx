/**
  * <Toolbar />
  */

import React from 'react';
import { injectIntl } from 'react-intl';
import ToolbarItem from './toolbar-draggable-item';
import ToolbarGroupItem from './toolbar-group-item';
import ID from './UUID';
import store from './stores/store';
import { groupBy } from './functions';
import { FaArrowsAltH, FaBars, FaCamera, FaCaretSquareDown, FaCheckSquare, FaColumns, FaEnvelope, FaFile, FaFont, FaHeading, FaLink, FaParagraph, FaPenSquare, FaPhone, FaPlus, FaRegCalendarAlt, FaRegDotCircle, FaRegImage, FaSlidersH, FaStar, FaTags, FaTextHeight } from 'react-icons/fa';

// function isDefaultItem(item) {
//   const keys = Object.keys(item);
//   return keys.filter(x => x !== 'element' && x !== 'key' && x !== 'groupName').length === 0;
// }

function buildItems(items, defaultItems) {
	if (!items) {
		return defaultItems;
	}
	return items.map(x => {
		let found = defaultItems.find(y => (x.element === y.element && y.key === x.key));
		if (!found) {
			found = defaultItems.find(y => (x.element || x.key) === (y.element || y.key));
		}
		if (found) {
			if (x.inherited !== false) {
				found = { ...found, ...x };
			} else if (x.groupName) {
				found.groupName = x.groupName;
			}
		}
		return found || x;
	});
}

function buildGroupItems(allItems) {
	const items = allItems.filter(x => !x.groupName);
	const gItems = allItems.filter(x => !!x.groupName);
	const grouped = groupBy(gItems, x => x.groupName);
	const groupKeys = gItems.map(x => x.groupName)
		.filter((v, i, self) => self.indexOf(v) === i);
	return { items, grouped, groupKeys };
}

class Toolbar extends React.Component {
	constructor(props) {
		super(props);
		const { intl } = this.props;
		const items = buildItems(props.items, this._defaultItems(intl));
		this.state = {
			items,
		};
		this.create = this.create.bind(this);
	}

	componentDidMount() {
		store.subscribe(state => this.setState({ store: state }));
	}

	static _defaultItemOptions(element, intl) {
		switch (element) {
			case 'Dropdown':
				return [
					{ value: 'place_holder_option_1', text: intl.formatMessage({ id: 'place-holder-option-1' }), key: `dropdown_option_${ID.uuid()}` },
					{ value: 'place_holder_option_2', text: intl.formatMessage({ id: 'place-holder-option-2' }), key: `dropdown_option_${ID.uuid()}` },
					{ value: 'place_holder_option_3', text: intl.formatMessage({ id: 'place-holder-option-3' }), key: `dropdown_option_${ID.uuid()}` },
				];
			case 'Tags':
				return [
					{ value: 'place_holder_tag_1', text: intl.formatMessage({ id: 'place-holder-tag-1' }), key: `tags_option_${ID.uuid()}` },
					{ value: 'place_holder_tag_2', text: intl.formatMessage({ id: 'place-holder-tag-2' }), key: `tags_option_${ID.uuid()}` },
					{ value: 'place_holder_tag_3', text: intl.formatMessage({ id: 'place-holder-tag-3' }), key: `tags_option_${ID.uuid()}` },
				];
			case 'Checkboxes':
				return [
					{ value: 'place_holder_option_1', text: intl.formatMessage({ id: 'place-holder-option-1' }), key: `checkboxes_option_${ID.uuid()}` },
					{ value: 'place_holder_option_2', text: intl.formatMessage({ id: 'place-holder-option-2' }), key: `checkboxes_option_${ID.uuid()}` },
					{ value: 'place_holder_option_3', text: intl.formatMessage({ id: 'place-holder-option-3' }), key: `checkboxes_option_${ID.uuid()}` },
				];
			case 'RadioButtons':
				return [
					{ value: 'place_holder_option_1', text: intl.formatMessage({ id: 'place-holder-option-1' }), key: `radiobuttons_option_${ID.uuid()}` },
					{ value: 'place_holder_option_2', text: intl.formatMessage({ id: 'place-holder-option-2' }), key: `radiobuttons_option_${ID.uuid()}` },
					{ value: 'place_holder_option_3', text: intl.formatMessage({ id: 'place-holder-option-3' }), key: `radiobuttons_option_${ID.uuid()}` },
				];
			default:
				return [];
		}
	}

	_defaultItems(intl) {
		return [
			{
				key: 'Header',
				name: intl.formatMessage({ id: 'header-text' }),
				icon: FaHeading,
				static: true,
				content: intl.formatMessage({ id: 'place-holder-text' }),
			},
			{
				key: 'Label',
				name: intl.formatMessage({ id: 'label' }),
				static: true,
				icon: FaFont,
				content: intl.formatMessage({ id: 'place-holder-text' }),
			},
			{
				key: 'Paragraph',
				name: intl.formatMessage({ id: 'paragraph' }),
				static: true,
				icon: FaParagraph,
				content: intl.formatMessage({ id: 'place-holder-text' }),
			},
			{
				key: 'LineBreak',
				name: intl.formatMessage({ id: 'line-break' }),
				static: true,
				icon: FaArrowsAltH,
			},
			{
				key: 'Dropdown',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'dropdown' }),
				icon: FaCaretSquareDown,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'dropdown_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				options: [],
				placeholder: 'Select One',
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'ARRAY'
			},
			{
				key: 'Tags',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'tags' }),
				icon: FaTags,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'tags_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				options: [],
				placeholder: 'Select...',
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'ARRAY'
			},
			{
				key: 'Checkboxes',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'checkboxes' }),
				icon: FaCheckSquare,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'checkboxes_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				options: [],
				hideRequiredAlert: true,
				answerType: 'ARRAY'
			},
			{
				key: 'Checkbox',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'checkbox' }),
				icon: FaCheckSquare,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'checkbox_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				boxLabel: 'Agree To Rules & Regs',
				hideRequiredAlert: true,
				answerType: 'BOOLEAN'
			},
			{
				key: 'RadioButtons',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'multiple-choice' }),
				icon: FaRegDotCircle,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'radiobuttons_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				options: [],
				hideRequiredAlert: true,
				answerType: 'STRING'
			},
			{
				key: 'TextInput',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'text-input' }),
				label: intl.formatMessage({ id: 'place-holder-label' }),
				icon: FaFont,
				fieldName: 'text_input_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				placeholder: intl.formatMessage({ id: 'place-holder-label' }),
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'STRING'
			},
			{
				key: 'EmailInput',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'email-input' }),
				label: intl.formatMessage({ id: 'place-holder-email' }),
				icon: FaEnvelope,
				fieldName: 'email_input_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				placeholder: intl.formatMessage({ id: 'place-holder-email' }),
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'STRING'
			},
			{
				key: 'PhoneNumber',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'phone-input' }),
				label: intl.formatMessage({ id: 'place-holder-phone-number' }),
				icon: FaPhone,
				fieldName: 'phone_input_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'STRING'
			},
			{
				key: 'DatePicker',
				canDefaultToday: true,
				canReadOnly: true,
				dateFormat: 'MM/DD/YYYY',
				timeFormat: 'hh:mm aa',
				showTimeSelect: false,
				showTimeSelectOnly: false,
				showTimeInput: false,
				name: intl.formatMessage({ id: 'date' }),
				icon: FaRegCalendarAlt,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'date_picker_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'STRING'
			},
			{
				key: 'TextArea',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'multi-line-input' }),
				label: intl.formatMessage({ id: 'place-holder-label' }),
				icon: FaTextHeight,
				fieldName: 'text_area_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'STRING'
			},
			{
				key: 'NumberInput',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'number-input' }),
				label: intl.formatMessage({ id: 'place-holder-label' }),
				icon: FaPlus,
				fieldName: 'number_input_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				step: 1,
				minValue: 0,
				maxValue: 5,
				hideRequiredAlert: true,
				showLabelLocationPicker: true,
				answerType: 'NUMBER'
			},
			{
				key: 'Rating',
				canHaveAnswer: true,
				name: intl.formatMessage({ id: 'rating' }),
				label: intl.formatMessage({ id: 'place-holder-label' }),
				icon: FaStar,
				fieldName: 'rating_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				answerType: 'NUMBER'
			},
			{
				key: 'Range',
				name: intl.formatMessage({ id: 'range' }),
				icon: FaSlidersH,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'range_',
				step: 1,
				defaultValue: 3,
				minValue: 1,
				maxValue: 5,
				minLabel: intl.formatMessage({ id: 'easy' }),
				maxLabel: intl.formatMessage({ id: 'difficult' }),
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				hideRequiredAlert: true,
				answerType: 'NUMBER'
			},
			{
				key: 'Signature',
				canReadOnly: true,
				name: intl.formatMessage({ id: 'signature' }),
				icon: FaPenSquare,
				label: intl.formatMessage({ id: 'signature' }),
				fieldName: 'signature_',
				showCustomName: true,
				showDescription: true,
				showHelp: true,
				hideRequiredAlert: true,
				answerType: 'IMAGE'
			},
			{
				key: 'Camera',
				name: intl.formatMessage({ id: 'camera' }),
				icon: FaCamera,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'camera_',
				answerType: 'IMAGE'
			},
			{
				key: 'FileUpload',
				name: intl.formatMessage({ id: 'file-upload' }),
				icon: FaFile,
				label: intl.formatMessage({ id: 'place-holder-label' }),
				fieldName: 'file_upload_',
				answerType: 'FILE'
			},
			{
				key: 'FieldSet',
				canHaveAnswer: false,
				name: intl.formatMessage({ id: 'fieldset' }),
				label: intl.formatMessage({ id: 'fieldset' }),
				icon: FaBars,
				fieldName: 'fieldset-element',
			},
			
			{
				key: 'Image',
				name: intl.formatMessage({ id: 'image' }),
				label: '',
				icon: FaRegImage,
				fieldName: 'image_',
				src: '',
			},
			{
				key: 'HyperLink',
				name: intl.formatMessage({ id: 'website' }),
				icon: FaLink,
				static: true,
				content: intl.formatMessage({ id: 'place-holder-website-link' }),
				href: 'http://www.example.com',
			},
			{
				key: 'Download',
				name: intl.formatMessage({ id: 'file-attachment' }),
				icon: FaFile,
				static: true,
				content: intl.formatMessage({ id: 'place-holder-file-name' }),
				fieldName: 'download_',
				filePath: '',
				_href: '',
			},
			{
				key: 'TwoColumnRow',
				canHaveAnswer: false,
				name: intl.formatMessage({ id: 'two-columns-row' }),
				label: '',
				icon: FaColumns,
				fieldName: 'two_col_row_',
			},
			{
				key: 'ThreeColumnRow',
				canHaveAnswer: false,
				name: intl.formatMessage({ id: 'three-columns-row' }),
				label: '',
				icon: FaColumns,
				fieldName: 'three_col_row_',
			},
			{
				key: 'FourColumnRow',
				element: 'MultiColumnRow',
				canHaveAnswer: false,
				name: intl.formatMessage({ id: 'four-columns-row' }),
				label: '',
				icon: FaColumns,
				fieldName: 'four_col_row_',
				colCount: 4,
				className: 'col-md-3',
			},
			{
				key: 'FiveColumnRow',
				element: 'MultiColumnRow',
				canHaveAnswer: false,
				name: intl.formatMessage({ id: 'five-columns-row' }),
				label: '',
				icon: FaColumns,
				fieldName: 'five_col_row_',
				colCount: 5,
				className: 'col',
			},
			{
				key: 'SixColumnRow',
				element: 'MultiColumnRow',
				canHaveAnswer: false,
				name: intl.formatMessage({ id: 'six-columns-row' }),
				label: '',
				icon: FaColumns,
				fieldName: 'six_col_row_',
				colCount: 6,
				className: 'col-md-2',
			},
		];
	}

	addCustomOptions(item, elementOptions) {
		if (item.type === 'custom') {
			const customOptions = { ...item, ...elementOptions };
			customOptions.custom = true;
			customOptions.component = item.component || null;
			customOptions.customOptions = item.customOptions || [];
			return customOptions;
		}
		return elementOptions;
	}

	create(item) {
		const { intl } = this.props;
		const element = item.element || item.key;

		const elementOptions = this.addCustomOptions(item, {
			id: ID.uuid(),
			element,
			text: item.name,
			groupName: item.groupName,
			static: item.static,
			required: false,
			showDescription: item.showDescription,
			hideRequiredAlert: item.hideRequiredAlert,
		});

		if (this.props.showDescription === true && !item.static) {
			elementOptions.showDescription = true;
		}

		// add placeholder to form input
		if (['NumberInput', 'EmailInput', 'TextInput', 'PhoneNumber', 'TextArea', 'DatePicker', 'Dropdown', 'Tags'].indexOf(element) !== -1) {
			elementOptions.showPlaceholder = true;
		}

		elementOptions.placeholder = item.placeholder;

		if (item.type === 'custom') {
			elementOptions.key = item.key;
			elementOptions.custom = true;
			elementOptions.forwardRef = item.forwardRef;
			elementOptions.bare = item.bare;
			elementOptions.props = item.props;
			elementOptions.component = item.component || null;
			elementOptions.customOptions = item.customOptions || [];
		}

		if (item.static) {
			elementOptions.bold = false;
			elementOptions.italic = false;
		}
		elementOptions.showCustomName = item.showCustomName;
		elementOptions.customName = item.customName;

		elementOptions.showLabelLocationPicker = item.showLabelLocationPicker;
		elementOptions.labelLocation = item.labelLocation;

		elementOptions.showHelp = item.showHelp;
		elementOptions.help = item.help;

		elementOptions.hideRequiredAlert = item.hideRequiredAlert;

		if (item.canHaveAnswer) { elementOptions.canHaveAnswer = item.canHaveAnswer; }

		if (item.canReadOnly) { elementOptions.readOnly = false; }

		if (item.canDefaultToday) { elementOptions.defaultToday = false; }

		if (item.content) { elementOptions.content = item.content; }

		if (item.href) { elementOptions.href = item.href; }

		if (item.inherited !== undefined) { elementOptions.inherited = item.inherited; }

		elementOptions.canHavePageBreakBefore = item.canHavePageBreakBefore !== false;
		elementOptions.canHaveAlternateForm = item.canHaveAlternateForm !== false;
		elementOptions.canHaveDisplayHorizontal = item.canHaveDisplayHorizontal !== false;
		if (elementOptions.canHaveDisplayHorizontal) {
			elementOptions.inline = item.inline;
		}
		elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect !== false;
		elementOptions.canHaveOptionValue = item.canHaveOptionValue !== false;
		elementOptions.canPopulateFromApi = item.canPopulateFromApi !== false;

		if (item.className) {
			elementOptions.className = item.className;
		}

		if (element === 'Image') {
			elementOptions.src = item.src;
		}

		if (element === 'DatePicker') {
			elementOptions.dateFormat = item.dateFormat;
			elementOptions.timeFormat = item.timeFormat;
			elementOptions.showTimeSelect = item.showTimeSelect;
			elementOptions.showTimeSelectOnly = item.showTimeSelectOnly;
			elementOptions.showTimeInput = item.showTimeInput;
		}

		if (element === 'Download') {
			elementOptions._href = item._href;
			elementOptions.filePath = item.filePath;
		}

		if (element === 'NumberInput') {
			elementOptions.step = item.step;
			elementOptions.minValue = item.minValue;
			elementOptions.maxValue = item.maxValue;
		}

		if (element === 'Range') {
			elementOptions.step = item.step;
			elementOptions.defaultValue = item.defaultValue;
			elementOptions.minValue = item.minValue;
			elementOptions.maxValue = item.maxValue;
			elementOptions.minLabel = item.minLabel;
			elementOptions.maxLabel = item.maxLabel;
		}

		if (element === 'MultiColumnRow') {
			elementOptions.colCount = item.colCount;
		}

		if (item.defaultValue) { elementOptions.defaultValue = item.defaultValue; }

		if (item.fieldName) { elementOptions.fieldName = item.fieldName + ID.uuid(); }
		if (item.customName) { elementOptions.fieldName = item.customName; }

		if (item.label) { elementOptions.label = item.label.trim(); }

		if (item.options) {
			if (item.options.length > 0) {
				elementOptions.options = item.options.map(x => ({ ...x, key: `custom_option_${ID.uuid()}` }));
			} else {
				elementOptions.options = Toolbar._defaultItemOptions(elementOptions.element, intl);
			}
		}

		return elementOptions;
	}

	_onClick(item) {
		// ElementActions.createElement(this.create(item));
		store.dispatch('create', this.create(item));
	}

	renderItem = (item) => (<ToolbarItem item={item} key={item.key} onClick={this._onClick.bind(this, item)} onCreate={this.create} />)

	render() {
		const { items, grouped, groupKeys } = buildGroupItems(this.state.items);
		return (
			<div className="react-survey-builder-toolbar">
				<h4>{this.props.intl.formatMessage({ id: 'toolbox' })}</h4>
				<ul>
					{items.map(this.renderItem)}
					{
						groupKeys.map(k => <ToolbarGroupItem key={k} name={k} group={grouped.get(k)} renderItem={this.renderItem} />)
					}
				</ul>
			</div>
		);
	}
}

export default injectIntl(Toolbar);
