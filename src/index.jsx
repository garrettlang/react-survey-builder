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
									<div className={this.props.surveyToolbarClassName}>
										<div className="border border-light border-3 p-3 d-grid gap-1 mb-3">
											{this.props.editSurveyBlock ?? (
												<div>
													<h4>{this.props.surveyName ?? 'Preview'}</h4>
												</div>
											)}
											{!!!this.props.saveAlways &&
												<Button variant="primary" onClick={() => { this.saveFormData(); }}>{this.props.saveSurveyName ?? 'Save Survey'}</Button>
											}
										</div>
										{this.props.previewSurveyBlock ? (
											<div className="border border-light border-3 p-3 d-grid gap-1 mb-3">
												{this.props.previewSurveyBlock}
											</div>
										) : null}
									</div>
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

const SurveyBuilders = {};
SurveyBuilders.ReactSurveyBuilder = ReactSurveyBuilder;
SurveyBuilders.ReactSurveyGenerator = ReactSurveyGenerator;
SurveyBuilders.ReactSurveyFieldGenerator = ReactSurveyFieldGenerator;
SurveyBuilders.ElementStore = store;
SurveyBuilders.Registry = Registry;

export default SurveyBuilders;

export { ReactSurveyBuilder, ReactSurveyGenerator, ReactSurveyFieldGenerator, store as ElementStore, Registry };