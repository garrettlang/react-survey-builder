import React from 'react';
import PreviewBlock from './previewBlock';
// eslint-disable-next-line no-unused-vars
import SurveyBuilder, { Registry } from './src/index';
import * as variables from './variables';

// Add our stylesheets for the demo.
import './scss/application.scss';

const url = '/api/formdata';
const saveUrl = '/api/formdata';

const TestComponent = () => <h2>Hello</h2>;

// const MyInput = React.forwardRef((props, ref) => {
//   const { name, defaultValue, disabled } = props;
//   return (
//     <>
//       <label style={{ marginRight: '1rem' }}><b>{ props.data.label }</b></label>
//       <input ref={ref} name={name} defaultValue={defaultValue} disabled={disabled} />;
//     </>
//   );
// });

// Registry.register('MyInput', MyInput);
// Registry.register('TestComponent', TestComponent);

// const items = [{
//     key: 'Header',
//   }, {
//     key: 'TextInput',
//   }, {
//     key: 'TextArea',
//   }, {
//     key: 'RadioButtons',
//   }, {
//     key: 'Checkboxes',
//   }, {
//     key: 'Image',
//   },
//   {
//     key: 'Fieldset',
//     label:"Field Set",
//     name:"Field Set",

//   },
//   {
//     groupName: 'Multi Column Row',
//     key: 'TwoColumnRow'
//   },
//   {
//     groupName: 'Multi Column Row',
//     key: 'ThreeColumnRow'
//   },
//   {
//     groupName: 'Multi Column Row',
//     key: 'FourColumnRow',
//     element: 'MultiColumnRow',
//   },
//   {
//     groupName: 'Multi Column Row',
//     key: 'FiveColumnRow',
//     element: 'MultiColumnRow',
//   },
//   {
//     groupName: 'Multi Column Row',
//     key: 'SixColumnRow',
//     element: 'MultiColumnRow',
//   },
//   {
//     groupName: 'Custom Element',
//     key: 'TestComponent',
//     element: 'CustomElement',
//     component: TestComponent,
//     type: 'custom',
//     fieldName: 'test_component',
//     name: 'Something You Want',
//     icon: 'fa fa-cog',
//     static: true,
//     props: { test: 'test_comp' },
//     label: 'Label Test',
//   },
//   {
//     groupName: 'Custom Element',
//     key: 'MyInput',
//     element: 'CustomElement',
//     component: MyInput,
//     type: 'custom',
//     forwardRef: true,
//     bare: true,
//     fieldName: 'my_input_',
//     name: 'My Input',
//     icon: 'fa fa-cog',
//     props: { test: 'test_input' },
//     label: 'Label Input',
//   },
// ];

const staticVariables = { firstName: 'John', lastName: 'Doe' };

const App = () => {
	const [data, setData] = React.useState([]);

	return (
		<>
			<SurveyBuilder.ReactSurveyBuilder
				surveyName={'Test Survey'}
				previewSurveyBlock={<PreviewBlock staticVariables={staticVariables} variables={variables} data={data} />}
				saveSurveyName="Save Survey Blocks"
				surveyToolbarClassName="bg-white sticky-top"
				// variables={variables}
				staticVariables={staticVariables}
				// url={url}
				// saveUrl={saveUrl}
				saveAlways
				// toolbarItems={items}
				showCorrectColumn
				showDescription
				editMode
				onPost={($data) => { console.log('onPost', $data.task_data); setData($data.task_data); }}
			/>
		</>
	);
};

export default App;