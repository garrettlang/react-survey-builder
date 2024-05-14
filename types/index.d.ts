/* eslint-disable max-classes-per-file */
import * as React from 'react';

type BaseElement = {
  id: string;
  element:
    | "Header Text"
    | "Label"
    | "Paragraph"
    | "Static Content"
    | "Line Break"
    | "Dropdown"
    | "Tags"
    | "Checkboxes"
    | "Multiple Choice"
    | "Text Input"
    | "Number Input"
    | "Multi-line Input"
    | "Two Column Row"
    | "Three Column Row"
    | "Multi Column Row"
    | "Image"
    | "Rating"
    | "Date"
    | "Signature"
    | "Web site"
    | "Fieldset"
    | "File Attachment"
    | "Range"
    | "Camera";
  canHaveLabelLocation?: boolean;
  labelLocation?: string;
  canHaveHelp?: boolean;
  help?: string;
  canHideLabel: boolean;
  hideLabel?: boolean;
  required?: boolean;
  canHaveAlternateForm: boolean;
  alternateForm?: boolean;
  canHaveDisplayHorizontal: boolean;
  inline?: boolean;
  canHavePageBreakBefore: boolean;
  pageBreakBefore?: boolean;
  canPopulateFromApi: boolean;
  text: string;
  conditional?: boolean;
  conditionalFieldName?: string;
  conditionalFieldValue?: string;
};
export type StaticElement = {
  bold: boolean;
  content: string;
  inline?: boolean;
  italic: boolean;
  static: true;
};
export type SurveyBuilderInput = {
  fieldName: string;
  label: string;
};
export type Option = {
  key: string;
  label?: string;
  text: string;
  value: string;
};
export type SelectableElement = {
  options: Option[];
} & SurveyBuilderInput;
export type ImageElement = {
  fieldName: string;
  src: string;
};
export type DateElement = {
  dateFormat: string;
  defaultToday: boolean;
  readOnly: boolean;
} & SurveyBuilderInput;
export type RangeElement = {
  maxLabel: string;
  maxValue: number;
  minLabel: string;
  minValue: number;
  step: number;
} & SurveyBuilderInput;
export type FileElement = {
  href: string;
  filePath: string;
  fieldName: string;
} & StaticElement;
export type WebsiteElement = {
  href: string;
} & StaticElement;
export type SignatureElement = {
  readOnly: boolean;
} & SurveyBuilderInput;
export type TaskData = BaseElement &
  (| StaticElement
    | SurveyBuilderInput
    | SelectableElement
    | ImageElement
    | DateElement
    | RangeElement
    | WebsiteElement
    | FileElement
    | SignatureElement
    // eslint-disable-next-line no-use-before-define
    | SurveyBuilderLayout
  );
export type SurveyBuilderLayout = {
  isContainer: true;
  childItems: TaskData[];
  fieldName: string;
};
export type SurveyBuilderPostData = {
  task_data: TaskData[];
};

export type ToolbarItem = {
  key: string;
  name: string;
  static: boolean;
  icon: React.ReactNode;
  content: string;
};

export interface SurveyBuilderProps {
  surveyName?: string;
  saveSurveyName?: string;
  editSurveyBlock?: React.ReactNode;
  previewSurveyBlock?: React.ReactNode;
  surveyToolbarClassName?: string;
  toolbarItems?: ToolbarItem[];
  files?: any[];
  url?: string;
  showCorrectColumn?: boolean;
  showDescription?: boolean;
  onLoad?: () => Promise<SurveyBuilderPostData>;
  onPost?: (data: SurveyBuilderPostData) => void;
  saveUrl?: string;
  saveAlways?: boolean;
  editMode?: boolean;
  renderEditForm?: (props: BaseElement) => React.ReactNode;
  checkboxButtonClassName?: string;
  headerClassName?: string;
  labelClassName?: string;
  paragraphClassName?: string;
}

export class ReactSurveyBuilder extends React.Component<SurveyBuilderProps> {}

export interface SurveyGeneratorOnSubmitParams {
  id: number;
  name: string;
  customName: string;
  help: string;
  value: string | string[];
  label: string;
}

export interface SurveyGeneratorProps {
  formAction: string;
  formMethod: string;
  actionName?: string;
  onBlur?: (info: SurveyGeneratorOnSubmitParams[]) => void;
  onSubmit?: (info: SurveyGeneratorOnSubmitParams[]) => void;
  onChange?: (info: SurveyGeneratorOnSubmitParams[]) => void;
  items: any[];
  backAction?: string;
  backName?: string;
  task_id?: number;
  answerData?: any[];
  authenticity_token?: string;
  hideActions?: boolean;
  hideLabels?: boolean;
  skipValidations?: boolean;
  displayShort?: boolean;
  readOnly?: boolean;
  // eslint-disable-next-line no-undef
  variables?: Record<any, any>;
  staticVariables?: Record<any, any>;
  submitButton?: JSX.Element;
  backButton?: JSX.Element;
  buttons?: JSX.Element;
  buttonClassName?: string;
  checkboxButtonClassName?: string;
  headerClassName?: string;
  labelClassName?: string;
  paragraphClassName?: string;
  formId?: string;
  methods?: Record<any, any>;
  print?: boolean;
}

export class ReactSurveyGenerator extends React.Component<SurveyGeneratorProps> {}

export type ActionType = "load" | "updateOrder" | "delete";

export class ElementStore {
  static dispatch: (type: ActionType, data: any) => void;
}

export class Registry {
  static register: (name: string, component: React.ReactNode) => void;

  static list: () => string[];

  static get: (name: string) => React.ReactNode;
}
