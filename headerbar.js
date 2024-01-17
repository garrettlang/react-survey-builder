import React from 'react';
import store from './src/stores/store';
import { ReactSurveyGenerator } from './src/index';
import { Button, ButtonGroup, ButtonToolbar, Container, Modal, Nav, Navbar } from 'react-bootstrap';

const answers = {};

export default class HeaderBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			previewVisible: false,
			shortPreviewVisible: false,
			roPreviewVisible: false,
		};

		const update = this._onChange.bind(this);
		this._onSubmit = this._onSubmit.bind(this);

		store.subscribe(state => update(state.data));
	}

	showPreview() {
		this.saveFormData();
		this.setState({
			previewVisible: true,
		});
	}

	showShortPreview() {
		this.saveFormData();
		this.setState({
			shortPreviewVisible: true,
		});
	}

	showRoPreview() {
		this.saveFormData();
		this.setState({
			roPreviewVisible: true,
		});
	}

	closePreview() {
		this.setState({
			previewVisible: false,
			shortPreviewVisible: false,
			roPreviewVisible: false,
		});
	}

	_onChange(data) {
		this.setState({
			data,
		});
	}

	// eslint-disable-next-line no-unused-vars
	_onSubmit(data) {
		console.log('onSubmit', data);
		// Place code to post json data to server here
	}

	saveFormData() {
		store.dispatch('post');
	}

	render() {
		let modalClass = 'modal';
		if (this.state.previewVisible) {
			modalClass += ' show d-block';
		}

		let shortModalClass = 'modal short-modal';
		if (this.state.shortPreviewVisible) {
			shortModalClass += ' show d-block';
		}

		let roModalClass = 'modal ro-modal';
		if (this.state.roPreviewVisible) {
			roModalClass += ' show d-block';
		}

		return (
			<>
				<Navbar bg="light" data-bs-theme="light">
					<Container fluid>
						<Navbar.Brand className='fw-bold text-black' as="h4">Preview</Navbar.Brand>
						<Button variant="primary" size="sm" onClick={() => this.saveFormData()}>Save Form</Button>

						<div className="ms-auto">
							<Button variant="info" className="mx-1" onClick={() => this.showPreview()}>Preview Form</Button>
							<Button variant="secondary" className="mx-1" onClick={() => this.showShortPreview()}>Alternate/Short Form</Button>
							<Button variant="secondary" className="mx-1" onClick={() => this.showRoPreview()}>Read Only Form</Button>
						</div>
					</Container>
				</Navbar>

				<Modal
					show={this.state.previewVisible}
					className={modalClass}
					dialogClassName="modal-lg"
					size="lg"
					contentClassName="border border-light"
					onHide={this.closePreview.bind(this)}
					backdrop="static"
					scrollable
					centered
				>
					<Modal.Body className="p-2">
						<ReactSurveyGenerator
							downloadPath=""
							backAction="/"
							backName="Back"
							answerData={answers}
							actionName="Save"
							formAction="/api/form"
							formMethod="POST"
							// skipValidations={true}
							onSubmit={this._onSubmit}
							variables={this.props.variables}
							data={this.state.data}
							locale='en'
						/>
					</Modal.Body>
					<Modal.Footer className="p-0">
						<Button variant="secondary" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					show={this.state.roPreviewVisible}
					className={roModalClass}
					dialogClassName="modal-lg"
					size="lg"
					contentClassName="border border-light"
					onHide={this.closePreview.bind(this)}
					backdrop="static"
					scrollable
					centered
				>
					<Modal.Body className="p-2">
						<ReactSurveyGenerator
							downloadPath=""
							backAction="/"
							backName="Back"
							answerData={answers}
							actionName="Save"
							formAction="/"
							formMethod="POST"
							readOnly={true}
							variables={this.props.variables}
							hideActions={true}
							data={this.state.data}
							locale='en'
						/>
					</Modal.Body>
					<Modal.Footer className="p-0">
						<Button variant="secondary" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					show={this.state.shortPreviewVisible}
					className={shortModalClass}
					dialogClassName="modal-lg"
					size="lg"
					contentClassName="border border-light"
					onHide={this.closePreview.bind(this)}
					backdrop="static"
					scrollable
					centered
				>
					<Modal.Body className="p-2">
						<ReactSurveyGenerator
							downloadPath=""
							backAction=""
							answerData={answers}
							formAction="/"
							formMethod="POST"
							data={this.state.data}
							displayShort={true}
							variables={this.props.variables}
							hideActions={false}
							locale='en'
						/>
					</Modal.Body>
					<Modal.Footer className="p-0">
						<Button variant="secondary" data-dismiss="modal" onClick={this.closePreview.bind(this)}>Close</Button>
					</Modal.Footer>
				</Modal>
			</>
		);
	}
}
