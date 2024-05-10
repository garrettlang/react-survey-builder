import React from 'react';
import SurveyBuilders from './src';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

const { ReactSurveyFieldGenerator, ReactSurveyGenerator, ReactSurveyStepGenerator } = SurveyBuilders;

const PreviewBlock = ({ variables, data }) => {

	console.log('dataItems', data);

	//#region useForms

	const methods = useForm({ mode: 'all', reValidateMode: 'onChange', criteriaMode: 'all', shouldFocusError: true, shouldUnregister: true });

	//#endregion

	const [answers, setAnswers] = React.useState([]);
	const [previewVisible, setpreviewVisible] = React.useState(false);
	const [shortPreviewVisible, setshortPreviewVisible] = React.useState(false);
	const [readOnlyPreviewVisible, setReadOnlyPreviewVisible] = React.useState(false);
	const [previewRHFVisible, setpreviewRHFVisible] = React.useState(false);
	const [stepPreviewVisible, setStepPreviewVisible] = React.useState(false);

	const showPreview = () => {
		setpreviewVisible(true);
	};

	const showRHFPreview = () => {
		setpreviewRHFVisible(true);
	}

	const showShortPreview = () => {
		setshortPreviewVisible(true);
	};

	const showReadOnlyPreview = () => {
		setReadOnlyPreviewVisible(true);
	};

	const showStepPreview = () => {
		setStepPreviewVisible(true);
	};

	const closePreview = () => {
		setpreviewVisible(false);
		setpreviewRHFVisible(false);
		setshortPreviewVisible(false);
		setReadOnlyPreviewVisible(false);
		setStepPreviewVisible(false);
	}

	const _onChange = (dataArray) => {
		setAnswers(dataArray.answers);
		console.log('onChange', dataArray);
	};

	// eslint-disable-next-line no-unused-vars
	const _onSubmit = (dataArray) => {
		setAnswers(dataArray.answers);
		console.log('onSubmit', dataArray);
		// Place code to post json data to server here
	};

	return (
		<>
			<Button variant="success" className="mx-1" onClick={() => { showRHFPreview(); }}>Survey with Injected React Hook Form</Button>
			<Button variant="info" className="mx-1" onClick={() => { showPreview(); }}>Survey</Button>
			<Button variant="danger" className="mx-1" onClick={() => { showStepPreview(); }}>Steps</Button>
			<Button variant="secondary" className="mx-1" onClick={() => { showShortPreview(); }}>Alternate/Short Survey</Button>
			<Button variant="warning" className="mx-1" onClick={() => { showReadOnlyPreview(); }}>Read Only Survey</Button>

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
					<ReactSurveyFieldGenerator
						downloadPath=""
						backAction={closePreview}
						backName="Cancel"
						answers={answers}
						actionName="Save"
						//formAction="/api/form"
						//formMethod="POST"
						// skipValidations={true}
						onSubmit={_onSubmit}
						onChange={_onChange}
						variables={variables}
						items={data}
						buttonClassName="d-grid gap-2"
						formId="test-form"
						methods={methods}
					/>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={stepPreviewVisible}
				dialogClassName="modal-lg"
				size="lg"
				contentClassName="border border-light"
				onHide={closePreview}
				backdrop="static"
				scrollable
				centered
			>
				<Modal.Body className="p-2">
					<ReactSurveyStepGenerator
						downloadPath=""
						backAction={closePreview}
						backName="Cancel"
						answers={answers}
						actionName="Save"
						onSubmit={_onSubmit}
						onChange={_onChange}
						variables={variables}
						items={data}
						buttonClassName="d-grid gap-2"
						formId="test-form"
						methods={methods}
					/>
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
						answers={answers}
						actionName="Save"
						// formAction="/api/form"
						// formMethod="POST"
						// skipValidations={true}
						onSubmit={_onSubmit}
						items={data}
						buttonClassName="d-grid gap-2"
					/>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={readOnlyPreviewVisible}
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
						answers={answers}
						actionName="Save"
						// formAction="/"
						// formMethod="POST"
						readOnly={false}
						variables={variables}
						hideActions={true}
						items={data}
						print={true}
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
						answers={answers}
						// formAction="/"
						// formMethod="POST"
						items={data}
						displayShort={true}
						variables={variables}
						hideActions={false}
						buttonClassName="d-grid gap-2"
					/>
				</Modal.Body>
				<Modal.Footer className="p-0">
					<Button variant="secondary" data-dismiss="modal" onClick={closePreview}>Close</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default PreviewBlock;