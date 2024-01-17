/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-undef */
// const e = React.createElement;
const e = React.createElement;

const ReactSurveyGenerator = ReactSurveyBuilder.ReactSurveyGenerator;
const ElementStore = ReactSurveyBuilder.ElementStore;
const formContainer = document.querySelector('#form-generator');

function setClass(element, name, remove) {
  if (typeof element === 'string') {
    element = document.querySelector(element);
  }
  if (remove) {
    element.classList.remove(name);
  } else {
    element.classList.add(name);
  }
}

class SurveyGenerator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      previewVisible: false,
    };

    this.showPreview = this.showPreview.bind(this);
    this.closePreview = this.closePreview.bind(this);
    this._onUpdate = this._onChange.bind(this);
  }

  componentDidMount() {
    ElementStore.subscribe(state => this._onUpdate(state.data));
    document.querySelector('#button-preview')
      .addEventListener('click', this.showPreview);
    document.querySelector('#button-close')
      .addEventListener('click', this.closePreview);
  }

  showPreview() {
    this.setState({
      previewVisible: true,
    });
    setClass('#preview-dialog', 'show', false);
    setClass('#preview-dialog', 'd-block', false);
  }

  closePreview() {
    this.setState({
      previewVisible: false,
    });
    setClass('#preview-dialog', 'show', true);
    setClass('#preview-dialog', 'd-block', true);
  }

  _onChange(data) {
    this.setState({
      data,
    });
  }

  render() {
    const previewVisible = this.state.previewVisible;
    if (!previewVisible) {
      return null;
    }
    return e(
      ReactSurveyGenerator, {
        download_path: '',
        back_action: '/',
        back_name: 'Back',
        answer_data: {},
        action_name: 'Save',
        form_action: '/',
        form_method: 'POST',
        variables: this.props.variables,
        data: this.state.data,
      },
    );
  }
}

ReactDOM.render(e(SurveyGenerator), formContainer);
