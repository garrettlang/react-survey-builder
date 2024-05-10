import React from 'react';
import xss from 'xss';
import { FaExclamationTriangle } from 'react-icons/fa';
import { Alert, Button } from 'react-bootstrap';

const myxss = new xss.FilterXSS({
	whiteList: {
		u: [],
		br: [],
		b: [],
		i: [],
		ol: ['style'],
		ul: ['style'],
		li: [],
		p: ['style'],
		sub: [],
		sup: [],
		div: ['style'],
		em: [],
		strong: [],
		span: ['style'],
	},
});

const SurveyValidator = (props) => {
	const [errors, setErrors] = React.useState([]);

	React.useEffect(() => {
		const subscription = props.emitter.addListener('surveyValidation', (errorsList) => {
			setErrors(errorsList);
		});

		return () => { subscription.remove() };
	}, []);


	const dismissModal = (e) => {
		e.preventDefault();
		setErrors([]);
	}

	return (
		<div>
			{errors.length > 0 &&
				<Alert variant="danger" className="validation-error d-flex-inline justify-content-between">
					<div>
						<FaExclamationTriangle className="float-start" />
						<ul className="float-start">
							{errors.map((error, index) => <li key={`error_${index}`} dangerouslySetInnerHTML={{ __html: myxss.process(error) }} />)}
						</ul>
					</div>
					<div>
						<Button variant="danger" size="sm" className="float-end" onClick={dismissModal}>Dismiss</Button>
					</div>
				</Alert>
			}
		</div>
	);
};

export default SurveyValidator;