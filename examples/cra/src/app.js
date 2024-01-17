import React from 'react';
import { ReactSurveyBuilder } from 'react-survey-builder';
import * as variables from './variables';

const url = '/api/formdata';
const saveUrl = '/api/formdata';

const App = () => (
  <ReactSurveyBuilder
    variables={variables}
    url={url}
    saveUrl={saveUrl}
    locale='en'
    saveAlways={false}  
  />);

export default App;

