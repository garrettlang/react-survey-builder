/**
  * <SurveyValidator />
  */

import React from 'react';
import xss from 'xss';
import IntlMessages from './language-provider/IntlMessages';
import { FaExclamationTriangle } from 'react-icons/fa';

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

export default class SurveyValidator extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			errors: [],
		};
	}

	componentDidMount() {
		this.subscription = this.props.emitter.addListener('surveyValidation', (errors) => {
			this.setState({ errors });
		});
	}

	componentWillUnmount() {
		this.subscription.remove();
	}

	dismissModal(e) {
		e.preventDefault();
		this.setState({ errors: [] });
	}

	render() {
		const errors = this.state.errors.map((error, index) => <li key={`error_${index}`} dangerouslySetInnerHTML={{ __html: myxss.process(error) }} />);

		return (
			<div>
				{this.state.errors.length > 0 &&
					<div className="alert alert-danger validation-error">
						<div className="clearfix">
							<FaExclamationTriangle className="float-start" />
							<ul className="float-start">
								{errors}
							</ul>
						</div>
						<div className="clearfix">
							<a className="float-end btn btn-default btn-sm btn-danger" onClick={this.dismissModal.bind(this)}><IntlMessages id="dismiss" /></a>
						</div>
					</div>
				}
			</div>
		);
	}
}
