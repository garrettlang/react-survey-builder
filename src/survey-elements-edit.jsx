import React from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import DynamicOptionList from './dynamic-option-list';
import { get } from './stores/requests';
import ID from './UUID';
import IntlMessages from './language-provider/IntlMessages';
import { FaTimes } from 'react-icons/fa';
import { Button, Col, Form, Row } from 'react-bootstrap';

const toolbar = {
	options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'history'],
	inline: {
		inDropdown: false,
		className: undefined,
		options: ['bold', 'italic', 'underline', 'superscript', 'subscript'],
	},
};

export default class SurveyElementsEdit extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			element: this.props.element,
			data: this.props.data,
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
		const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/&nbsp;/g, ' ')
			.replace(/(?:\r\n|\r|\n)/g, '');
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
			get(optionsApiUrl).then(data => {
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
		if (this.state.dirty) {
			this.props.element.dirty = true;
		}

		const thisChecked = this.props.element.hasOwnProperty('required') ? this.props.element.required : false;
		const thisDefaultChecked = this.props.element.hasOwnProperty('defaultChecked') ? this.props.element.defaultChecked : false;
		const thisReadOnly = this.props.element.hasOwnProperty('readOnly') ? this.props.element.readOnly : false;
		const thisDefaultToday = this.props.element.hasOwnProperty('defaultToday') ? this.props.element.defaultToday : false;
		const thisShowTimeSelect = this.props.element.hasOwnProperty('showTimeSelect') ? this.props.element.showTimeSelect : false;
		const thisShowTimeSelectOnly = this.props.element.hasOwnProperty('showTimeSelectOnly') ? this.props.element.showTimeSelectOnly : false;
		const thisShowTimeInput = this.props.element.hasOwnProperty('showTimeInput') ? this.props.element.showTimeInput : false;
		const thisCheckedInline = this.props.element.hasOwnProperty('inline') ? this.props.element.inline : false;
		const this_checked_bold = this.props.element.hasOwnProperty('bold') ? this.props.element.bold : false;
		const thisCheckedItalic = this.props.element.hasOwnProperty('italic') ? this.props.element.italic : false;
		const thisCheckedCenter = this.props.element.hasOwnProperty('center') ? this.props.element.center : false;
		const thisCheckedPageBreak = this.props.element.hasOwnProperty('pageBreakBefore') ? this.props.element.pageBreakBefore : false;
		const thisCheckedAlternateForm = this.props.element.hasOwnProperty('alternateForm') ? this.props.element.alternateForm : false;

		const { canHavePageBreakBefore, canHaveAlternateForm, canHaveDisplayHorizontal, canHaveOptionCorrect, canHaveOptionValue } = this.props.element;
		const canHaveImageSize = (this.state.element.element === 'Image' || this.state.element.element === 'Camera');

		const thisFiles = this.props.files.length ? this.props.files : [];
		if (thisFiles.length < 1 || (thisFiles.length > 0 && thisFiles[0].id !== '')) {
			thisFiles.unshift({ id: '', file_name: '' });
		}

		let editorState;
		let secondaryEditorState;
		if (this.props.element.hasOwnProperty('content')) {
			editorState = this.convertFromHTML(this.props.element.content);
		}
		if (this.props.element.hasOwnProperty('label')) {
			editorState = this.convertFromHTML(this.props.element.label);
		}
		if (this.props.element.hasOwnProperty('boxLabel')) {
			secondaryEditorState = this.convertFromHTML(this.props.element.boxLabel);
		}
		return (
			<div>
				<div className="clearfix">
					<h4 className="float-start">{this.props.element.text}</h4>
					<FaTimes className="float-end dismiss-edit" onClick={this.props.manualEditModeOff} />
				</div>

				{this.props.element.hasOwnProperty('content') &&
					<Form.Group>
						<Form.Label><IntlMessages id="text-to-display" />:</Form.Label>
						<Editor
							toolbar={toolbar}
							defaultEditorState={editorState}
							onBlur={this.updateElement.bind(this)}
							onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'content')}
							stripPastedStyles={true} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('filePath') &&
					<Form.Group>
						<Form.Label htmlFor="fileSelect"><IntlMessages id="choose-file" />:</Form.Label>
						<Form.Select id="fileSelect" defaultValue={this.props.element.filePath} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'filePath', 'value')}>
							{thisFiles.map((file) => {
								const thisKey = `file_${file.id}`;
								return <option value={file.id} key={thisKey}>{file.file_name}</option>;
							})}
						</Form.Select>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('href') &&
					<Form.Group>
						<TextAreaAutosize type="text" className="form-control" defaultValue={this.props.element.href} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'href', 'value')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('label') &&
					<Form.Group>
						<Form.Label><IntlMessages id="display-label" /></Form.Label>
						<Editor
							toolbar={toolbar}
							defaultEditorState={editorState}
							onBlur={this.updateElement.bind(this)}
							onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'label')}
							stripPastedStyles={true} />
						<br />
						<Form.Check id="is-required" label={<IntlMessages id="required" />} type="checkbox" checked={thisChecked} value={true} onChange={this.editElementProp.bind(this, 'required', 'checked')} />
						
						{this.props.element.hasOwnProperty('readOnly') &&
							<Form.Check id="is-read-only" label={<IntlMessages id="read-only" />} type="checkbox" checked={thisReadOnly} value={true} onChange={this.editElementProp.bind(this, 'readOnly', 'checked')} />
						}

						{this.props.element.hasOwnProperty('defaultToday') &&
							<Form.Check id="is-default-to-today" label={<IntlMessages id="default-to-today" />} type="checkbox" checked={thisDefaultToday} value={true} onChange={this.editElementProp.bind(this, 'defaultToday', 'checked')} />
						}

						{/* {this.props.element.hasOwnProperty('showTimeSelect') &&
							<Form.Check id="show-time-select" label={<IntlMessages id="show-time-select" />} type="checkbox" checked={this_show_time_select} value={true} onChange={this.editElementProp.bind(this, 'showTimeSelect', 'checked')} />
						}

						{this_show_time_select && this.props.element.hasOwnProperty('showTimeSelectOnly') &&
							<Form.Check id="show-time-select-only" label={<IntlMessages id="show-time-select-only" />} type="checkbox" checked={this_show_time_select_only} value={true} onChange={this.editElementProp.bind(this, 'showTimeSelectOnly', 'checked')} />
						}

						{this.props.element.hasOwnProperty('showTimeInput') &&
							<Form.Check id="show-time-input" label={<IntlMessages id="show-time-input" />} type="checkbox" checked={this_show_time_input} value={true} onChange={this.editElementProp.bind(this, 'showTimeInput', 'checked')} />
						} */}

						{(['Checkboxes', 'Checkbox'].indexOf(this.state.element.element) !== -1) &&
							<Form.Check id="default-checked" label={<IntlMessages id="default-checked" />} type="checkbox" checked={thisDefaultChecked} value={true} onChange={this.editElementProp.bind(this, 'defaultChecked', 'checked')} />
						}

						{(this.state.element.element === 'RadioButtons' || this.state.element.element === 'Checkboxes') && canHaveDisplayHorizontal &&
							<Form.Check id="display-horizontal" label={<IntlMessages id="display-horizontal" />} type="checkbox" checked={thisCheckedInline} value={true} onChange={this.editElementProp.bind(this, 'inline', 'checked')} />
						}
					</Form.Group>
				}

				{this.state.element.element === 'Checkbox' &&
					<Form.Group>
						<Form.Label><IntlMessages id="checkbox-label-text" />:</Form.Label>
						<Editor
							toolbar={toolbar}
							defaultEditorState={secondaryEditorState}
							onBlur={this.updateElement.bind(this)}
							onEditorStateChange={this.onEditorStateChange.bind(this, 0, 'boxLabel')}
							stripPastedStyles={true} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('src') &&
					<div>
						<Form.Group>
							<Form.Label htmlFor="srcInput"><IntlMessages id="link-to" />:</Form.Label>
							<Form.Control id="srcInput" type="text" defaultValue={this.props.element.src} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'src', 'value')} />
						</Form.Group>
					</div>
				}

				{canHaveImageSize &&
					<div>
						<Form.Group>
							<Form.Check id="do-center" label={<IntlMessages id="center" />} type="checkbox" checked={thisCheckedCenter} value={true} onChange={this.editElementProp.bind(this, 'center', 'checked')} />
						</Form.Group>
						<Row>
							<Col sm={3}>
								<Form.Label htmlFor="elementWidth"><IntlMessages id="width" />:</Form.Label>
								<Form.Control id="elementWidth" type="text" defaultValue={this.props.element.width} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'width', 'value')} />
							</Col>
							<Col sm={3}>
								<Form.Label htmlFor="elementHeight"><IntlMessages id="height" />:</Form.Label>
								<Form.Control id="elementHeight" type="text" defaultValue={this.props.element.height} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'height', 'value')} />
							</Col>
						</Row>
					</div>
				}

				{this.state.element.element === 'FileUpload' && (
					<div>
						<Form.Group>
							<Form.Label className='control-label' htmlFor='fileType'><IntlMessages id='choose-file-type' />:</Form.Label>
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
					</div>
				)}

				{/* {this.state.element.element === 'Signature' && this.props.element.readOnly */}
				{/*   ? ( */}
				{/*     <Form.Group> */}
				{/*       <Form.Label htmlFor="variableKey"><IntlMessages id="variable-key" />:</Form.Label> */}
				{/*       <Form.Control id="variableKey" type="text" defaultValue={this.props.element.variableKey} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'variableKey', 'value')} /> */}
				{/*       <p className="help-block"><IntlMessages id="variable-key-desc" />.</p> */}
				{/*     </Form.Group> */}
				{/*   ) */}
				{/*   : (<div/>) */}
				{/* } */}

				{canHavePageBreakBefore &&
					<Form.Group>
						<Form.Label><IntlMessages id="print-options" /></Form.Label>
						<Form.Check id="page-break-before-element" label={<IntlMessages id="page-break-before-element" />} type="checkbox" checked={thisCheckedPageBreak} value={true} onChange={this.editElementProp.bind(this, 'pageBreakBefore', 'checked')} />
					</Form.Group>
				}

				{canHaveAlternateForm &&
					<Form.Group>
						<Form.Label><IntlMessages id="alternate-signature-page" /></Form.Label>
						<Form.Check id="display-on-alternate" label={<IntlMessages id="display-on-alternate-signature-page" />} type="checkbox" checked={thisCheckedAlternateForm} value={true} onChange={this.editElementProp.bind(this, 'alternateForm', 'checked')} />
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('step') &&
					<Form.Group>
						<div className="form-group-range">
							<Form.Label htmlFor="rangeStep"><IntlMessages id="step" /></Form.Label>
							<Form.Control id="rangeStep" type="number" defaultValue={this.props.element.step} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'step', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('minValue') &&
					<Form.Group>
						<div className="form-group-range">
							<Form.Label htmlFor="rangeMin"><IntlMessages id="min" /></Form.Label>
							<Form.Control id="rangeMin" type="number" defaultValue={this.props.element.minValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'minValue', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('minLabel') &&
					<Form.Group>
						<div className="form-group-range">
							<Form.Label htmlFor="rangeMin"><IntlMessages id="min-label" /></Form.Label>
							<Form.Control type="text" defaultValue={this.props.element.minLabel} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'minLabel', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('maxValue') &&
					<Form.Group>
						<div className="form-group-range">
							<Form.Label htmlFor="rangeMax"><IntlMessages id="max" /></Form.Label>
							<Form.Control id="rangeMax" type="number" defaultValue={this.props.element.maxValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'maxValue', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('maxLabel') &&
					<Form.Group>
						<div className="form-group-range">
							<Form.Label htmlFor="rangeMax"><IntlMessages id="max-label" /></Form.Label>
							<Form.Control type="text" defaultValue={this.props.element.maxLabel} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'maxLabel', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('defaultValue') &&
					<Form.Group>
						<div className="form-group-range">
							<Form.Label htmlFor="defaultSelected"><IntlMessages id="default-selected" /></Form.Label>
							<Form.Control id="defaultSelected" type="number" defaultValue={this.props.element.defaultValue} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'defaultValue', 'value')} />
						</div>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('static') && this.props.element.static &&
					<Form.Group>
						<Form.Label><IntlMessages id="text-style" /></Form.Label>
						<Form.Check id="do-bold" label={<IntlMessages id="bold" />} type="checkbox" checked={this_checked_bold} value={true} onChange={this.editElementProp.bind(this, 'bold', 'checked')} />
						<Form.Check id="do-italic" label={<IntlMessages id="italic" />} type="checkbox" checked={thisCheckedItalic} value={true} onChange={this.editElementProp.bind(this, 'italic', 'checked')} />
					</Form.Group>
				}

				{this.props.element.showPlaceholder &&
					<Form.Group>
						<Form.Label htmlFor="placeholder"><IntlMessages id="place-holder-text-label" /></Form.Label>
						<Form.Control type="text" id="placeholder" defaultValue={this.props.element.placeholder} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'placeholder', 'value')} />
					</Form.Group>
				}

				{this.props.element.showCustomName &&
					<Form.Group>
						<Form.Label htmlFor="customName"><IntlMessages id="custom-name-label" /></Form.Label>
						<Form.Control type="text" id="customName" defaultValue={this.props.element.customName} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'customName', 'value')} />
					</Form.Group>
				}

				{this.props.element.showLabelLocationPicker &&
					<Form.Group>
						<Form.Label htmlFor="labelLocation"><IntlMessages id="choose-label-location" />:</Form.Label>
						<Form.Select id="labelLocation" defaultValue={this.props.element.labelLocation} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'labelLocation', 'value')}>
							<option value="ABOVE">Above Form Field</option>
							<option value="FLOATING">Floating Inside Form Field</option>
						</Form.Select>
					</Form.Group>
				}

				{this.props.element.showHelp &&
					<Form.Group>
						<Form.Label htmlFor="help"><IntlMessages id="help-label" /></Form.Label>
						<TextAreaAutosize type="text" className="form-control" id="help" defaultValue={this.props.element.help} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'help', 'value')} />
					</Form.Group>
				}

				{this.props.element.showDescription &&
					<Form.Group>
						<Form.Label htmlFor="questionDescription"><IntlMessages id="description" /></Form.Label>
						<TextAreaAutosize type="text" className="form-control" id="questionDescription" defaultValue={this.props.element.description} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'description', 'value')} />
					</Form.Group>
				}

				{this.props.showCorrectColumn && this.props.element.canHaveAnswer && !this.props.element.hasOwnProperty('options') &&
					<Form.Group>
						<Form.Label htmlFor="correctAnswer"><IntlMessages id="correct-answer" /></Form.Label>
						<Form.Control id="correctAnswer" type="text" defaultValue={this.props.element.correct} onBlur={this.updateElement.bind(this)} onChange={this.editElementProp.bind(this, 'correct', 'value')} />
					</Form.Group>
				}

				{this.props.element.canPopulateFromApi && this.props.element.hasOwnProperty('options') &&
					<Form.Group>
						<Form.Label htmlFor="optionsApiUrl"><IntlMessages id="populate-options-from-api" /></Form.Label>
						<Row>
							<Col sm={6}>
								<Form.Control style={{ width: '100%' }} type="text" id="optionsApiUrl" placeholder="http://localhost:8080/api/optionsdata" />
							</Col>
							<Col sm={6}>
								<Button variant="success" onClick={this.addOptions.bind(this)}><IntlMessages id="populate" /></Button>
							</Col>
						</Row>
					</Form.Group>
				}

				{this.props.element.hasOwnProperty('options') &&
					<DynamicOptionList showCorrectColumn={this.props.showCorrectColumn}
						canHaveOptionCorrect={canHaveOptionCorrect}
						canHaveOptionValue={canHaveOptionValue}
						data={this.props.preview.state.data}
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