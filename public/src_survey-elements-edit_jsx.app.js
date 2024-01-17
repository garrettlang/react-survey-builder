"use strict";
(self["webpackChunkreact_survey_builder"] = self["webpackChunkreact_survey_builder"] || []).push([["src_survey-elements-edit_jsx"],{

/***/ "./src/dynamic-option-list.jsx":
/*!*************************************!*\
  !*** ./src/dynamic-option-list.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DynamicOptionList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _UUID__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./UUID */ "./src/UUID.js");
/* harmony import */ var _UUID__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_UUID__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./language-provider/IntlMessages */ "./src/language-provider/IntlMessages.js");
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Button.js");





function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/**
  * <DynamicOptionList />
  */






var DynamicOptionList = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(DynamicOptionList, _React$Component);
  var _super = _createSuper(DynamicOptionList);
  function DynamicOptionList(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, DynamicOptionList);
    _this = _super.call(this, props);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    return _this;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(DynamicOptionList, [{
    key: "_setValue",
    value: function _setValue(text) {
      return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
    }
  }, {
    key: "editOption",
    value: function editOption(optionIndex, e) {
      var thisElement = this.state.element;
      var val = thisElement.options[optionIndex].value !== this._setValue(thisElement.options[optionIndex].text) ? thisElement.options[optionIndex].value : this._setValue(e.target.value);
      thisElement.options[optionIndex].text = e.target.value;
      thisElement.options[optionIndex].value = val;
      this.setState({
        element: thisElement,
        dirty: true
      });
    }
  }, {
    key: "editValue",
    value: function editValue(optionIndex, e) {
      var thisElement = this.state.element;
      var val = e.target.value === '' ? this._setValue(thisElement.options[optionIndex].text) : e.target.value;
      thisElement.options[optionIndex].value = val;
      this.setState({
        element: thisElement,
        dirty: true
      });
    }

    // eslint-disable-next-line no-unused-vars
  }, {
    key: "editOptionCorrect",
    value: function editOptionCorrect(optionIndex, e) {
      var thisElement = this.state.element;
      if (thisElement.options[optionIndex].hasOwnProperty('correct')) {
        delete thisElement.options[optionIndex].correct;
      } else {
        thisElement.options[optionIndex].correct = true;
      }
      this.setState({
        element: thisElement
      });
      this.props.updateElement.call(this.props.preview, thisElement);
    }
  }, {
    key: "updateOption",
    value: function updateOption() {
      var thisElement = this.state.element;
      // to prevent ajax calls with no change
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, thisElement);
        this.setState({
          dirty: false
        });
      }
    }
  }, {
    key: "addOption",
    value: function addOption(index) {
      var thisElement = this.state.element;
      thisElement.options.splice(index + 1, 0, {
        value: '',
        text: '',
        key: _UUID__WEBPACK_IMPORTED_MODULE_6___default().uuid()
      });
      this.props.updateElement.call(this.props.preview, thisElement);
    }
  }, {
    key: "removeOption",
    value: function removeOption(index) {
      var thisElement = this.state.element;
      thisElement.options.splice(index, 1);
      this.props.updateElement.call(this.props.preview, thisElement);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      if (this.state.dirty) {
        this.state.element.dirty = true;
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "dynamic-option-list"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("li", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_8__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
        sm: 6
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("b", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: "options"
      }))), this.props.canHaveOptionValue && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
        sm: 2
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("b", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: "value"
      }))), this.props.canHaveOptionValue && this.props.canHaveOptionCorrect && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
        sm: 4
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("b", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_7__["default"], {
        id: "correct"
      }))))), this.props.element.options.map(function (option, index) {
        var thisKey = "edit_".concat(option.key);
        var val = option.value !== _this2._setValue(option.text) ? option.value : '';
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("li", {
          className: "clearfix",
          key: thisKey
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_8__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
          sm: 6
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_10__["default"].Control, {
          tabIndex: index + 1,
          style: {
            width: '100%'
          },
          type: "text",
          name: "text_".concat(index),
          placeholder: "Option text",
          value: option.text,
          onBlur: _this2.updateOption.bind(_this2),
          onChange: _this2.editOption.bind(_this2, index)
        })), _this2.props.canHaveOptionValue && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
          sm: 2
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_10__["default"].Control, {
          type: "text",
          name: "value_".concat(index),
          value: val,
          onChange: _this2.editValue.bind(_this2, index)
        })), _this2.props.canHaveOptionValue && _this2.props.canHaveOptionCorrect && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
          sm: 1
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_10__["default"].Check, {
          type: "checkbox",
          value: "1",
          onChange: _this2.editOptionCorrect.bind(_this2, index),
          checked: option.hasOwnProperty('correct')
        })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_9__["default"], {
          sm: 3
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
          className: "dynamic-options-actions-buttons"
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_11__["default"], {
          variant: "success",
          onClick: _this2.addOption.bind(_this2, index)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_12__.FaPlusCircle, null)), index > 0 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_11__["default"], {
          variant: "danger",
          onClick: _this2.removeOption.bind(_this2, index)
        }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_12__.FaMinusCircle, null))))));
      })));
    }
  }]);
  return DynamicOptionList;
}((react__WEBPACK_IMPORTED_MODULE_5___default().Component));


