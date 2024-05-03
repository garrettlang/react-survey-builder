import React from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DynamicOptionList from './dynamic-option-list';
import { get } from './stores/requests';
import { FaTimes } from 'react-icons/fa';
import { Button, Col, Form, Row } from 'react-bootstrap/esm';
import Editor from 'react-simple-wysiwyg';
import ID from './UUID';

const CustomWysiwygInput = React.forwardRef(({ onChange, onBlur, value, name, ...otherProps }, ref) => (
	<Editor
		{...otherProps}
		onBlur={onBlur}
		value={value}
		name={name}
		onChange={onChange}
		containerProps={{ style: { height: '500px', width: '100%', resize: 'both' } }}
	/>
));

export default class SurveyElementsEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			element: this.props.element,
			item: this.props.item,
			dirty: false,
		};
	}

	toggleRequired() {
		// const this_element = this.state.element;
	}

	editElementProp(elemProperty, targProperty, e) {
		// elemProperty could be content or label
		// targProperty could be value or checked
		const thisElement = this.state.element;
		thisElement[elemProperty] = e.target[targProperty];

		this.setState({
			element: thisElement,
			dirty: true,
		}, () => {
			if (targProperty === 'checked') { this.updateElement(); }
		});
	}

	onEditorStateChange(index, property, editorContent) {
		// const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
		// const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, '');
		const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, '');
		const thisElement = this.state.element;
		thisElement[property] = html;

		this.setState({
			element: thisElement,
			dirty: true,
		});
	}

	updateElement() {
		const thisElement = this.state.element;
		// to prevent ajax calls with no change
		if (this.state.dirty) {
			this.props.updateElement.call(this.props.preview, thisElement);
			this.setState({ dirty: false });
		}
	}

	convertFromHTML(content) {
		const newContent = convertFromHTML(content);
		if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
			// to prevent crash when no contents in editor
			return EditorState.createEmpty();
		}
		const contentState = ContentState.createFromBlockArray(newContent);
		return EditorState.createWithContent(contentState);
	}

	addOptions() {
		const optionsApiUrl = document.getElementById('optionsApiUrl').value;
		if (optionsApiUrl) {
			get(optionsApiUrl).then((data) => {
				this.props.element.options = [];
				const { options } = this.props.element;
				data.forEach(x => {
					// eslint-disable-next-line no-param-reassign
					x.key = ID.uuid();
					options.push(x);
				});
				const this_element = this.state.element;
				this.setState({
					element: this_element,
					dirty: true,
				});
			});
		}
	}

	render() {
		if (this.state.dirty) { this.props.element.dirty = true; }

		const thisRequiredChecked = this.props.element.hasOwnProperty('required') ? this.props.element.required : false;
		const thisDefaultChecked = this.props.element.hasOwnProperty('defaultChecked') ? this.props.element.defaultChecked : false;
		const thisReadOnly = this.props.element.hasOwnProperty('readOnly') ? this.props.element.readOnly : false;
		const thisDefaultToday = this.props.element.hasOwnProperty('defaultToday') ? this.props.element.defaultToday : false;
		const thisCheckedInline = this.props.element.hasOwnProperty('inline') ? this.props.element.inline : false;
		const thisCheckedBold = this.props.element.hasOwnProperty('bold') ? this.props.element.bold : false;
		const thisCheckedItalic = this.props.element.hasOwnProperty('italic') ? this.props.element.italic : false;
		const thisCheckedCenter = this.props.element.hasOwnProperty('center') ? this.props.element.center : false;
		const thisCheckedPageBreak = this.props.element.hasOwnProperty('pageBreakBefore') ? this.props.element.pageBreakBefore : false;
		const thisCheckedAlternateForm = this.props.element.hasOwnProperty('alternateForm') ? this.props.element.alternateForm : false;
		const thisCheckedHideLabel = this.props.element.hasOwnProperty('hideLabel') ? this.props.element.hideLabel : false;

		const canHaveAnswer = ['NumberInput', 'EmailInput', 'TextInput', 'PhoneNumber', 'TextArea', 'DatePicker', 'Dropdown', 'Tags', 'Checkboxes', 'Checkbox', 'RadioButtons', 'Rating', 'Range'].indexOf(this.state.element.element) !== -1;
		const canHaveOptionValue = ['Dropdown', 'Tags', 'Checkboxes', 'RadioButtons'].indexOf(this.state.element.element) !== -1;
		const canHaveOptionCorrect = canHaveAnswer && canHaveOptionValue;

		const thisFiles = this.props.files.length ? this.props.files : [];
		if (thisFiles.length < 1 || (thisFiles.length > 0 && thisFiles[0].id !== '')) {
			thisFiles.unshift({ id: '', file_name: '' });
		}

		return (
			<div>
				<div className="clearfix">
					<h4 className="float-start">{this.props.element.text}</h4>
					<FaTimes className="float-end dismiss-edit" onClick={this.props.manualEditModeOff} />
				</div>

				{this.props.element.hasOwnProperty('content') && (this.state.element.element === 'Header' || this.state.element.element === 'Label' || this.state.element.element === 'Paragraph' || this.state.element.element === 'ContentBody') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Text to display:</Form.Label>
						<Form.Control
							type="text"
							id="content"
							name="content"
							as={CustomWysiwygInput}
							value={this.props.element.content}
							defaultValue={this.props.element.content}
							onBlur={this.updateElement.bind(this)}
							onChange={this.editElementProp.bind(this, 'content', 'value')}
						/>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('filePath') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="fileSelect">Choose file:</Form.Label>
						<Form.Select id="fileSelect" defaultValue={this.props.element.filePath} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'filePath', 'value')}>
							{thisFiles.map((file) => {
								const thisKey = `file_${file.id}`;
								return <option value={file.id} key={thisKey}>{file.file_name}</option>;
							})}
						</Form.Select>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('href') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="href">Link to:</Form.Label>
						<Form.Control id="href" type="text" defaultValue={this.props.element.href} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'href', 'value')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('label') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Display Label:</Form.Label>
						<Form.Control
							type="text"
							id="label"
							name="label"
							as={CustomWysiwygInput}
							value={this.props.element.label}
							defaultValue={this.props.element.label}
							onBlur={this.updateElement.bind(this)}
							onChange={this.editElementProp.bind(this, 'label', 'value')}
						/>
					</Form.Group>
				}

				{(this.props.element.hasOwnProperty('required') || this.props.element.hasOwnProperty('readOnly') || this.props.element.hasOwnProperty('defaultToday') || (['Checkboxes', 'Checkbox'].indexOf(this.state.element.element) !== -1) || ((this.state.element.element === 'RadioButtons' || this.state.element.element === 'Checkboxes') && this.props.element.hasOwnProperty('inline'))) &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Field Properties:</Form.Label>
						{this.props.element.hasOwnProperty('required') &&
							<Form.Check id="is-required" label="Required" type="checkbox" checked={thisRequiredChecked} value={true} onChange={this.editElementProp.bind(this, 'required', 'checked')} />
						}
						{this.props.element.hasOwnProperty('readOnly') &&
							<Form.Check id="is-read-only" label="Read Only" type="checkbox" checked={thisReadOnly} value={true} onChange={this.editElementProp.bind(this, 'readOnly', 'checked')} />
						}
						{this.props.element.hasOwnProperty('defaultToday') &&
							<Form.Check id="is-default-to-today" label="Default to Today" type="checkbox" checked={thisDefaultToday} value={true} onChange={this.editElementProp.bind(this, 'defaultToday', 'checked')} />
						}

						{(['Checkboxes', 'Checkbox'].indexOf(this.state.element.element) !== -1) &&
							<Form.Check id="default-checked" label="Default Checked" type="checkbox" checked={thisDefaultChecked} value={true} onChange={this.editElementProp.bind(this, 'defaultChecked', 'checked')} />
						}

						{((this.state.element.element === 'RadioButtons' || this.state.element.element === 'Checkboxes') && this.props.element.hasOwnProperty('inline')) &&
							<Form.Check id="display-horizontal" label="Display Horizontal" type="checkbox" checked={thisCheckedInline} value={true} onChange={this.editElementProp.bind(this, 'inline', 'checked')} />
						}
					</Form.Group>
				}

				{this.state.element.element === 'Checkbox' &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Checkbox Label Text:</Form.Label>
						<Form.Control
							type="text"
							id="boxLabel"
							name="boxLabel"
							as={CustomWysiwygInput}
							value={this.props.element.boxLabel}
							defaultValue={this.props.element.boxLabel}
							onBlur={this.updateElement.bind(this)}
							onChange={this.editElementProp.bind(this, 'boxLabel', 'value')}
							containerProps={{ style: { height: '500px', width: '100%', resize: 'both' } }}
						/>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('src') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="srcInput">Link to:</Form.Label>
						<Form.Control id="srcInput" type="text" defaultValue={this.props.element.src} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'src', 'value')} />
					</Form.Group>
				}

				{(this.state.element.element === 'Image' || this.state.element.element === 'Camera') &&
					<Form.Group className="form-group mb-5">
						<Row>
							<Col sm={3}>
								<Form.Label className="fw-bold" htmlFor="do-center">Alignment:</Form.Label>
								<Form.Check id="do-center" label="Center" type="checkbox" checked={thisCheckedCenter} value={true} onChange={this.editElementProp.bind(this, 'center', 'checked')} />
							</Col>
							<Col sm={3}>
								<Form.Label className="fw-bold" htmlFor="elementWidth">Width:</Form.Label>
								<Form.Control id="elementWidth" type="number" defaultValue={this.props.element.width} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'width', 'value')} />
							</Col>
							<Col sm={3}>
								<Form.Label className="fw-bold" htmlFor="elementHeight">Height:</Form.Label>
								<Form.Control id="elementHeight" type="number" defaultValue={this.props.element.height} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'height', 'value')} />
							</Col>
						</Row>
					</Form.Group>
				}

				{this.state.element.element === 'FileUpload' && (
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor='fileType'>Choose file type:</Form.Label>
						<Form.Select
							id='fileType'
							onBlur={this.updateElement.bind(this)}
							onChange={this.editElementProp.bind(this, 'fileType', 'value')}
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

				{/* {this.state.element.element === 'Signature' && this.props.element.readOnly */}
				{/*   ? ( */}
				{/*     <Form.Group className="form-group mb-5"> */}
				{/*       <Form.Label className="fw-bold" htmlFor="variableKey">Variable Key:</Form.Label> */}
				{/*       <Form.Control id="variableKey" type="text" defaultValue={this.props.element.variableKey} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'variableKey', 'value')} /> */}
				{/*       <p className="help-block">This will give the element a key that can be used to replace the content with a runtime value.</p> */}
				{/*     </Form.Group> */}
				{/*   ) */}
				{/*   : (<div/>) */}
				{/* } */}

				{this.props.element.hasOwnProperty('pageBreakBefore') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Print options:</Form.Label>
						<Form.Check id="page-break-before-element" label="Page Break Before Element" type="checkbox" checked={thisCheckedPageBreak} value={true} onChange={this.editElementProp.bind(this, 'pageBreakBefore', 'checked')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('alternateForm') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Alternate/Signature Page:</Form.Label>
						<Form.Check id="display-on-alternate" label="Display on alternate/signature Page" type="checkbox" checked={thisCheckedAlternateForm} value={true} onChange={this.editElementProp.bind(this, 'alternateForm', 'checked')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('step') &&
					<Form.Group className="form-group mb-5">
						<div className="form-group-range">
							<Form.Label className="fw-bold" htmlFor="rangeStep">Step:</Form.Label>
							<Form.Control id="rangeStep" type="number" defaultValue={this.props.element.step} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'step', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('minValue') &&
					<Form.Group className="form-group mb-5">
						<div className="form-group-range">
							<Form.Label className="fw-bold" htmlFor="rangeMin">Min:</Form.Label>
							<Form.Control id="rangeMin" type="number" defaultValue={this.props.element.minValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'minValue', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('minLabel') &&
					<Form.Group className="form-group mb-5">
						<div className="form-group-range">
							<Form.Label className="fw-bold" htmlFor="rangeMin">Minimum Value Label:</Form.Label>
							<Form.Control type="text" defaultValue={this.props.element.minLabel} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'minLabel', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('maxValue') &&
					<Form.Group className="form-group mb-5">
						<div className="form-group-range">
							<Form.Label className="fw-bold" htmlFor="rangeMax">Max:</Form.Label>
							<Form.Control id="rangeMax" type="number" defaultValue={this.props.element.maxValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'maxValue', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('maxLabel') &&
					<Form.Group className="form-group mb-5">
						<div className="form-group-range">
							<Form.Label className="fw-bold" htmlFor="rangeMax">Maximum Value Label:</Form.Label>
							<Form.Control type="text" defaultValue={this.props.element.maxLabel} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'maxLabel', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('defaultValue') &&
					<Form.Group className="form-group mb-5">
						<div className="form-group-range">
							<Form.Label className="fw-bold" htmlFor="defaultSelected">Default Selected:</Form.Label>
							<Form.Control id="defaultSelected" type="number" defaultValue={this.props.element.defaultValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'defaultValue', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('static') && this.props.element.static && this.props.element.hasOwnProperty('bold') && this.props.element.hasOwnProperty('italic') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Text Style:</Form.Label>
						<Form.Check id="do-bold" inline label={"Bold"} type="checkbox" checked={thisCheckedBold} value={true} onChange={this.editElementProp.bind(this, 'bold', 'checked')} />
						<Form.Check id="do-italic" inline label={"Italic"} type="checkbox" checked={thisCheckedItalic} value={true} onChange={this.editElementProp.bind(this, 'italic', 'checked')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('placeholder') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="placeholder">Placeholder:</Form.Label>
						<Form.Control type="text" id="placeholder" defaultValue={this.props.element.placeholder} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'placeholder', 'value')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('customName') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="customName">A Name To Give This Input That Will Show Up In Data Retrieval:</Form.Label>
						<Form.Control type="text" id="customName" defaultValue={this.props.element.customName} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'customName', 'value')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('labelLocation') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="labelLocation">Choose Label Location:</Form.Label>
						<Form.Select id="labelLocation" defaultValue={this.props.element.labelLocation} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'labelLocation', 'value')}>
							<option value="ABOVE">Above Form Field</option>
							<option value="FLOATING">Floating Inside Form Field</option>
						</Form.Select>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('hideLabel') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold">Hide Label:</Form.Label>
						<Form.Check id="hide-label" label="Hide Label" type="checkbox" checked={thisCheckedHideLabel} value={true} onChange={this.editElementProp.bind(this, 'hideLabel', 'checked')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('help') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="help">Help instructions/details that will show up beneath the input field:</Form.Label>
						<TextAreaAutosize type="text" className="form-control" id="help" defaultValue={this.props.element.help} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'help', 'value')} />
					</Form.Group>
				}

				{((this.props.showDescription && !this.props.element.static) || this.props.element.hasOwnProperty('description')) &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="description">Description:</Form.Label>
						<TextAreaAutosize type="text" className="form-control" id="description" defaultValue={this.props.element.description} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'description', 'value')} />
					</Form.Group>
				}

				{this.props.showCorrectColumn && canHaveAnswer && !this.props.element.hasOwnProperty('options') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="correct">Correct Answer:</Form.Label>
						<Form.Control id="correct" type="text" defaultValue={this.props.element.correct} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'correct', 'value')} />
					</Form.Group>
				}

				{this.props.element.canPopulateFromApi && this.props.element.hasOwnProperty('options') &&
					<Form.Group className="form-group mb-5">
						<Form.Label className="fw-bold" htmlFor="optionsApiUrl">Populate Options from API:</Form.Label>
						<Row>
							<Col sm={6}>
								<Form.Control style={{ width: '100%' }} type="text" id="optionsApiUrl" placeholder="http://localhost:8080/api/optionsdata" />
							</Col>
							<Col sm={6}>
								<Button variant="success" onClick={this.addOptions.bind(this)}>Populate</Button>
							</Col>
						</Row>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('options') &&
					<DynamicOptionList
						showCorrectColumn={this.props.showCorrectColumn}
						canHaveOptionCorrect={canHaveOptionCorrect}
						canHaveOptionValue={canHaveOptionValue}
						item={this.props.preview.state.item}
						updateElement={this.props.updateElement}
						preview={this.props.preview}
						element={this.props.element}
						key={this.props.element.options.length}
					/>
				}
			</div>
		);
	}
}

SurveyElementsEdit.defaultProps = { className: 'edit-element-fields' };