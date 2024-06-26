[![npm version](https://badge.fury.io/js/react-survey-builder.svg)](//npmjs.com/package/react-survey-builder)
[![downloads](https://img.shields.io/npm/dm/react-survey-builder.svg)](https://img.shields.io/npm/dm/react-survey-builder.svg)
# React Survey Builder (expanded off of React Form Builder 2)
A complete react form builder that interfaces with a json endpoint to load and save generated forms.
- Upgraded to React 18
- Bootstrap 5.x, React-Icons
- Upgraded to be built on top of React Bootstrap
- Added support to work with React Hook Form
- Use react-dnd for Drag & Drop
- Save form data with dummy api server
- Show posted data on readonly form
- Multi column row
- Custom Components

![](screenshot.png)

### Editing Items
![](screenshot2.png)

# Basic Usage

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactSurveyBuilder } from 'react-survey-builder';
import 'react-survey-builder/dist/app.css';

ReactDOM.render(
  <ReactSurveyBuilder />,
  document.body
)
```

# Props

```javascript
var items = [{
  key: 'Header',
  name: 'Header Text',
  icon: FaHeader,
  static: true,
  content: 'Placeholder Text...'
},
{
  key: 'Paragraph',
  name: 'Paragraph',
  static: true,
  icon: FaParagraph,
  content: 'Placeholder Text...'
}];

<ReactSurveyBuilder
  url='path/to/GET/initial.json'
  toolbarItems={items}
  saveUrl='path/to/POST/built/form.json' />
```

# React Form Generator
Now that a form is built and saved, let's generate it from the saved json.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ReactSurveyGenerator } from 'react-survey-builder';
import 'react-survey-builder/dist/app.css';

ReactDOM.render(
  <ReactSurveyGenerator
    formAction="/path/to/form/submit"
    formMethod="POST"
    task_id={12} // Used to submit a hidden variable with the id to the form from the database.
    answers={JSON_ANSWERS} // Answer data, only used if loading a pre-existing form with values.
    authenticity_token={AUTH_TOKEN} // If using Rails and need an auth token to submit form.
    items={JSON_QUESTION_DATA} // Question data
  />,
  document.body
)
```

### Form Params

Name | Type | Required? | Description
--- | --- | --- | ---
formAction | string | Required | URL path to submit the form
formMethod | string | Required | Verb used in the form submission.
actionName | string | Optional | Defines form submit button text.  Defaults to "Submit"
onSubmit | function | optional | Invoke when submit data, if exists will override form post.
onChange | function | optional | Invoke when Change data. only on generator
onSelect | function | optional | Invoke when ButtonList button is selected. only on generator
onBlur | function | optional | Invoke when Blur data. only on generator
items | array | Required | Question data retrieved from the database
backAction | string | Optional | URL path to go back if needed.
backName | string | Optional | Button text for back action.  Defaults to "Cancel".
task_id | integer | Optional | User to submit a hidden variable with id to the form on the backend database.
answers | array | Optional | Answer data, only used if loading a pre-existing form with values.
authenticity_token | string | Optional | If using Rails and need an auth token to submit form.
hideActions | boolean | Optional | If you would like to hide the submit / cancel buttons set to true.
submitButton | ElementNode | Optional | If you would like to inject your own submit button.
backButton | ElementNode | Optional | If you would like to inject your own back/cancel button.
buttonClassName | string | Optional | CSS class(es) for the button container
checkboxButtonClassName | string | Optional | CSS class(es) for the checkbox and radio buttons
headerClassName | string | Optional | CSS class(es) for the header
labelClassName | string | Optional | CSS class(es) for the standalone label
paragraphClassName | string | Optional | CSS class(es) for the paragraph
helpClassName | string | Optional | CSS class(es) for the help content
hideLabels | boolean | Optional | If you would like to hide field labels
skipValidations | boolean | Optional | Suppress form validations on submit, if set to true.
displayShort | boolean | Optional | Display an optional "shorter page/form" which is common for legal documents or situations where the user will just have to sign or fill out a shorter form with only the critical elements.
readOnly | boolean | Optional | Shows a read only version which has fields disabled and removes "required" labels.
print | boolean | Optional | Shows a print friendly version of the form that removes all the form fields.
variables | object | Optional | Key/value object that can be used for Signature variable replacement.
staticVariables | object | Optional | Key/value object that can be used for text replacement in static element text using double curly brackets.
methods | object | Optional (Required if using ReactSurveyFieldGenerator) | React Hook Form methods object generated by the useForm hook.

### Read only Signatures

Read only signatures allow you to use a saved/canned signature to be placed into the form. The signature will be passed in through the `variables` property to `ReactSurveyGenerator` and `ReactSurveyBuilder`.

To use a read only signature, choose the "Read only" option and enter the key value of the variable that will be used to pass in the signature.

![](screenshot3.png)

The signature data should be in base 64 format.

There is a `variables.js` file that contains a sample base 64 signature. This variable is passed into the demo builder and generator for testing. Use the variable key "JOHN" to test the variable replacement.

# Vendor Dependencies
In order to make the form builder look pretty, there are a few dependencies other than React.

- React Bootstrap
- React-Icon
- React Hook Form

# SASS
All relevant styles located in css/application.css.scss.

# Develop
```bash
$ yarn install
$ yarn run build:dist
$ yarn run serve:api
$ yarn start
```
Then navigate to http://localhost:8080/ in your browser and you should be able to see the form builder in action.

# Customizations
- to customize the field edit form copy "src/form-elements-edit.jsx" to your project and pass it to the ReactSurveyBuilder as a prop. Here is an example
```jsx
<ReactSurveyBuilder
    edit
    items={form}
    //toolbarItems={toolbarItems}
    customToolbarItems={toolbarItems}
    onChange={handleUpdate}
    onSubmit={handleSubmit}

    renderEditForm={props => <FormElementsEdit {...props}/>}
/>
```

- to customize the ReactSurveyGenerator submit button use it like this

```jsx
<ReactSurveyGenerator
    items={form}
    toolbarItems={toolbarItems}
    onSubmit={handleSubmit}
    onSelect={handleSelect}
    actionName="Set this to change the default submit button text"
    submitButton={<Button variant="primary" type="submit">Submit</Button>}
    backButton={<Button variant="secondary" onClick={backAction}>Back</Button>}
/>
```

# Custom Components
- Import component registry from react-survey-builder
```jsx
import { ReactSurveyBuilder, ElementStore, Registry } from 'react-survey-builder';
```

- Simple Custom Component 
```jsx
const TestComponent = () => <h2>Hello</h2>;
```

- Custom Component with input element
```jsx
const MyInput = React.forwardRef((props, ref) => {
  const { name, defaultValue, disabled } = props;
  return <input ref={ref} name={name} defaultValue={defaultValue} disabled={disabled} />;
});
```

- Register custom components to be used in form builder
```jsx
Registry.register('MyInput', MyInput);
Registry.register('TestComponent', TestComponent);
```

- Define Custom Components in Toolbar
```jsx
const items = [{
  key: 'TestComponent',
  element: 'CustomElement',
  component: TestComponent,
  type: 'custom',
  fieldName: 'test_component',
  name: 'Something You Want',
  icon: FaCog,
  static: true,
  props: { test: 'test_comp' },
  label: 'Label Test',
}, {
  key: 'MyInput',
  element: 'CustomElement',
  component: MyInput,
  type: 'custom',
  forwardRef: true,
  fieldName: 'my_input_',
  name: 'My Input',
  icon: FaCog,
  props: { test: 'test_input' },
  label: 'Label Input',
}, 
// Additional standard components, you don't need full definition if no modification is required. 
{  
  key: 'Header',
}, {
  key: 'TextInput',
}, {
  key: 'TextArea',
}, {
  key: 'RadioButtons',
}, {
  key: 'Checkboxes',
}, {
  key: 'Image',
}];
```

- Use defined Toolbar in ReactSurveyBuilder
```jsx
  <ReactSurveyBuilder
    ...
    toolbarItems={items}
  />
```

# Tests
```bash
$ npm test
```
Test is not working at this moment.
