import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Preview from './preview';
import Toolbar from './toolbar';
import SurveyGenerator from './form';
import SurveyFieldGenerator from './form-fields';
import SurveyStepGenerator from './form-steps';
import store from './stores/store';
import Registry from './stores/registry';
import { Button, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';

const ReactSurveyBuilder = ({ items = [], showCorrectColumn = false, files = [], saveAlways = false, toolbarItems = [], customToolbarItems = [], showDescription = false, surveyName = null, saveSurveyName = null, previewSurveyBlock = null, renderEditForm, variables, staticVariables, checkboxButtonClassName, headerClassName, labelClassName, paragraphClassName, helpClassName, onPost, onLoad, url, saveUrl }) => {
	const [editMode, setEditMode] = React.useState(false);
	const [editElement, setEditElement] = React.useState(null);

	const saveFormData = () => {
		store.dispatch('post');
	};

	return (
		<DndProvider backend={HTML5Backend}>
			<Container fluid className="react-survey-builder position-absolute overflow-hidden" style={{ height: '100%' }}>
				<Row className="overflow-hidden h-100">
					<Col xs={9} className="overflow-hidden h-100">
						<Preview
							files={files}
							showCorrectColumn={showCorrectColumn}
							showDescription={showDescription}
							items={items}
							url={url}
							saveUrl={saveUrl}
							onLoad={onLoad}
							onPost={onPost}
							editMode={editMode}
							setEditMode={setEditMode}
							variables={variables}
							staticVariables={staticVariables}
							registry={Registry}
							editElement={editElement}
							setEditElement={setEditElement}
							renderEditForm={renderEditForm}
							saveAlways={saveAlways}
							checkboxButtonClassName={checkboxButtonClassName}
							headerClassName={headerClassName} 
							labelClassName={labelClassName} 
							paragraphClassName={paragraphClassName} 
							helpClassName={helpClassName}
						/>
					</Col>
					<Col xs={3} className="overflow-hidden h-100">
						<Toolbar toolbarTop={
							<>
								<div>
									<h3>{surveyName ?? 'Preview'}</h3>
								</div>

								<div className="d-grid gap-3 mb-3">
									{!!!saveAlways ? (<Button onClick={() => { saveFormData(); }}>{saveSurveyName || 'Save Survey'}</Button>) : null}
									{previewSurveyBlock ? previewSurveyBlock : null}
								</div>
							</>
						} showDescription={showDescription} items={toolbarItems} customItems={customToolbarItems} />
					</Col>
				</Row>

			</Container>
		</DndProvider>
	);
};

const ReactSurveyGenerator = (props) => {
	return <SurveyGenerator {...props} />;
};

const ReactSurveyFieldGenerator = (props) => {
	return <SurveyFieldGenerator {...props} />;
};

const ReactSurveyStepGenerator = (props) => {
	return <SurveyStepGenerator {...props} />;
};

const cleanUpSurveyItems = (items = []) => {
	return items.map((item) => {
		let dataItem = {
			id: item.id,
			element: item.element ?? (item.key ?? ''),
			text: item.text,
			static: item.static
		};

		if (item.childItems !== undefined && item.childItems !== null) { dataItem.childItems = item.childItems; }
		if (item.name !== undefined && item.name !== null) { dataItem.name = item.name; }
		if (item.conditional !== undefined && item.conditional !== null) { dataItem.conditional = item.conditional; }
		if (item.conditionalFieldName !== undefined && item.conditionalFieldName !== null) { dataItem.conditionalFieldName = item.conditionalFieldName; }
		if (item.conditionalFieldValue !== undefined && item.conditionalFieldValue !== null) { dataItem.conditionalFieldValue = item.conditionalFieldValue; }
		if (item.hideNextStepButton !== undefined && item.hideNextStepButton !== null) { dataItem.hideNextStepButton = item.hideNextStepButton; }
		if (item.submitOnSelection !== undefined && item.submitOnSelection !== null) { dataItem.submitOnSelection = item.submitOnSelection; }

		if (item.showRadio !== undefined && item.showRadio !== null) { dataItem.showRadio = item.showRadio; }
		if (item.bgColor !== undefined && item.bgColor !== null) { dataItem.bgColor = item.bgColor; }
		if (item.textColor !== undefined && item.textColor !== null) { dataItem.textColor = item.textColor; }
		if (item.className !== undefined && item.className !== null) { dataItem.className = item.className; }
		if (item.fieldLabelClassName !== undefined && item.fieldLabelClassName !== null) { dataItem.fieldLabelClassName = item.fieldLabelClassName; }
		if (item.fieldDescriptionClassName !== undefined && item.fieldDescriptionClassName !== null) { dataItem.fieldDescriptionClassName = item.fieldDescriptionClassName; }
		if (item.selectedClassName !== undefined && item.selectedClassName !== null) { dataItem.selectedClassName = item.selectedClassName; }
		if (item.unselectedClassName !== undefined && item.unselectedClassName !== null) { dataItem.unselectedClassName = item.unselectedClassName; }
		if (item.selectedColor !== undefined && item.selectedColor !== null) { dataItem.selectedColor = item.selectedColor; }
		if (item.unselectedColor !== undefined && item.unselectedColor !== null) { dataItem.unselectedColor = item.unselectedColor; }

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
		if (item.reportForm !== undefined && item.reportForm !== null) { dataItem.reportForm = item.reportForm; }
		if (item.defaultToday !== undefined && item.defaultToday !== null) { dataItem.defaultToday = item.defaultToday; }
		if (item.content !== undefined && item.content !== null) { dataItem.content = item.content; }
		if (item.href !== undefined && item.href !== null) { dataItem.href = item.href; }
		if (item.inherited !== undefined && item.inherited !== null) { dataItem.inherited = item.inherited; }

		if (item.isContainer !== undefined && item.isContainer !== null) { dataItem.isContainer = item.isContainer; }

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
};

const SurveyBuilders = {};
SurveyBuilders.ReactSurveyBuilder = ReactSurveyBuilder;
SurveyBuilders.ReactSurveyGenerator = ReactSurveyGenerator;
SurveyBuilders.ReactSurveyFieldGenerator = ReactSurveyFieldGenerator;
SurveyBuilders.ReactSurveyStepGenerator = ReactSurveyStepGenerator;
SurveyBuilders.ElementStore = store;
SurveyBuilders.Registry = Registry;
SurveyBuilders.cleanUpSurveyItems = cleanUpSurveyItems;

export default SurveyBuilders;

export { cleanUpSurveyItems, ReactSurveyBuilder, ReactSurveyGenerator, ReactSurveyFieldGenerator, ReactSurveyStepGenerator, store as ElementStore, Registry };