/* eslint-disable no-undef */
// const e = React.createElement;
const SurveyBuilder = ReactSurveyBuilder.ReactSurveyBuilder;
const domContainer = document.querySelector('#form-builder');

ReactDOM.render(e(SurveyBuilder, { url: '/api/formdata', saveUrl: '/api/formdata' }), domContainer);