/***/ }),

/***/ "./src/survey-elements-edit.jsx":
/*!**************************************!*\
  !*** ./src/survey-elements-edit.jsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SurveyElementsEdit)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_textarea_autosize__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react-textarea-autosize */ "./node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js");
/* harmony import */ var draft_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! draft-js */ "./node_modules/draft-js/lib/Draft.js");
/* harmony import */ var draft_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(draft_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var draftjs_to_html__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! draftjs-to-html */ "./node_modules/draftjs-to-html/lib/draftjs-to-html.js");
/* harmony import */ var draftjs_to_html__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(draftjs_to_html__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var react_draft_wysiwyg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-draft-wysiwyg */ "./node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.js");
/* harmony import */ var react_draft_wysiwyg__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_draft_wysiwyg__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _dynamic_option_list__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./dynamic-option-list */ "./src/dynamic-option-list.jsx");
/* harmony import */ var _stores_requests__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./stores/requests */ "./src/stores/requests.js");
/* harmony import */ var _UUID__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./UUID */ "./src/UUID.js");
/* harmony import */ var _UUID__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_UUID__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./language-provider/IntlMessages */ "./src/language-provider/IntlMessages.js");
/* harmony import */ var react_icons_fa__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! react-icons/fa */ "./node_modules/react-icons/fa/index.mjs");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Form.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Row.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Col.js");
/* harmony import */ var react_bootstrap__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react-bootstrap */ "./node_modules/react-bootstrap/esm/Button.js");





function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_4__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_3__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }











