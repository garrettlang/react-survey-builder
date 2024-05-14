import React from 'react';
import ToolbarItem from './toolbar-draggable-item';
import ToolbarGroupItem from './toolbar-group-item';
import store from './stores/store';
import { FaArrowsAltH, FaBars, FaCamera, FaCaretSquareDown, FaCheckSquare, FaColumns, FaEnvelope, FaFile, FaFont, FaHeading, FaLink, FaParagraph, FaPenSquare, FaPhone, FaPlus, FaRegCalendarAlt, FaRegDotCircle, FaRegImage, FaSlidersH, FaStar, FaTags, FaTextHeight } from 'react-icons/fa';
import { PiFileHtml } from 'react-icons/pi';
import ID from './UUID';
import { GrSteps } from 'react-icons/gr';
import { isListNotEmpty } from './utils/objectUtils';

const _defaultItems = [
	{
		key: 'Header',
		name: "Header Text",
		icon: FaHeading,
		static: true,
		content: "Text...",
	},
	{
		key: 'Label',
		name: "Label",
		static: true,
		icon: FaFont,
		content: "Text...",
	},
	{
		key: 'Paragraph',
		name: "Paragraph",
		static: true,
		icon: FaParagraph,
		content: "Text...",
	},
	{
		key: 'ContentBody',
		name: "Static Content",
		static: true,
		icon: PiFileHtml,
		content: "Text...",
	},
	{
		key: 'LineBreak',
		name: "Line Break",
		static: true,
		icon: FaArrowsAltH,
	},
	{
		key: 'Dropdown',
		name: "Dropdown",
		icon: FaCaretSquareDown,
		label: "Label",
		fieldName: 'dropdown_',
		canHaveHelp: true,
		options: [],
		placeholder: 'Select One',
		canHaveLabelLocation: true,
		answerType: 'ARRAY',
		hideLabel: false
	},
	{
		key: 'Tags',
		name: "Tags",
		icon: FaTags,
		label: "Label",
		fieldName: 'tags_',
		canHaveHelp: true,
		options: [],
		placeholder: 'Select...',
		canHaveLabelLocation: true,
		answerType: 'ARRAY',
		hideLabel: false
	},
	{
		key: 'Checkboxes',
		name: "Checkboxes",
		icon: FaCheckSquare,
		label: "Label",
		fieldName: 'checkboxes_',
		canHaveHelp: true,
		options: [],
		answerType: 'ARRAY',
		hideLabel: false
	},
	{
		key: 'Checkbox',
		name: "Checkbox",
		icon: FaCheckSquare,
		label: "Label",
		fieldName: 'checkbox_',
		canHaveHelp: true,
		boxLabel: 'Pick me',
		answerType: 'BOOLEAN',
		canHideLabel: true,
		hideLabel: true
	},
	{
		key: 'RadioButtons',
		name: "Radio Buttons",
		icon: FaRegDotCircle,
		label: "Label",
		fieldName: 'radiobuttons_',
		canHaveHelp: true,
		options: [],
		answerType: 'STRING',
		hideLabel: false
	},
	{
		key: 'TextInput',
		name: "Text Input",
		label: "Label",
		icon: FaFont,
		fieldName: 'text_input_',
		canHaveHelp: true,
		placeholder: "Label",
		canHaveLabelLocation: true,
		answerType: 'STRING',
		hideLabel: false
	},
	{
		key: 'EmailInput',
		name: "Email Input",
		label: "Email Address",
		icon: FaEnvelope,
		fieldName: 'email_input_',
		canHaveHelp: true,
		placeholder: "Email Address",
		canHaveLabelLocation: true,
		answerType: 'STRING',
		hideLabel: false
	},
	{
		key: 'PhoneNumber',
		name: "Phone Number",
		label: "Phone Number",
		icon: FaPhone,
		fieldName: 'phone_input_',
		canHaveHelp: true,
		canHaveLabelLocation: true,
		answerType: 'STRING',
		hideLabel: false
	},
	{
		key: 'DatePicker',
		canDefaultToday: true,
		canReadOnly: true,
		dateFormat: 'MM/DD/YYYY',
		name: "Date",
		icon: FaRegCalendarAlt,
		label: "Label",
		fieldName: 'date_picker_',
		canHaveHelp: true,
		canHaveLabelLocation: true,
		answerType: 'STRING',
		hideLabel: false
	},
	{
		key: 'TextArea',
		name: "Multi-line Input",
		label: "Label",
		icon: FaTextHeight,
		fieldName: 'text_area_',
		canHaveHelp: true,
		canHaveLabelLocation: true,
		answerType: 'STRING',
		hideLabel: false
	},
	{
		key: 'NumberInput',
		name: "Numerical Input",
		label: "Label",
		icon: FaPlus,
		fieldName: 'number_input_',
		canHaveHelp: true,
		step: 1,
		minValue: 0,
		maxValue: 5,
		canHaveLabelLocation: true,
		answerType: 'NUMBER',
		hideLabel: false
	},
	{
		key: 'Rating',
		name: "Rating",
		label: "Label",
		icon: FaStar,
		fieldName: 'rating_',
		canHaveHelp: true,
		answerType: 'NUMBER',
		hideLabel: false
	},
	{
		key: 'Range',
		name: "Range",
		icon: FaSlidersH,
		label: "Label",
		fieldName: 'range_',
		step: 1,
		defaultValue: 3,
		minValue: 1,
		maxValue: 5,
		minLabel: "Easy",
		maxLabel: "Difficult",
		canHaveHelp: true,
		answerType: 'NUMBER',
		hideLabel: false
	},
	{
		key: 'Signature',
		canReadOnly: true,
		name: "Signature",
		icon: FaPenSquare,
		label: "Signature",
		fieldName: 'signature_',
		canHaveHelp: true,
		answerType: 'IMAGE',
		hideLabel: false
	},
	{
		key: 'Camera',
		name: "Camera",
		icon: FaCamera,
		label: "Label",
		fieldName: 'camera_',
		answerType: 'IMAGE',
		hideLabel: false
	},
	{
		key: 'FileUpload',
		name: "File Upload",
		icon: FaFile,
		label: "Label",
		fieldName: 'file_upload_',
		answerType: 'FILE',
		hideLabel: false
	},
	{
		key: 'Fieldset',
		name: "Fieldset",
		label: "Fieldset",
		icon: FaBars,
		fieldName: 'fieldset-element',
		static: true,
		isContainer: true,
	},

	{
		key: 'Image',
		name: "Image",
		label: '',
		icon: FaRegImage,
		fieldName: 'image_',
		src: '',
		static: true,
	},
	{
		key: 'HyperLink',
		name: "Hyperlink",
		icon: FaLink,
		content: "Website Link...",
		href: 'http://www.example.com',
		static: true,
	},
	{
		key: 'Download',
		name: "File Attachment",
		icon: FaFile,
		content: "File name...",
		fieldName: 'download_',
		filePath: '',
		href: '',
		static: true,
	},
	{
		key: 'TwoColumnRow',
		name: "Two Column Row",
		label: '',
		icon: FaColumns,
		fieldName: 'two_col_row_',
		static: true,
		isContainer: true,
	},
	{
		key: 'ThreeColumnRow',
		name: "Three Columns Row",
		label: '',
		icon: FaColumns,
		fieldName: 'three_col_row_',
		static: true,
		isContainer: true,
	},
	{
		key: 'FourColumnRow',
		element: 'MultiColumnRow',
		name: "Four Columns Row",
		label: '',
		icon: FaColumns,
		fieldName: 'four_col_row_',
		colCount: 4,
		className: 'col-md-3',
		static: true,
		isContainer: true,
	},
	{
		key: 'FiveColumnRow',
		element: 'MultiColumnRow',
		name: "Five Columns Row",
		label: '',
		icon: FaColumns,
		fieldName: 'five_col_row_',
		colCount: 5,
		className: 'col',
		static: true,
		isContainer: true,
	},
	{
		key: 'SixColumnRow',
		element: 'MultiColumnRow',
		name: "Six Columns Row",
		label: '',
		icon: FaColumns,
		fieldName: 'six_col_row_',
		colCount: 6,
		className: 'col-md-2',
		static: true,
		isContainer: true,
	},
	{
		key: 'Step',
		name: "Step",
		label: "Step",
		icon: GrSteps,
		fieldName: 'step_',
		static: true,
		conditional: false,
		conditionalFieldName: '',
		conditionalFieldValue: '',
		isContainer: true,
	},
];

