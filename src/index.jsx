/**
  * <ReactSurveyBuilder />
*/

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IntlProvider } from 'react-intl';
import Preview from './preview';
import Toolbar from './toolbar';
import SurveyGenerator from './form';
import SurveyFieldGenerator from './form-fields';
import store from './stores/store';
import Registry from './stores/registry';
import AppLocale from './language-provider';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

class ReactSurveyBuilder extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			editMode: false,
			editElement: null,
		};
		this.editModeOn = this.editModeOn.bind(this);
	}

	editModeOn($dataItem, e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.state.editMode) {
			this.setState({ editMode: !this.state.editMode, editElement: null });
		} else {
			this.setState({ editMode: !this.state.editMode, editElement: $dataItem });
		}
	}

	manualEditModeOff() {
		if (this.state.editMode) {
			this.setState({
				editMode: false,
				editElement: null,
			});
		}
	}

	saveFormData() {
		store.dispatch('post');
	}

	render() {
		const toolbarProps = { showDescription: this.props.showDescription };

		const language = this.props.locale ? this.props.locale : 'en';
		const currentAppLocale = AppLocale[language];
		if (this.props.toolbarItems) { toolbarProps.items = this.props.toolbarItems; }

		return (
			<DndProvider backend={HTML5Backend}>
				<IntlProvider locale={currentAppLocale.locale} messages={currentAppLocale.messages}>
					<div>
						<Container fluid className="react-survey-builder">
							<Row>
								<Col md={9}>
									<Preview
										files={this.props.files}
										manualEditModeOff={this.manualEditModeOff.bind(this)}
										showCorrectColumn={this.props.showCorrectColumn}
										parent={this}
										items={this.props.items}
										url={this.props.url}
										saveUrl={this.props.saveUrl}
										onLoad={this.props.onLoad}
										onPost={this.props.onPost}
										editModeOn={this.editModeOn}
										editMode={this.state.editMode}
										variables={this.props.variables}
										registry={Registry}
										editElement={this.state.editElement}
										renderEditForm={this.props.renderEditForm}
										saveAlways={this.props.saveAlways}
									/>
								</Col>
								<Col md={3}>
									{(!!!this.props.saveAlways || this.props.editSurveyBlock || this.props.previewSurveyBlock || this.props.surveyName) &&
										<div className={this.props.surveyToolbarClassName}>
											{(!!!this.props.saveAlways || this.props.editSurveyBlock || this.props.surveyName) &&
												<div className="border border-light border-3 p-3 d-grid gap-1 mb-3">
													{this.props.editSurveyBlock ?? (this.props.surveyName ? (
														<div>
															<h4>{this.props.surveyName}</h4>
														</div>
													) : null)}
													{!!!this.props.saveAlways &&
														<Button variant="primary" onClick={() => { this.saveFormData(); }}>{this.props.saveSurveyName ?? 'Save Survey'}</Button>
													}
												</div>
											}
											{this.props.previewSurveyBlock ? (
												<div className="border border-light border-3 p-3 d-grid gap-1 mb-3">
													{this.props.previewSurveyBlock}
												</div>
											) : null}
										</div>
									}
									<Toolbar {...toolbarProps} customItems={this.props.customToolbarItems} />
								</Col>
							</Row>
						</Container>
					</div>
				</IntlProvider>
			</DndProvider>
		);
	}
}

function ReactSurveyGenerator(props) {
	const language = props.locale ? props.locale : 'en';
	const currentAppLocale = AppLocale[language];
	return (
		<IntlProvider
			locale={currentAppLocale.locale}
			messages={currentAppLocale.messages}>
			<SurveyGenerator {...props} />
		</IntlProvider>
	);
}

function ReactSurveyFieldGenerator(props) {
	const language = props.locale ? props.locale : 'en';
	const currentAppLocale = AppLocale[language];
	return (
		<IntlProvider
			locale={currentAppLocale.locale}
			messages={currentAppLocale.messages}>
			<SurveyFieldGenerator {...props} />
		</IntlProvider>
	);
}

