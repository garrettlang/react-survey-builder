import React from 'react';
import { ReactSurveyFieldGenerator, ReactSurveyGenerator } from './src/index';
import { Button, Container, Modal, Navbar } from 'react-bootstrap';
import { FormProvider, useForm } from 'react-hook-form';

const HeaderBar = ({ variables, data, ...props }) => {
	//#region useForms

	const methods = useForm({ mode: 'all', reValidateMode: 'onChange', criteriaMode: 'all', shouldFocusError: true, shouldUnregister: true });

	//#endregion

	const [answers, setAnswers] = React.useState([]);
	const [previewVisible, setpreviewVisible] = React.useState(false);
	const [shortPreviewVisible, setshortPreviewVisible] = React.useState(false);
	const [roPreviewVisible, setroPreviewVisible] = React.useState(false);
	const [previewRHFVisible, setpreviewRHFVisible] = React.useState(false);

	const showPreview = () => {
		setpreviewVisible(true);
	};

	const showRHFPreview = () => {
		setpreviewRHFVisible(true);
	}

	const showShortPreview = () => {
		setshortPreviewVisible(true);
	};

	const showRoPreview = () => {
		setroPreviewVisible(true);
	};

	const closePreview = () => {
		setpreviewVisible(false);
		setpreviewRHFVisible(false);
		setshortPreviewVisible(false);
		setroPreviewVisible(false);
	}

	const _onChange = (dataArray) => {
		setAnswers(dataArray);
		console.log('onChange', dataArray);
	};

	// eslint-disable-next-line no-unused-vars
	const _onSubmit = (dataArray) => {
		setAnswers(dataArray);
		console.log('onSubmit', dataArray);
		// Place code to post json data to server here
	};

	return (
		<>
			<Navbar bg="light" sticky="bottom" data-bs-theme="light">
				<Container fluid>
					<Navbar.Text>Save the Survey prior to Previewing</Navbar.Text>
					<div className="ms-auto">
						<Button variant="success" className="mx-1" onClick={() => { showRHFPreview(); }}>Preview React Hook Form Survey</Button>
						<Button variant="info" className="mx-1" onClick={() => { showPreview(); }}>Preview Survey</Button>
						<Button variant="secondary" className="mx-1" onClick={() => { showShortPreview(); }}>Alternate/Short Survey</Button>
						<Button variant="secondary" className="mx-1" onClick={() => { showRoPreview(); }}>Read Only Survey</Button>
					</div>
				</Container>
			</Navbar>

			<Modal
				show={previewRHFVisible}
				dialogClassName="modal-lg"
				size="lg"
				contentClassName="border border-light"
				onHide={closePreview}
				backdrop="static"
				scrollable
				centered
			>
				<Modal.Body className="p-2">
					<FormProvider  {...methods}>
						<ReactSurveyFieldGenerator
							downloadPath=""
							backAction={closePreview}
							backName="Cancel"
							answers={answers}
							actionName="Save"
							formAction="/api/form"
							formMethod="POST"
							// skipValidations={true}
							onSubmit={_onSubmit}
							onChange={_onChange}
							variables={variables}
							data={data}
							locale='en'
							buttonClassName="d-grid gap-2"
							formId="test-form"
						/>
					</FormProvider>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={previewVisible}
				dialogClassName="modal-lg"
				size="lg"
				contentClassName="border border-light"
				onHide={closePreview}
				backdrop="static"
				scrollable
				centered
			>
				<Modal.Body className="p-2">
					<ReactSurveyGenerator
						downloadPath=""
						backAction={closePreview}
						backName="Cancel"
						answerData={answers}
						actionName="Save"
						formAction="/api/form"
						formMethod="POST"
						// skipValidations={true}
						onSubmit={_onSubmit}
						variables={variables}
						data={data}
						locale='en'
						buttonClassName="d-grid gap-2"
					/>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={roPreviewVisible}
				dialogClassName="modal-lg"
				size="lg"
				contentClassName="border border-light"
				onHide={closePreview}
				backdrop="static"
				scrollable
				centered
			>
				<Modal.Body className="p-2">
					<ReactSurveyGenerator
						downloadPath=""
						backAction={closePreview}
						backName="Back"
						answerData={answers}
						actionName="Save"
						formAction="/"
						formMethod="POST"
						readOnly={true}
						variables={variables}
						hideActions={true}
						data={data}
						locale='en'
					/>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={shortPreviewVisible}
				dialogClassName="modal-lg"
				size="lg"
				contentClassName="border border-light"
				onHide={closePreview}
				backdrop="static"
				scrollable
				centered
			>
				<Modal.Body className="p-2">
					<ReactSurveyGenerator
						downloadPath=""
						backAction={closePreview}
						answerData={answers}
						formAction="/"
						formMethod="POST"
						data={data}
						displayShort={true}
						variables={variables}
						hideActions={false}
						locale='en'
					/>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default HeaderBar;