import SortableElement from './sortable-element';
import PlaceHolder from './survey-place-holder';
import BaseSurveyElements from './survey-elements';
import { TwoColumnRow, ThreeColumnRow, MultiColumnRow } from './multi-column';
import { FieldSet } from './fieldset';
import CustomElement from './survey-elements/custom-element';

const {
	Header, Paragraph, ContentBody, Label, LineBreak, TextInput, EmailInput, PhoneNumber, NumberInput, TextArea, Dropdown, Checkboxes,
	DatePicker, RadioButtons, Image, Rating, Tags, Signature, HyperLink, Download, Camera, Range, FileUpload, Checkbox,
} = BaseSurveyElements;

const SurveyElements = {};

SurveyElements.Header = SortableElement(Header);
SurveyElements.Paragraph = SortableElement(Paragraph);
SurveyElements.ContentBody = SortableElement(ContentBody);
SurveyElements.Label = SortableElement(Label);
SurveyElements.LineBreak = SortableElement(LineBreak);
SurveyElements.TextInput = SortableElement(TextInput);
SurveyElements.EmailInput = SortableElement(EmailInput);
SurveyElements.PhoneNumber = SortableElement(PhoneNumber);
SurveyElements.NumberInput = SortableElement(NumberInput);
SurveyElements.TextArea = SortableElement(TextArea);
SurveyElements.Dropdown = SortableElement(Dropdown);
SurveyElements.Signature = SortableElement(Signature);
SurveyElements.Checkboxes = SortableElement(Checkboxes);
SurveyElements.Checkbox = SortableElement(Checkbox);
SurveyElements.DatePicker = SortableElement(DatePicker);
SurveyElements.RadioButtons = SortableElement(RadioButtons);
SurveyElements.Image = SortableElement(Image);
SurveyElements.Rating = SortableElement(Rating);
SurveyElements.Tags = SortableElement(Tags);
SurveyElements.HyperLink = SortableElement(HyperLink);
SurveyElements.Download = SortableElement(Download);
SurveyElements.Camera = SortableElement(Camera);
SurveyElements.FileUpload = SortableElement(FileUpload);
SurveyElements.Range = SortableElement(Range);
SurveyElements.PlaceHolder = SortableElement(PlaceHolder);
SurveyElements.FieldSet = SortableElement(FieldSet);
SurveyElements.TwoColumnRow = SortableElement(TwoColumnRow);
SurveyElements.ThreeColumnRow = SortableElement(ThreeColumnRow);
SurveyElements.MultiColumnRow = SortableElement(MultiColumnRow);
SurveyElements.CustomElement = SortableElement(CustomElement);

export default SurveyElements;