const cleanUpSurveyItems = (items = []) => {
	return items.map((item) => {
		let dataItem = {
			id: item.id,
			element: item.element ?? (item.key ?? ''),
			text: item.text,
			static: item.static
		};

		if (item.groupName !== undefined && item.groupName !== null) { dataItem.groupName = item.groupName; }
		if (item.required !== undefined && item.required !== null) { dataItem.required = item.required; }
		if (item.description !== undefined && item.description !== null) { dataItem.description = item.description; }
		if (item.placeholder !== undefined && item.placeholder !== null) { dataItem.placeholder = item.placeholder; }
		if (item.bold !== undefined && item.bold !== null) { dataItem.bold = item.bold; }
		if (item.italic !== undefined && item.italic !== null) { dataItem.italic = item.italic; }
		if (item.labelLocation !== undefined && item.labelLocation !== null) { dataItem.labelLocation = item.labelLocation; }
		if (item.help !== undefined && item.help !== null) { dataItem.help = item.help; }
		if (item.hideLabel !== undefined && item.hideLabel !== null) { dataItem.hideLabel = item.hideLabel; }
		if (item.readOnly !== undefined && item.readOnly !== null) { dataItem.readOnly = item.readOnly; }
		if (item.defaultToday !== undefined && item.defaultToday !== null) { dataItem.defaultToday = item.defaultToday; }
		if (item.content !== undefined && item.content !== null) { dataItem.content = item.content; }
		if (item.href !== undefined && item.href !== null) { dataItem.href = item.href; }
		if (item.inherited !== undefined && item.inherited !== null) { dataItem.inherited = item.inherited; }


		if (item.type === 'custom') {
			elementOptions.key = item.key;
			elementOptions.custom = true;
			elementOptions.forwardRef = item.forwardRef;
			elementOptions.bare = item.bare;
			elementOptions.props = item.props;
			elementOptions.component = item.component || null;
			elementOptions.customOptions = item.customOptions || [];
		}

		if (item.pageBreakBefore !== undefined && item.pageBreakBefore !== null) { dataItem.pageBreakBefore = item.pageBreakBefore; }
		if (item.alternateForm !== undefined && item.alternateForm !== null) { dataItem.alternateForm = item.alternateForm; }
		if (item.inline !== undefined && item.inline !== null) { dataItem.inline = item.inline; }
		if (item.className !== undefined && item.className !== null) { dataItem.className = item.className; }
		if (item.src !== undefined && item.src !== null) { dataItem.src = item.src; }
		if (item.dateFormat !== undefined && item.dateFormat !== null) { dataItem.dateFormat = item.dateFormat; }
		if (item.filePath !== undefined && item.filePath !== null) { dataItem.filePath = item.filePath; }
		if (item.step !== undefined && item.step !== null) { dataItem.step = item.step; }
		if (item.minValue !== undefined && item.minValue !== null) { dataItem.minValue = item.minValue; }
		if (item.maxValue !== undefined && item.maxValue !== null) { dataItem.maxValue = item.maxValue; }
		if (item.minLabel !== undefined && item.minLabel !== null) { dataItem.minLabel = item.minLabel; }
		if (item.maxLabel !== undefined && item.maxLabel !== null) { dataItem.maxLabel = item.maxLabel; }
		if (item.defaultValue !== undefined && item.defaultValue !== null) { dataItem.defaultValue = item.defaultValue; }
		if (item.colCount !== undefined && item.colCount !== null) { dataItem.colCount = item.colCount; }
		if (item.fieldName !== undefined && item.fieldName !== null) { dataItem.fieldName = item.fieldName; }
		if (item.label !== undefined && item.label !== null) { dataItem.label = item.label; }
		if (item.options !== undefined && item.options !== null) { dataItem.options = item.options; }

		return dataItem;
	});
}

const SurveyBuilders = {};
SurveyBuilders.ReactSurveyBuilder = ReactSurveyBuilder;
SurveyBuilders.ReactSurveyGenerator = ReactSurveyGenerator;
SurveyBuilders.ReactSurveyFieldGenerator = ReactSurveyFieldGenerator;
SurveyBuilders.ElementStore = store;
SurveyBuilders.Registry = Registry;
SurveyBuilders.cleanUpSurveyItems = cleanUpSurveyItems;

export default SurveyBuilders;

export { cleanUpSurveyItems, ReactSurveyBuilder, ReactSurveyGenerator, ReactSurveyFieldGenerator, store as ElementStore, Registry };