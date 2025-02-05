import React from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { ContentState, EditorState, convertFromHTML as draftJsConvertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DynamicOptionList from './dynamic-option-list';
import { get } from './stores/requests';
import { FaTimes } from 'react-icons/fa';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Editor from 'react-simple-wysiwyg';
import ID from './UUID';
import { isListNotEmpty, isObjectNotEmpty } from './utils/objectUtils';

const CustomWysiwygInput = React.forwardRef(({ containerProps, onChange, onBlur, value, name, ...otherProps }, ref) => (
	<Editor
		{...otherProps}
		onBlur={onBlur}
		value={value}
		name={name}
		onChange={onChange}
		containerProps={containerProps}
	/>
));

const SurveyElementsEdit = ({ element, setElement, files = [], showCorrectColumn = false, showDescription = false, manualEditModeOff, updateElement }) => {
	const [dirty, setDirty] = React.useState(false);

	const toggleRequired = () => {
		// const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
	};

	const editElementProp = (elementProperty, targetProperty, e) => {
		// elemProperty could be content or label
		// targProperty could be value or checked
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		thisElement[elementProperty] = e.target[targetProperty];

		setElement(thisElement);
		setDirty(true);
		if (targetProperty === 'checked') {
			onUpdateElement();
		}
	};

	const onEditorStateChange = (index, property, editorContent) => {
		const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, '');
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		thisElement[property] = html;

		setElement(thisElement);
		setDirty(true);
	};

	const onUpdateElement = () => {
		const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
		// to prevent ajax calls with no change
		if (dirty) {
			updateElement(thisElement);
			setDirty(false);
		}
	};

	const convertFromHTML = (content) => {
		const newContent = draftJsConvertFromHTML(content);
		if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
			// to prevent crash when no contents in editor
			return EditorState.createEmpty();
		}
		const contentState = ContentState.createFromBlockArray(newContent);
		return EditorState.createWithContent(contentState);
	}

	const addOptions = () => {
		const optionsApiUrl = document.getElementById('optionsApiUrl').value;
		if (optionsApiUrl) {
			get(optionsApiUrl).then((data) => {
				const options = [];
				data.forEach((dataOption) => {
					// eslint-disable-next-line no-param-reassign
					dataOption.key = ID.uuid();
					options.push(dataOption);
				});
				const thisElement = isObjectNotEmpty(element) ? { ...element } : {};
				thisElement.options = options;

				setElement(thisElement);
				setDirty(true);
			});
		}
	};

	// React.useEffect(() => {
	// 	if (dirty) {
	// 		const thisElement = isObjectNotEmpty(element) ? { ...element, dirty: true } : { dirty: true };

	// 		updateElement(thisElement);
	// 	}
	// }, [dirty, element]);

	const thisRequiredChecked = element.hasOwnProperty('required') ? element.required : false;
	const thisDefaultChecked = element.hasOwnProperty('defaultChecked') ? element.defaultChecked : false;
	const thisReadOnly = element.hasOwnProperty('readOnly') ? element.readOnly : false;
	const thisDefaultToday = element.hasOwnProperty('defaultToday') ? element.defaultToday : false;
	const thisCheckedInline = element.hasOwnProperty('inline') ? element.inline : false;
	const thisCheckedBold = element.hasOwnProperty('bold') ? element.bold : false;
	const thisCheckedItalic = element.hasOwnProperty('italic') ? element.italic : false;
	const thisCheckedCenter = element.hasOwnProperty('center') ? element.center : false;
	const thisCheckedPageBreak = element.hasOwnProperty('pageBreakBefore') ? element.pageBreakBefore : false;
	const thisCheckedAlternateForm = element.hasOwnProperty('alternateForm') ? element.alternateForm : false;
	const thisCheckedHideLabel = element.hasOwnProperty('hideLabel') ? element.hideLabel : false;
	const thisCheckedConditional = element.hasOwnProperty('conditional') ? element.conditional : false;
	const thisCheckedHideNextStepButton = element.hasOwnProperty('hideNextStepButton') ? element.hideNextStepButton : false;
	const thisCheckedSubmitOnSelection = element.hasOwnProperty('submitOnSelection') ? element.submitOnSelection : false;
	const thisCheckedShowRadio = element.hasOwnProperty('showRadio') ? element.showRadio : false;

	const canHaveAnswer = ['NumberInput', 'EmailInput', 'TextInput', 'PhoneNumber', 'TextArea', 'DatePicker', 'Dropdown', 'Tags', 'Checkboxes', 'Checkbox', 'ButtonList', 'Rating', 'Range'].indexOf(element.element) !== -1;
	const canHaveOptionValue = ['Dropdown', 'Tags', 'Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element) !== -1;
	const canHaveOptionCorrect = canHaveAnswer && canHaveOptionValue;
	const canHaveIcon = ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element) !== -1;
	const canHaveImage = ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element) !== -1;
	const canHaveDescription = ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element) !== -1;

	const thisFiles = isListNotEmpty(files) ? [...files] : [];
	if (thisFiles.length < 1 || (thisFiles.length > 0 && thisFiles[0].id !== '')) {
		thisFiles.unshift({ id: '', file_name: '' });
	}

	return (
		<div>
			<div className="clearfix">
				<h4 className="float-start">{element.text}</h4>
				<FaTimes className="float-end dismiss-edit" onClick={manualEditModeOff} />
			</div>

			<div className="clearfix">
				<Form.Label className="fw-bold">Field Id: {element.fieldName}</Form.Label>
			</div>

			{element.hasOwnProperty('content') && (element.element === 'Header' || element.element === 'Label' || element.element === 'Paragraph' || element.element === 'ContentBody') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Text to display:</Form.Label>
					<Form.Control
						type="text"
						id="content"
						name="content"
						as={CustomWysiwygInput}
						value={element.content}
						defaultValue={element.content}
						onBlur={onUpdateElement}
						onChange={(e) => { editElementProp('content', 'value', e); }}
						containerProps={{ style: { height: '200px', width: '100%', resize: 'vertical' } }}
					/>
				</Form.Group>
			}

			{element.hasOwnProperty('filePath') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="fileSelect">Choose file:</Form.Label>
					<Form.Select id="fileSelect" defaultValue={element.filePath} onBlur={onUpdateElement} onChange={(e) => { editElementProp('filePath', 'value', e); }}>
						{thisFiles.map((file) => {
							const thisKey = `file_${file.id}`;
							return <option value={file.id} key={thisKey}>{file.file_name}</option>;
						})}
					</Form.Select>
				</Form.Group>
			}

			{element.hasOwnProperty('href') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="href">Link to:</Form.Label>
					<Form.Control id="href" type="text" defaultValue={element.href} onBlur={onUpdateElement} onChange={(e) => { editElementProp('href', 'value', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('label') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Display Label:</Form.Label>
					<Form.Control
						type="text"
						id="label"
						name="label"
						as={CustomWysiwygInput}
						value={element.label}
						defaultValue={element.label}
						onBlur={onUpdateElement}
						onChange={(e) => { editElementProp('label', 'value', e); }}
						containerProps={{ style: { height: '200px', width: '100%', resize: 'vertical' } }}
					/>
				</Form.Group>
			}

			{(element.hasOwnProperty('required') || element.hasOwnProperty('readOnly') || element.hasOwnProperty('defaultToday') || (['Checkboxes', 'Checkbox'].indexOf(element.element) !== -1) || ((element.element === 'RadioButtons' || element.element === 'Checkboxes') && element.hasOwnProperty('inline'))) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Field Properties:</Form.Label>
					{element.hasOwnProperty('required') &&
						<Form.Check id="is-required" label="Required" type="checkbox" checked={thisRequiredChecked} onBlur={onUpdateElement} value={true} onChange={(e) => { editElementProp('required', 'checked', e); }} />
					}
					{element.hasOwnProperty('readOnly') &&
						<Form.Check id="is-read-only" label="Read Only" type="checkbox" checked={thisReadOnly} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('readOnly', 'checked', e); }} />
					}
					{element.hasOwnProperty('defaultToday') &&
						<Form.Check id="is-default-to-today" label="Default to Today" type="checkbox" checked={thisDefaultToday} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('defaultToday', 'checked', e); }} />
					}

					{(['Checkboxes', 'Checkbox'].indexOf(element.element) !== -1) &&
						<Form.Check id="default-checked" label="Default Checked" type="checkbox" checked={thisDefaultChecked} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('defaultChecked', 'checked', e); }} />
					}

					{((element.element === 'RadioButtons' || element.element === 'Checkboxes') && element.hasOwnProperty('inline')) &&
						<Form.Check id="display-horizontal" label="Display Horizontal" type="checkbox" checked={thisCheckedInline} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('inline', 'checked', e); }} />
					}
				</Form.Group>
			}

			{element.element === 'Checkbox' &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Checkbox Label Text:</Form.Label>
					<Form.Control
						type="text"
						id="boxLabel"
						name="boxLabel"
						as={CustomWysiwygInput}
						value={element.boxLabel}
						defaultValue={element.boxLabel}
						onBlur={onUpdateElement}
						onChange={(e) => { editElementProp('boxLabel', 'value', e); }}
						containerProps={{ style: { height: '200px', width: '100%', resize: 'vertical' } }}
					/>
				</Form.Group>
			}

			{element.hasOwnProperty('src') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="srcInput">Link to:</Form.Label>
					<Form.Control id="srcInput" type="text" defaultValue={element.src} onBlur={onUpdateElement} onChange={(e) => { editElementProp('src', 'value', e); }} />
				</Form.Group>
			}

			{(element.element === 'Image' || element.element === 'Camera') &&
				<Form.Group className="form-group mb-5">
					<Row>
						<Col sm={3}>
							<Form.Label className="fw-bold" htmlFor="do-center">Alignment:</Form.Label>
							<Form.Check id="do-center" label="Center" type="checkbox" checked={thisCheckedCenter} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('center', 'checked', e); }} />
						</Col>
						<Col sm={3}>
							<Form.Label className="fw-bold" htmlFor="elementWidth">Width:</Form.Label>
							<Form.Control id="elementWidth" type="number" defaultValue={element.width} onBlur={onUpdateElement} onChange={(e) => { editElementProp('width', 'value', e); }} />
						</Col>
						<Col sm={3}>
							<Form.Label className="fw-bold" htmlFor="elementHeight">Height:</Form.Label>
							<Form.Control id="elementHeight" type="number" defaultValue={element.height} onBlur={onUpdateElement} onChange={(e) => { editElementProp('height', 'value', e); }} />
						</Col>
					</Row>
				</Form.Group>
			}

			{element.element === 'FileUpload' && (
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor='fileType'>Choose file type:</Form.Label>
					<Form.Select
						id='fileType'
						onBlur={onUpdateElement}
						onChange={(e) => { editElementProp('fileType', 'value', e); }}
					>
						{[
							{
								type: 'image, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, video/mp4,video/x-m4v,video/*',
								typeName: 'All File Type',
							},
							{ type: 'image', typeName: 'Image' },
							{ type: 'application/pdf', typeName: 'PDF' },
							{
								type: 'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
								typeName: 'Word',
							},
							{
								type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
								typeName: 'Excel',
							},
							{
								type: 'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
								typeName: 'Powerpoint',
							},
							{
								type: 'video/mp4,video/x-m4v,video/*',
								typeName: 'Videos',
							},
						].map((file, index) => (
							<option value={file.type} key={index}>
								{file.typeName}
							</option>
						))}
					</Form.Select>
				</Form.Group>
			)}

			{/* {element.element === 'Signature' && element.readOnly */}
			{/*   ? ( */}
			{/*     <Form.Group className="form-group mb-5"> */}
			{/*       <Form.Label className="fw-bold" htmlFor="variableKey">Variable Key:</Form.Label> */}
			{/*       <Form.Control id="variableKey" type="text" defaultValue={element.variableKey} onBlur={onUpdateElement} onChange={(e) => { editElementProp('variableKey', 'value', e); }} /> */}
			{/*       <p className="help-block">This will give the element a key that can be used to replace the content with a runtime value.</p> */}
			{/*     </Form.Group> */}
			{/*   ) */}
			{/*   : (<div/>) */}
			{/* } */}

			{element.hasOwnProperty('pageBreakBefore') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Print options:</Form.Label>
					<Form.Check id="page-break-before-element" label="Page Break Before Element" type="checkbox" checked={thisCheckedPageBreak} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('pageBreakBefore', 'checked', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('alternateForm') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Alternate/Signature Page:</Form.Label>
					<Form.Check id="display-on-alternate" label="Display on alternate/signature Page" type="checkbox" checked={thisCheckedAlternateForm} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('alternateForm', 'checked', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('step') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="rangeStep">Step:</Form.Label>
						<Form.Control id="rangeStep" type="number" defaultValue={element.step} onBlur={onUpdateElement} onChange={(e) => { editElementProp('step', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.hasOwnProperty('minValue') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="rangeMin">Min:</Form.Label>
						<Form.Control id="rangeMin" type="number" defaultValue={element.minValue} onBlur={onUpdateElement} onChange={(e) => { editElementProp('minValue', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.hasOwnProperty('minLabel') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="rangeMin">Minimum Value Label:</Form.Label>
						<Form.Control type="text" defaultValue={element.minLabel} onBlur={onUpdateElement} onChange={(e) => { editElementProp('minLabel', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.hasOwnProperty('maxValue') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="rangeMax">Max:</Form.Label>
						<Form.Control id="rangeMax" type="number" defaultValue={element.maxValue} onBlur={onUpdateElement} onChange={(e) => { editElementProp('maxValue', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.hasOwnProperty('maxLabel') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="rangeMax">Maximum Value Label:</Form.Label>
						<Form.Control type="text" defaultValue={element.maxLabel} onBlur={onUpdateElement} onChange={(e) => { editElementProp('maxLabel', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.hasOwnProperty('defaultValue') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="defaultSelected">Default Selected:</Form.Label>
						<Form.Control id="defaultSelected" type="number" defaultValue={element.defaultValue} onBlur={onUpdateElement} onChange={(e) => { editElementProp('defaultValue', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.hasOwnProperty('static') && element.static && element.hasOwnProperty('bold') && element.hasOwnProperty('italic') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Text Style:</Form.Label>
					<Form.Check id="do-bold" inline label={"Bold"} type="checkbox" checked={thisCheckedBold} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('bold', 'checked', e); }} />
					<Form.Check id="do-italic" inline label={"Italic"} type="checkbox" checked={thisCheckedItalic} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('italic', 'checked', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('placeholder') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="placeholder">Placeholder:</Form.Label>
					<Form.Control type="text" id="placeholder" defaultValue={element.placeholder} onBlur={onUpdateElement} onChange={(e) => { editElementProp('placeholder', 'value', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('customName') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="customName">A Name To Give This Input That Will Show Up In Data Retrieval:</Form.Label>
					<Form.Control type="text" id="customName" defaultValue={element.customName} onBlur={onUpdateElement} onChange={(e) => { editElementProp('customName', 'value', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('labelLocation') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="labelLocation">Choose Label Location:</Form.Label>
					<Form.Select id="labelLocation" defaultValue={element.labelLocation} onBlur={onUpdateElement} onChange={(e) => { editElementProp('labelLocation', 'value', e); }}>
						<option value="ABOVE">Above Form Field</option>
						<option value="FLOATING">Floating Inside Form Field</option>
					</Form.Select>
				</Form.Group>
			}

			{(element.hasOwnProperty('hideLabel') || ['Dropdown', 'Tags', 'Checkboxes', 'Checkbox', 'RadioButtons', 'ButtonList', 'TextInput', 'EmailInput', 'PhoneNumber', 'DatePicker', 'TextArea', 'NumberInput', 'Rating', 'Range', 'Signature', 'Camera', 'FileUpload'].includes(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Hide Label:</Form.Label>
					<Form.Check id="hide-label" label="Hide Label" type="checkbox" checked={thisCheckedHideLabel} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('hideLabel', 'checked', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('rows') &&
				<Form.Group className="form-group mb-5">
					<div className="form-group-range">
						<Form.Label className="fw-bold" htmlFor="rows">Rows:</Form.Label>
						<Form.Control id="rows" type="number" defaultValue={element.rows} onBlur={onUpdateElement} onChange={(e) => { editElementProp('rows', 'value', e); }} />
					</div>
				</Form.Group>
			}

			{element.element === 'Step' &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Step is Conditional and Display is Dependent on Answers to another Survey Block:</Form.Label>
					<Form.Check id="conditional" label="Conditional" type="checkbox" checked={thisCheckedConditional} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('conditional', 'checked', e); }} />
				</Form.Group>
			}
			{element.element === 'Step' &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="conditionalFieldName">Field Name for the Dependent Survey Block:</Form.Label>
					<Form.Control type="text" id="conditionalFieldName" defaultValue={element.conditionalFieldName} onBlur={onUpdateElement} onChange={(e) => { editElementProp('conditionalFieldName', 'value', e); }} />
				</Form.Group>
			}
			{element.element === 'Step' &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="conditionalFieldValue">Value(s) for Survey Block to Display the Conditional Step:</Form.Label>
					<Form.Control type="text" id="conditionalFieldValue" defaultValue={element.conditionalFieldValue} onBlur={onUpdateElement} onChange={(e) => { editElementProp('conditionalFieldValue', 'value', e); }} />
				</Form.Group>
			}

			{element.element === 'Step' &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Hide the Next Step/Submit Button for this Step (typically set true when the step has a Button List component):</Form.Label>
					<Form.Check id="hideNextStepButton" label="Hide the Next Step/Submit Button for this Step" type="checkbox" checked={thisCheckedHideNextStepButton} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('hideNextStepButton', 'checked', e); }} />
				</Form.Group>
			}

			{(element.element === 'ButtonList' || element.element === 'RadioButtons') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Submit form on option selection:</Form.Label>
					<Form.Check id="submitOnSelection" label="Submit form on option selection:" type="checkbox" checked={thisCheckedSubmitOnSelection} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('submitOnSelection', 'checked', e); }} />
				</Form.Group>
			}

			{(element.element === 'RadioButtons') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold">Show Radio by Default:</Form.Label>
					<Form.Check id="showRadio" label="Show Radio by Default:" type="checkbox" checked={thisCheckedShowRadio} value={true} onBlur={onUpdateElement} onChange={(e) => { editElementProp('showRadio', 'checked', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('bgColor') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="bgColor">Background Color:</Form.Label>
					<Form.Control type="text" id="bgColor" defaultValue={element.bgColor} onBlur={onUpdateElement} onChange={(e) => { editElementProp('bgColor', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('textColor') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="textColor">Text Color:</Form.Label>
					<Form.Control type="text" id="textColor" defaultValue={element.textColor} onBlur={onUpdateElement} onChange={(e) => { editElementProp('textColor', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('className') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="className">ClassName:</Form.Label>
					<Form.Control type="text" id="className" defaultValue={element.className} onBlur={onUpdateElement} onChange={(e) => { editElementProp('className', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('fieldLabelClassName') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="fieldLabelClassName">Label ClassName:</Form.Label>
					<Form.Control type="text" id="fieldLabelClassName" defaultValue={element.fieldLabelClassName} onBlur={onUpdateElement} onChange={(e) => { editElementProp('fieldLabelClassName', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('fieldDescriptionClassName') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="fieldDescriptionClassName">Description ClassName:</Form.Label>
					<Form.Control type="text" id="fieldDescriptionClassName" defaultValue={element.fieldDescriptionClassName} onBlur={onUpdateElement} onChange={(e) => { editElementProp('fieldDescriptionClassName', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('selectedClassName') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="selectedClassName">Selected ClassName:</Form.Label>
					<Form.Control type="text" id="selectedClassName" defaultValue={element.selectedClassName} onBlur={onUpdateElement} onChange={(e) => { editElementProp('selectedClassName', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('unselectedClassName') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="unselectedClassName">Unselected ClassName:</Form.Label>
					<Form.Control type="text" id="unselectedClassName" defaultValue={element.unselectedClassName} onBlur={onUpdateElement} onChange={(e) => { editElementProp('unselectedClassName', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('selectedColor') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="selectedColor">Selected Color:</Form.Label>
					<Form.Control type="text" id="selectedColor" defaultValue={element.selectedColor} onBlur={onUpdateElement} onChange={(e) => { editElementProp('selectedColor', 'value', e); }} />
				</Form.Group>
			}

			{(element.hasOwnProperty('unselectedColor') || ['Checkboxes', 'RadioButtons', 'ButtonList'].indexOf(element.element)) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="unselectedColor">Unselected Color:</Form.Label>
					<Form.Control type="text" id="unselectedColor" defaultValue={element.unselectedColor} onBlur={onUpdateElement} onChange={(e) => { editElementProp('unselectedColor', 'value', e); }} />
				</Form.Group>
			}

			{element.hasOwnProperty('help') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="help">Help instructions/details that will show up beneath the input field:</Form.Label>
					<TextAreaAutosize type="text" className="form-control" id="help" defaultValue={element.help} onBlur={onUpdateElement} onChange={(e) => { editElementProp('help', 'value', e); }} />
				</Form.Group>
			}

			{((showDescription && !element.static) || element.hasOwnProperty('description')) &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="description">Description:</Form.Label>
					<TextAreaAutosize type="text" className="form-control" id="description" defaultValue={element.description} onBlur={onUpdateElement} onChange={(e) => { editElementProp('description', 'value', e); }} />
				</Form.Group>
			}

			{showCorrectColumn && canHaveAnswer && !element.hasOwnProperty('options') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="correct">Correct Answer:</Form.Label>
					<Form.Control id="correct" type="text" defaultValue={element.correct} onBlur={onUpdateElement} onChange={(e) => { editElementProp('correct', 'value', e); }} />
				</Form.Group>
			}

			{element.canPopulateFromApi && element.hasOwnProperty('options') &&
				<Form.Group className="form-group mb-5">
					<Form.Label className="fw-bold" htmlFor="optionsApiUrl">Populate Options from API:</Form.Label>
					<Row>
						<Col sm={6}>
							<Form.Control style={{ width: '100%' }} type="text" id="optionsApiUrl" placeholder="http://localhost:8080/api/optionsdata" />
						</Col>
						<Col sm={6}>
							<Button variant="success" onClick={addOptions}>Populate</Button>
						</Col>
					</Row>
				</Form.Group>
			}

			{element.hasOwnProperty('options') &&
				<DynamicOptionList
					showCorrectColumn={showCorrectColumn}
					canHaveOptionCorrect={canHaveOptionCorrect}
					canHaveOptionValue={canHaveOptionValue}
					canHaveIcon={canHaveIcon}
					canHaveImage={canHaveImage}
					canHaveDescription={canHaveDescription}
					updateElement={updateElement}
					element={element}
					setElement={setElement}
					dirty={dirty}
					setDirty={setDirty}
					key={element?.options?.length}
				/>
			}
		</div>
	);
};

SurveyElementsEdit.defaultProps = { className: 'edit-element-fields' };

export default SurveyElementsEdit;