const groupBy = (list, keyGetter) => {
	const map = new Map();
	list.forEach((item) => {
		const key = keyGetter(item);
		const collection = map.get(key);
		if (!collection) {
			map.set(key, [item]);
		} else {
			collection.push(item);
		}
	});

	return map;
};

const buildItems = (dataItems = [], defaultDataItems = [], customItems = []) => {
	let allItems = [...defaultDataItems, ...customItems];
	if (!isListNotEmpty(dataItems)) {
		return allItems;
	}

	return dataItems.map(x => {
		let found = allItems.find(y => (x.element === y.element && y.key === x.key));
		if (!found) {
			found = allItems.find(y => (x.element || x.key) === (y.element || y.key));
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
};

const buildGroupItems = (allItems = []) => {
	const ungroupedItems = allItems.filter(x => !x.groupName);
	const gItems = allItems.filter(x => !!x.groupName);
	const grouped = groupBy(gItems, x => x.groupName);
	const groupKeys = gItems.map(x => x.groupName).filter((v, i, self) => self.indexOf(v) === i);

	return { ungroupedItems, grouped, groupKeys };
};

const Toolbar = ({ toolbarTop, items = [], customItems = [] }) => {
	const [dataItems, setDataItems] = React.useState(isListNotEmpty(items) ? [...items] : []);

	const _defaultItemOptions = (element) => {
		switch (element) {
			case 'Dropdown':
				return [
					{ value: 'PLACE_HOLDER_OPTION_1', text: "Place holder option 1", key: `dropdown_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_OPTION_2', text: "Place holder option 2", key: `dropdown_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_OPTION_3', text: "Place holder option 3", key: `dropdown_option_${ID.uuid()}` },
				];
			case 'Tags':
				return [
					{ value: 'PLACE_HOLDER_TAG_1', text: "Place holder option 1", key: `tags_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_TAG_2', text: "Place holder option 2", key: `tags_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_TAG_3', text: "Place holder option 3", key: `tags_option_${ID.uuid()}` },
				];
			case 'Checkboxes':
				return [
					{ value: 'PLACE_HOLDER_OPTION_1', text: "Place holder option 1", key: `checkboxes_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_OPTION_2', text: "Place holder option 2", key: `checkboxes_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_OPTION_3', text: "Place holder option 3", key: `checkboxes_option_${ID.uuid()}` },
				];
			case 'RadioButtons':
				return [
					{ value: 'PLACE_HOLDER_OPTION_1', text: "Place holder option 1", key: `radiobuttons_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_OPTION_2', text: "Place holder option 2", key: `radiobuttons_option_${ID.uuid()}` },
					{ value: 'PLACE_HOLDER_OPTION_3', text: "Place holder option 3", key: `radiobuttons_option_${ID.uuid()}` },
				];
			default:
				return [];
		}
	};

	const addCustomOptions = (item, elementOptions) => {
		if (item.type === 'custom') {
			const customOptions = { ...item, ...elementOptions };
			customOptions.custom = true;
			customOptions.component = item.component || null;
			customOptions.customOptions = item.customOptions || [];

			return customOptions;
		}

		return elementOptions;
	};

	const create = (item) => {
		const element = item.element || item.key;

		const elementOptions = addCustomOptions(item, {
			id: ID.uuid(),
			element,
			text: item.name,
			static: item.static ?? false
		});

		if (item.groupName) { elementOptions.groupName = item.groupName ?? null; }

		if (!item.static) {
			elementOptions.required = false;
		}

		if (item.isContainer) {
			elementOptions.isContainer = true;
		}

		// add placeholder to form input
		if (['NumberInput', 'EmailInput', 'TextInput', 'PhoneNumber', 'TextArea', 'DatePicker', 'Dropdown', 'Tags'].indexOf(element) !== -1) {
			elementOptions.placeholder = item.placeholder ?? '';
		}

		if (item.type === 'custom') {
			elementOptions.key = item.key;
			elementOptions.custom = true;
			elementOptions.forwardRef = item.forwardRef;
			elementOptions.bare = item.bare;
			elementOptions.props = item.props;
			elementOptions.component = item.component || null;
			elementOptions.customOptions = item.customOptions || [];
		}

		if (item.static && ['Header', 'Paragraph', 'Label'].indexOf(element) !== -1) {
			elementOptions.bold = false;
			elementOptions.italic = false;
		}

		if (item.canHaveLabelLocation || item.labelLocation !== undefined) {
			elementOptions.labelLocation = item.labelLocation ?? 'ABOVE';
		}

		if (item.canHaveHelp || item.help !== undefined) { elementOptions.help = item.help ?? ''; }
		if (item.canHideLabel || item.hideLabel !== undefined) { elementOptions.hideLabel = item.hideLabel ?? false; }

		if (item.canReadOnly || item.readOnly !== undefined) { elementOptions.readOnly = item.readOnly ?? false; }
		if (item.canDefaultToday || item.defaultToday !== undefined) { elementOptions.defaultToday = item.defaultToday ?? false; }
		if (item.content) { elementOptions.content = item.content; }
		if (item.href) { elementOptions.href = item.href; }

		if (item.inherited !== undefined) { elementOptions.inherited = item.inherited; }

		if (item.canHavePageBreakBefore || item.pageBreakBefore !== undefined) { elementOptions.pageBreakBefore = item.pageBreakBefore ?? false; }
		if (item.canHaveAlternateForm || item.alternateForm !== undefined) { elementOptions.alternateForm = item.alternateForm ?? false; }
		if (item.canHaveDisplayHorizontal || item.inline !== undefined) { elementOptions.inline = item.inline ?? false; }

		if (item.canHaveOptionCorrect) { elementOptions.canHaveOptionCorrect = item.canHaveOptionCorrect ?? false; }
		if (item.canHaveOptionValue) { elementOptions.canHaveOptionValue = item.canHaveOptionValue ?? false; }
		if (item.canPopulateFromApi) { elementOptions.canPopulateFromApi = item.canPopulateFromApi ?? false; }

		if (item.className) {
			elementOptions.className = item.className;
		}

		if (element === 'Step') {
			elementOptions.conditional = item.conditional;
			elementOptions.conditionalFieldName = item.conditionalFieldName;
			elementOptions.conditionalFieldValue = item.conditionalFieldValue;
		}

		if (element === 'Image') {
			elementOptions.src = item.src;
		}

		if (element === 'DatePicker') {
			elementOptions.dateFormat = item.dateFormat;
		}

		if (element === 'Download') {
			elementOptions.href = item.href;
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
		if (!item.static) { elementOptions.customName = item.customName ?? elementOptions.fieldName; }

		if (item.label) { elementOptions.label = item.label.trim(); }

		if (item.options) {
			if (item.options.length > 0) {
				elementOptions.options = item.options.map(x => ({ ...x, key: `custom_option_${ID.uuid()}` }));
			} else {
				elementOptions.options = _defaultItemOptions(elementOptions.element);
			}
		}

		return elementOptions;
	};

	const _onClick = (item) => {
		// ElementActions.createElement(create(item));
		store.dispatch('create', create(item));
	};

	const renderItem = (item) => {
		return (
			<ToolbarItem item={item} key={item.key} onClick={() => { _onClick(item); }} onCreate={create} />
		);
	};

	React.useEffect(() => {
		setDataItems(buildItems(dataItems, _defaultItems, customItems));
	}, []);

	const { ungroupedItems, grouped, groupKeys } = buildGroupItems(dataItems);

	return (
		<div className="react-survey-builder-toolbar">
			{toolbarTop}
			<h4>Survey Blocks Toolbox</h4>
			<ul>
				{ungroupedItems.map(renderItem)}
				{groupKeys.map(k => <ToolbarGroupItem key={k} name={k} group={grouped.get(k)} renderItem={renderItem} />)}
			</ul>
		</div>
	);
};

export default Toolbar;