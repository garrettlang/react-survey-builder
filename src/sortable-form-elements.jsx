import SortableElement from './sortable-element';
import PlaceHolder from './survey-place-holder';
import BaseSurveyElements from './survey-elements';
import { TwoColumnRow, ThreeColumnRow, MultiColumnRow } from './multi-column';
import { FieldSet } from './fieldset';
import { Step } from './step';
import CustomElement from './survey-elements/custom-element';

const { Header, Paragraph, ContentBody, Label, LineBreak, TextInput, EmailInput, PhoneNumber, NumberInput, TextArea, Dropdown, Checkboxes, DatePicker, RadioButtons, Image, Rating, Tags, Signature, HyperLink, Download, Camera, Range, FileUpload, Checkbox } = BaseSurveyElements;

const SortableFormElements = {};

SortableFormElements.Header = SortableElement(Header);
SortableFormElements.Paragraph = SortableElement(Paragraph);
SortableFormElements.ContentBody = SortableElement(ContentBody);
SortableFormElements.Label = SortableElement(Label);
SortableFormElements.LineBreak = SortableElement(LineBreak);
SortableFormElements.TextInput = SortableElement(TextInput);
SortableFormElements.EmailInput = SortableElement(EmailInput);
SortableFormElements.PhoneNumber = SortableElement(PhoneNumber);
SortableFormElements.NumberInput = SortableElement(NumberInput);
SortableFormElements.TextArea = SortableElement(TextArea);
SortableFormElements.Dropdown = SortableElement(Dropdown);
SortableFormElements.Signature = SortableElement(Signature);
SortableFormElements.Checkboxes = SortableElement(Checkboxes);
SortableFormElements.Checkbox = SortableElement(Checkbox);
SortableFormElements.DatePicker = SortableElement(DatePicker);
SortableFormElements.RadioButtons = SortableElement(RadioButtons);
SortableFormElements.Image = SortableElement(Image);
SortableFormElements.Rating = SortableElement(Rating);
SortableFormElements.Tags = SortableElement(Tags);
SortableFormElements.HyperLink = SortableElement(HyperLink);
SortableFormElements.Download = SortableElement(Download);
SortableFormElements.Camera = SortableElement(Camera);
SortableFormElements.FileUpload = SortableElement(FileUpload);
SortableFormElements.Range = SortableElement(Range);
SortableFormElements.PlaceHolder = SortableElement(PlaceHolder);
SortableFormElements.FieldSet = SortableElement(FieldSet);
SortableFormElements.TwoColumnRow = SortableElement(TwoColumnRow);
SortableFormElements.ThreeColumnRow = SortableElement(ThreeColumnRow);
SortableFormElements.MultiColumnRow = SortableElement(MultiColumnRow);
SortableFormElements.Step = SortableElement(Step);
SortableFormElements.CustomElement = SortableElement(CustomElement);

export default SortableFormElements;