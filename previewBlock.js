import React from 'react';
import SurveyBuilders from './src';
import { Button, Modal } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { isListNotEmpty, isObjectNotEmpty, updateRecord } from './src/utils/objectUtils';

const { ReactSurveyFieldGenerator, ReactSurveyGenerator, ReactSurveyStepGenerator } = SurveyBuilders;

const PreviewBlock = ({ staticVariables, variables, data }) => {
	//#region useForms

	const methods = useForm({ mode: 'all', reValidateMode: 'onChange', criteriaMode: 'all', shouldFocusError: true, shouldUnregister: true });

	//#endregion

	const [answers, setAnswers] = React.useState([]);
	const [previewVisible, setpreviewVisible] = React.useState(false);
	const [shortPreviewVisible, setshortPreviewVisible] = React.useState(false);
	const [readOnlyPreviewVisible, setReadOnlyPreviewVisible] = React.useState(false);
	const [previewRHFVisible, setpreviewRHFVisible] = React.useState(false);
	const [stepPreviewVisible, setStepPreviewVisible] = React.useState(false);

	const [steps, setSteps] = React.useState([]);
	const [activeStep, setActiveStep] = React.useState(null);
	const [allAnswers, setAllAnswers] = React.useState([]);

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

	React.useMemo(() => {
		if (isListNotEmpty(data.filter(x => !x.parentId && x.element === 'Step'))) {
			let surveySteps = data.filter(x => !x.parentId && x.element === 'Step').map((step, index) => {
				return {
					...step,
					completed: false,
					hidden: step.conditional === true
				};
			});
			let firstStep = surveySteps[0];

			setSteps(surveySteps);

			if (isListNotEmpty(surveySteps)) {
				setActiveStep(firstStep);
			} else {
				setActiveStep(null);
			}
		}
	}, [data]);

	const onBackStep = async () => {
		let oldStep = isObjectNotEmpty(activeStep) ? { ...activeStep } : null;
		if (isObjectNotEmpty(oldStep)) {
			let availableSteps = steps.filter(i => i.hidden === false);
			let currentIndex = availableSteps.findIndex(i => i.id === oldStep.id);
			let previousIndex = currentIndex - 1;
			let previousStep = previousIndex >= 0 ? availableSteps[previousIndex] : null;
			if (isObjectNotEmpty(previousStep)) {
				setActiveStep(previousStep);
			} else {
				closePreview();
			}
		} else {
			closePreview();
		}
	};

	const onNextStep = async (e) => {
		let currentAnswers = isListNotEmpty(e.answers) ? [...e.answers] : [];
		let currentAllAnswers = [...allAnswers];
		currentAnswers.forEach((answer) => {
			if (answer.value !== undefined) {
				currentAllAnswers = updateRecord('name', answer, [...currentAllAnswers]);
			}
		});
		setAllAnswers(currentAllAnswers);

		let oldStep = isObjectNotEmpty(activeStep) ? { ...activeStep } : null;
		if (isObjectNotEmpty(oldStep)) {
			let updatedSteps = [...steps].map((step) => {
				if (step.id === oldStep.id) {
					return {
						...step,
						completed: true
					};
				} else {
					let hideStep = false;
					if (step.conditional === true) {
						hideStep = true;
						if (step.conditionalFieldName && step.conditionalFieldValue && isListNotEmpty(currentAllAnswers)) {
							const answerField = currentAllAnswers.find(i => i.name === step.conditionalFieldName);
							if (answerField !== undefined && answerField?.value !== undefined) {
								if (Array.isArray(step.conditionalFieldValue)) {
									if (Array.isArray(answerField?.value)) {
										let match = step.conditionalFieldValue.some(i => answerField.value.includes(i));
										if (match) {
											hideStep = false;
										}
									} else if (step.conditionalFieldValue.includes(answerField.value)) {
										hideStep = false;
									}
								} else {
									if (Array.isArray(answerField?.value)) {
										let match = answerField.value.includes(step.conditionalFieldValue);
										if (match) {
											hideStep = false;
										}
									} else if (step.conditionalFieldValue === answerField.value) {
										hideStep = false;
									}
								}
							}
						}
					}

					return {
						...step,
						hidden: hideStep
					};
				}
			});

			setSteps(updatedSteps);

			// get next incomplete step

			let availableSteps = updatedSteps.filter(i => i.hidden === false);
			let currentIndex = availableSteps.findIndex(i => i.id === oldStep.id);
			let nextIndex = currentIndex + 1;
			let nextStep = currentIndex < availableSteps.length ? availableSteps[nextIndex] : null;
			if (isObjectNotEmpty(nextStep)) {
				setActiveStep(nextStep);
			} else {
				console.log('Done');
				setAnswers(allAnswers);
				console.log('onSubmit', allAnswers);
			}
		}
	};

	// console.log('dataItems', data);
	// console.log('activeStep', activeStep);
	// console.log('steps', steps);
	// console.log('allAnswers', allAnswers);

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
						staticVariables={staticVariables}
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
						//backAction={closePreview}
						//backName="Cancel"
						answers={allAnswers}
						//actionName="Save"
						onSubmit={onNextStep}
						onChange={_onChange}
						variables={variables}
						staticVariables={staticVariables}
						activeStep={activeStep}
						items={data}
						hideActions={true}
						//buttonClassName="d-grid gap-2"
						formId="test-form"
						methods={methods}
					/>
					<div className="d-grid gap-2">
						<Button variant='secondary' onClick={onBackStep}>Back</Button>
						<Button variant='primary' type="submit" form="test-form">Next</Button>
					</div>
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
						staticVariables={staticVariables}
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
						staticVariables={staticVariables}
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
						staticVariables={staticVariables}
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