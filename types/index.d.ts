/* eslint-disable max-classes-per-file */
import * as React from 'react';

type BaseElement = {
  id: string;
  element:
    | "Header Text"
    | "Label"
    | "Paragraph"
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
  showDescription?: boolean;
  required: boolean;
  canHaveAlternateForm: boolean;
  canHaveDisplayHorizontal: boolean;
  canHaveOptionCorrect: boolean;
  canHaveOptionValue: boolean;
  canHavePageBreakBefore: boolean;
  canPopulateFromApi: boolean;
  text: string;
};
export type StaticElement = {
  bold: boolean;
  content: string;
  inline?: boolean;
  italic: boolean;
  static: true;
};
export type SurveyBuilderInput = {
  canHaveAnswer?: true;
  field_name: string;
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
  field_name: string;
  src: string;
};
export type DateElement = {
  dateFormat: string;
  defaultToday: boolean;
  readOnly: boolean;
  showTimeSelect: boolean;
  showTimeSelectOnly: boolean;
  showTimeInput: boolean;
  timeFormat: string;
} & SurveyBuilderInput;
export type RangeElement = {
  max_label: string;
  max_value: number;
  min_label: string;
  min_value: number;
} & SurveyBuilderInput;
export type FileElement = {
  _href: string;
  file_path: string;
  field_name: string;
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
  field_name: string;
};
export type SurveyBuilderPostData = {
  task_data: TaskData[];
};

export type ToolbarItem = {
  key: string;
  name: string;
  static: boolean;
  icon: string;
  content: string;
};

export interface SurveyBuilderProps {
  toolbarItems?: ToolbarItem[];
  files?: any[];
  url?: string;
  showCorrectColumn?: boolean;
  show_description?: boolean;
  onLoad?: () => Promise<SurveyBuilderPostData>;
  onPost?: (data: SurveyBuilderPostData) => void;
  saveUrl?: string;
  saveAlways?: boolean;
  editMode?: boolean;
  renderEditForm?: (props: BaseElement) => React.ReactNode;
}

export class ReactSurveyBuilder extends React.Component<SurveyBuilderProps> {}

export interface SurveyGeneratorOnSubmitParams {
  id: number;
  name: string;
  custom_name: string;
  value: string | string[];
}

export interface SurveyGeneratorProps {
  form_action: string;
  form_method: string;
  action_name?: string;
  onBlur?: (info: SurveyGeneratorOnSubmitParams[]) => void;
  onSubmit?: (info: SurveyGeneratorOnSubmitParams[]) => void;
  onChange?: (info: SurveyGeneratorOnSubmitParams[]) => void;
  data: any[];
  back_action?: string;
  back_name?: string;
  task_id?: number;
  answer_data?: any[];
  authenticity_token?: string;
  hide_actions?: boolean;
  skip_validations?: boolean;
  display_short?: boolean;
  read_only?: boolean;
  // eslint-disable-next-line no-undef
  variables?: Record<any, any>;
  submitButton?: JSX.Element;
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