var toolbar = {
  options: ['inline', 'list', 'textAlign', 'fontSize', 'link', 'history'],
  inline: {
    inDropdown: false,
    className: undefined,
    options: ['bold', 'italic', 'underline', 'superscript', 'subscript']
  }
};
var SurveyElementsEdit = /*#__PURE__*/function (_React$Component) {
  (0,_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_2__["default"])(SurveyElementsEdit, _React$Component);
  var _super = _createSuper(SurveyElementsEdit);
  function SurveyElementsEdit(props) {
    var _this;
    (0,_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__["default"])(this, SurveyElementsEdit);
    _this = _super.call(this, props);
    _this.state = {
      element: _this.props.element,
      data: _this.props.data,
      dirty: false
    };
    return _this;
  }
  (0,_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_1__["default"])(SurveyElementsEdit, [{
    key: "toggleRequired",
    value: function toggleRequired() {
      // const this_element = this.state.element;
    }
  }, {
    key: "editElementProp",
    value: function editElementProp(elemProperty, targProperty, e) {
      var _this2 = this;
      // elemProperty could be content or label
      // targProperty could be value or checked
      var thisElement = this.state.element;
      thisElement[elemProperty] = e.target[targProperty];
      this.setState({
        element: thisElement,
        dirty: true
      }, function () {
        if (targProperty === 'checked') {
          _this2.updateElement();
        }
      });
    }
  }, {
    key: "onEditorStateChange",
    value: function onEditorStateChange(index, property, editorContent) {
      // const html = draftToHtml(convertToRaw(editorContent.getCurrentContent())).replace(/<p>/g, '<div>').replace(/<\/p>/g, '</div>');
      var html = draftjs_to_html__WEBPACK_IMPORTED_MODULE_7___default()((0,draft_js__WEBPACK_IMPORTED_MODULE_6__.convertToRaw)(editorContent.getCurrentContent())).replace(/<p>/g, '').replace(/<\/p>/g, '').replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, '');
      var this_element = this.state.element;
      this_element[property] = html;
      this.setState({
        element: this_element,
        dirty: true
      });
    }
  }, {
    key: "updateElement",
    value: function updateElement() {
      var thisElement = this.state.element;
      // to prevent ajax calls with no change
      if (this.state.dirty) {
        this.props.updateElement.call(this.props.preview, thisElement);
        this.setState({
          dirty: false
        });
      }
    }
  }, {
    key: "convertFromHTML",
    value: function convertFromHTML(content) {
      var newContent = (0,draft_js__WEBPACK_IMPORTED_MODULE_6__.convertFromHTML)(content);
      if (!newContent.contentBlocks || !newContent.contentBlocks.length) {
        // to prevent crash when no contents in editor
        return draft_js__WEBPACK_IMPORTED_MODULE_6__.EditorState.createEmpty();
      }
      var contentState = draft_js__WEBPACK_IMPORTED_MODULE_6__.ContentState.createFromBlockArray(newContent);
      return draft_js__WEBPACK_IMPORTED_MODULE_6__.EditorState.createWithContent(contentState);
    }
  }, {
    key: "addOptions",
    value: function addOptions() {
      var _this3 = this;
      var optionsApiUrl = document.getElementById('optionsApiUrl').value;
      if (optionsApiUrl) {
        (0,_stores_requests__WEBPACK_IMPORTED_MODULE_10__.get)(optionsApiUrl).then(function (data) {
          _this3.props.element.options = [];
          var options = _this3.props.element.options;
          data.forEach(function (x) {
            // eslint-disable-next-line no-param-reassign
            x.key = _UUID__WEBPACK_IMPORTED_MODULE_11___default().uuid();
            options.push(x);
          });
          var this_element = _this3.state.element;
          _this3.setState({
            element: this_element,
            dirty: true
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.dirty) {
        this.props.element.dirty = true;
      }
      var this_checked = this.props.element.hasOwnProperty('required') ? this.props.element.required : false;
      var this_default_checked = this.props.element.hasOwnProperty('defaultChecked') ? this.props.element.defaultChecked : false;
      var this_read_only = this.props.element.hasOwnProperty('readOnly') ? this.props.element.readOnly : false;
      var this_default_today = this.props.element.hasOwnProperty('defaultToday') ? this.props.element.defaultToday : false;
      var this_show_time_select = this.props.element.hasOwnProperty('showTimeSelect') ? this.props.element.showTimeSelect : false;
      var this_show_time_select_only = this.props.element.hasOwnProperty('showTimeSelectOnly') ? this.props.element.showTimeSelectOnly : false;
      var this_show_time_input = this.props.element.hasOwnProperty('showTimeInput') ? this.props.element.showTimeInput : false;
      var this_checked_inline = this.props.element.hasOwnProperty('inline') ? this.props.element.inline : false;
      var this_checked_bold = this.props.element.hasOwnProperty('bold') ? this.props.element.bold : false;
      var this_checked_italic = this.props.element.hasOwnProperty('italic') ? this.props.element.italic : false;
      var this_checked_center = this.props.element.hasOwnProperty('center') ? this.props.element.center : false;
      var this_checked_page_break = this.props.element.hasOwnProperty('pageBreakBefore') ? this.props.element.pageBreakBefore : false;
      var this_checked_alternate_form = this.props.element.hasOwnProperty('alternateForm') ? this.props.element.alternateForm : false;
      var _this$props$element = this.props.element,
        canHavePageBreakBefore = _this$props$element.canHavePageBreakBefore,
        canHaveAlternateForm = _this$props$element.canHaveAlternateForm,
        canHaveDisplayHorizontal = _this$props$element.canHaveDisplayHorizontal,
        canHaveOptionCorrect = _this$props$element.canHaveOptionCorrect,
        canHaveOptionValue = _this$props$element.canHaveOptionValue;
      var canHaveImageSize = this.state.element.element === 'Image' || this.state.element.element === 'Camera';
      var this_files = this.props.files.length ? this.props.files : [];
      if (this_files.length < 1 || this_files.length > 0 && this_files[0].id !== '') {
        this_files.unshift({
          id: '',
          file_name: ''
        });
      }
      var editorState;
      var secondaryEditorState;
      if (this.props.element.hasOwnProperty('content')) {
        editorState = this.convertFromHTML(this.props.element.content);
      }
      if (this.props.element.hasOwnProperty('label')) {
        editorState = this.convertFromHTML(this.props.element.label);
      }
      if (this.props.element.hasOwnProperty('boxLabel')) {
        secondaryEditorState = this.convertFromHTML(this.props.element.boxLabel);
      }
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "clearfix"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("h4", {
        className: "float-start"
      }, this.props.element.text), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_icons_fa__WEBPACK_IMPORTED_MODULE_13__.FaTimes, {
        className: "float-end dismiss-edit",
        onClick: this.props.manualEditModeOff
      })), this.props.element.hasOwnProperty('content') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "text-to-display"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_draft_wysiwyg__WEBPACK_IMPORTED_MODULE_8__.Editor, {
        toolbar: toolbar,
        defaultEditorState: editorState,
        onBlur: this.updateElement.bind(this),
        onEditorStateChange: this.onEditorStateChange.bind(this, 0, 'content'),
        stripPastedStyles: true
      })), this.props.element.hasOwnProperty('filePath') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "fileSelect"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "choose-file"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Select, {
        id: "fileSelect",
        defaultValue: this.props.element.filePath,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'filePath', 'value')
      }, this_files.map(function (file) {
        var this_key = "file_".concat(file.id);
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("option", {
          value: file.id,
          key: this_key
        }, file.file_name);
      }))), this.props.element.hasOwnProperty('href') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_textarea_autosize__WEBPACK_IMPORTED_MODULE_15__["default"], {
        type: "text",
        className: "form-control",
        defaultValue: this.props.element.href,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'href', 'value')
      })), this.props.element.hasOwnProperty('label') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "display-label"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_draft_wysiwyg__WEBPACK_IMPORTED_MODULE_8__.Editor, {
        toolbar: toolbar,
        defaultEditorState: editorState,
        onBlur: this.updateElement.bind(this),
        onEditorStateChange: this.onEditorStateChange.bind(this, 0, 'label'),
        stripPastedStyles: true
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("br", null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "is-required",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "required"
        }),
        type: "checkbox",
        checked: this_checked,
        value: true,
        onChange: this.editElementProp.bind(this, 'required', 'checked')
      }), this.props.element.hasOwnProperty('readOnly') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "is-read-only",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "read-only"
        }),
        type: "checkbox",
        checked: this_read_only,
        value: true,
        onChange: this.editElementProp.bind(this, 'readOnly', 'checked')
      }), this.props.element.hasOwnProperty('defaultToday') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "is-default-to-today",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "default-to-today"
        }),
        type: "checkbox",
        checked: this_default_today,
        value: true,
        onChange: this.editElementProp.bind(this, 'defaultToday', 'checked')
      }), ['Checkboxes', 'Checkbox'].indexOf(this.state.element.element) !== -1 && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "default-checked",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "default-checked"
        }),
        type: "checkbox",
        checked: this_default_checked,
        value: true,
        onChange: this.editElementProp.bind(this, 'defaultChecked', 'checked')
      }), (this.state.element.element === 'RadioButtons' || this.state.element.element === 'Checkboxes') && canHaveDisplayHorizontal && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "display-horizontal",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "display-horizontal"
        }),
        type: "checkbox",
        checked: this_checked_inline,
        value: true,
        onChange: this.editElementProp.bind(this, 'inline', 'checked')
      })), this.state.element.element === 'Checkbox' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "checkbox-label-text"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_draft_wysiwyg__WEBPACK_IMPORTED_MODULE_8__.Editor, {
        toolbar: toolbar,
        defaultEditorState: secondaryEditorState,
        onBlur: this.updateElement.bind(this),
        onEditorStateChange: this.onEditorStateChange.bind(this, 0, 'boxLabel'),
        stripPastedStyles: true
      })), this.props.element.hasOwnProperty('src') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "srcInput"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "link-to"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "srcInput",
        type: "text",
        defaultValue: this.props.element.src,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'src', 'value')
      }))), canHaveImageSize && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "do-center",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "center"
        }),
        type: "checkbox",
        checked: this_checked_center,
        value: true,
        onChange: this.editElementProp.bind(this, 'center', 'checked')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_16__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_17__["default"], {
        sm: 3
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "elementWidth"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "width"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "elementWidth",
        type: "text",
        defaultValue: this.props.element.width,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'width', 'value')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_17__["default"], {
        sm: 3
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "elementHeight"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "height"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "elementHeight",
        type: "text",
        defaultValue: this.props.element.height,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'height', 'value')
      })))), this.state.element.element === 'FileUpload' && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        className: "control-label",
        htmlFor: "fileType"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "choose-file-type"
      }), ":"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Select, {
        id: "fileType",
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'fileType', 'value')
      }, [{
        type: 'image, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, video/mp4,video/x-m4v,video/*',
        typeName: 'All File Type'
      }, {
        type: 'image',
        typeName: 'Image'
      }, {
        type: 'application/pdf',
        typeName: 'PDF'
      }, {
        type: 'application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        typeName: 'Word'
      }, {
        type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        typeName: 'Excel'
      }, {
        type: 'application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
        typeName: 'Powerpoint'
      }, {
        type: 'video/mp4,video/x-m4v,video/*',
        typeName: 'Videos'
      }].map(function (file, index) {
        return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("option", {
          value: file.type,
          key: index
        }, file.typeName);
      })))), canHavePageBreakBefore && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "print-options"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "page-break-before-element",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "page-break-before-element"
        }),
        type: "checkbox",
        checked: this_checked_page_break,
        value: true,
        onChange: this.editElementProp.bind(this, 'pageBreakBefore', 'checked')
      })), canHaveAlternateForm && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "alternate-signature-page"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "display-on-alternate",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "display-on-alternate-signature-page"
        }),
        type: "checkbox",
        checked: this_checked_alternate_form,
        value: true,
        onChange: this.editElementProp.bind(this, 'alternateForm', 'checked')
      })), this.props.element.hasOwnProperty('step') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "rangeStep"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "step"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "rangeStep",
        type: "number",
        defaultValue: this.props.element.step,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'step', 'value')
      }))), this.props.element.hasOwnProperty('minValue') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "rangeMin"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "min"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "rangeMin",
        type: "number",
        defaultValue: this.props.element.minValue,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'minValue', 'value')
      }))), this.props.element.hasOwnProperty('minLabel') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "rangeMin"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "min-label"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        type: "text",
        defaultValue: this.props.element.minLabel,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'minLabel', 'value')
      }))), this.props.element.hasOwnProperty('maxValue') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "rangeMax"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "max"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "rangeMax",
        type: "number",
        defaultValue: this.props.element.maxValue,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'maxValue', 'value')
      }))), this.props.element.hasOwnProperty('maxLabel') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "rangeMax"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "max-label"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        type: "text",
        defaultValue: this.props.element.maxLabel,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'maxLabel', 'value')
      }))), this.props.element.hasOwnProperty('defaultValue') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement("div", {
        className: "form-group-range"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "defaultSelected"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "default-selected"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "defaultSelected",
        type: "number",
        defaultValue: this.props.element.defaultValue,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'defaultValue', 'value')
      }))), this.props.element.hasOwnProperty('static') && this.props.element["static"] && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "text-style"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "do-bold",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "bold"
        }),
        type: "checkbox",
        checked: this_checked_bold,
        value: true,
        onChange: this.editElementProp.bind(this, 'bold', 'checked')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Check, {
        id: "do-italic",
        label: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
          id: "italic"
        }),
        type: "checkbox",
        checked: this_checked_italic,
        value: true,
        onChange: this.editElementProp.bind(this, 'italic', 'checked')
      })), this.props.element.showPlaceholder && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "placeholder"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "place-holder-text-label"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        type: "text",
        id: "placeholder",
        defaultValue: this.props.element.placeholder,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'placeholder', 'value')
      })), this.props.element.showCustomName && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "customName"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "custom-name-label"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        type: "text",
        id: "customName",
        defaultValue: this.props.element.customName,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'customName', 'value')
      })), this.props.element.showHelp && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "help"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "help-label"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_textarea_autosize__WEBPACK_IMPORTED_MODULE_15__["default"], {
        type: "text",
        className: "form-control",
        id: "help",
        defaultValue: this.props.element.help,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'help', 'value')
      })), this.props.element.showDescription && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "questionDescription"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "description"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_textarea_autosize__WEBPACK_IMPORTED_MODULE_15__["default"], {
        type: "text",
        className: "form-control",
        id: "questionDescription",
        defaultValue: this.props.element.description,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'description', 'value')
      })), this.props.showCorrectColumn && this.props.element.canHaveAnswer && !this.props.element.hasOwnProperty('options') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "correctAnswer"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "correct-answer"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        id: "correctAnswer",
        type: "text",
        defaultValue: this.props.element.correct,
        onBlur: this.updateElement.bind(this),
        onChange: this.editElementProp.bind(this, 'correct', 'value')
      })), this.props.element.canPopulateFromApi && this.props.element.hasOwnProperty('options') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Group, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Label, {
        htmlFor: "optionsApiUrl"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "populate-options-from-api"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_16__["default"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_17__["default"], {
        sm: 6
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_14__["default"].Control, {
        style: {
          width: '100%'
        },
        type: "text",
        id: "optionsApiUrl",
        placeholder: "http://localhost:8080/api/optionsdata"
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_17__["default"], {
        sm: 6
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(react_bootstrap__WEBPACK_IMPORTED_MODULE_18__["default"], {
        variant: "success",
        onClick: this.addOptions.bind(this)
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_language_provider_IntlMessages__WEBPACK_IMPORTED_MODULE_12__["default"], {
        id: "populate"
      }))))), this.props.element.hasOwnProperty('options') && /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_5___default().createElement(_dynamic_option_list__WEBPACK_IMPORTED_MODULE_9__["default"], {
        showCorrectColumn: this.props.showCorrectColumn,
        canHaveOptionCorrect: canHaveOptionCorrect,
        canHaveOptionValue: canHaveOptionValue,
        data: this.props.preview.state.data,
        updateElement: this.props.updateElement,
        preview: this.props.preview,
        element: this.props.element,
        key: this.props.element.options.length
      }));
    }
  }]);
  return SurveyElementsEdit;
}((react__WEBPACK_IMPORTED_MODULE_5___default().Component));

SurveyElementsEdit.defaultProps = {
  className: 'edit-element-fields'
};

/***/ })

}]);
//# sourceMappingURL=src_survey-elements-edit_jsx.app.js.map