/**
  * <Preview />
  */

import React from 'react';
import update from 'immutability-helper';
import store from './stores/store';
import SurveyElementsEdit from './survey-dynamic-edit';
import SortableFormElements from './sortable-form-elements';
import CustomDragLayer from './survey-elements/component-drag-layer';

const { PlaceHolder } = SortableFormElements;

export default class Preview extends React.Component {
	state = {
		items: [],
		answerData: {},
	};

	constructor(props) {
		super(props);

		const { onLoad, onPost } = props;
		store.setExternalHandler(onLoad, onPost);

		this.editForm = React.createRef();
		this.state = {
			items: props.items || [],
			answerData: {},
		};
		this.seq = 0;

		this._onUpdate = this._onChange.bind(this);
		this.getDataById = this.getDataById.bind(this);
		this.moveCard = this.moveCard.bind(this);
		this.insertCard = this.insertCard.bind(this);
		this.setAsChild = this.setAsChild.bind(this);
		this.removeChild = this.removeChild.bind(this);
		this._onDestroy = this._onDestroy.bind(this);
	}

	componentDidMount() {
		const { items, url, saveUrl, saveAlways } = this.props;
		store.subscribe(state => this._onUpdate(state.items));
		store.dispatch('load', { loadUrl: url, saveUrl, items: items || [], saveAlways });
		document.addEventListener('mousedown', this.editModeOff);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.editModeOff);
	}

	editModeOff = (e) => {
		if (this.editForm.current && !this.editForm.current.contains(e.target)) {
			this.manualEditModeOff();
		}
	}

	manualEditModeOff = () => {
		const { editElement } = this.props;
		if (editElement && editElement.dirty) {
			editElement.dirty = false;
			this.updateElement(editElement);
		}
		this.props.manualEditModeOff();
	}

	_setValue(text) {
		return text.replace(/[^A-Z0-9]+/ig, '_').toLowerCase();
	}

	updateElement(element) {
		const { items } = this.state;
		let found = false;

		for (let i = 0, len = items.length; i < len; i++) {
			if (element.id === items[i].id) {
				items[i] = element;
				found = true;
				break;
			}
		}

		if (found) {
			this.seq = this.seq > 100000 ? 0 : this.seq + 1;
			store.dispatch('updateOrder', items);
		}
	}

	_onChange($dataItems) {
		const answerData = {};

		$dataItems.forEach((item) => {
			if (item && item.readOnly && this.props.variables[item.variableKey]) {
				answerData[item.fieldName] = this.props.variables[item.variableKey];
			}
		});

		this.setState({
			items: $dataItems,
			answerData,
		});
	}

	_onDestroy(item) {
		if (item.childItems) {
			item.childItems.forEach((childItem) => {
				const child = this.getDataById(childItem);
				if (child) {
					store.dispatch('delete', child);
				}
			});
		}
		store.dispatch('delete', item);
	}

	getDataById(id) {
		const { items } = this.state;

		return items.find((x) => x && x.id === id);
	}

	swapChildren($dataItems, item, child, col) {
		if (child.col !== undefined && item.id !== child.parentId) {
			return false;
		}
		if (!(child.col !== undefined && child.col !== col && item.childItems[col])) {
			// No child was assigned yet in both source and target.
			return false;
		}
		const oldId = item.childItems[col];
		const oldItem = this.getDataById(oldId);
		const oldCol = child.col;
		// eslint-disable-next-line no-param-reassign
		item.childItems[oldCol] = oldId; oldItem.col = oldCol;
		// eslint-disable-next-line no-param-reassign
		item.childItems[col] = child.id; child.col = col;
		store.dispatch('updateOrder', $dataItems);

		return true;
	}

	setAsChild(item, child, col, isBusy) {
		const { items } = this.state;

		if (this.swapChildren(items, item, child, col)) {
			return;
		} 
		
		if (isBusy) {
			return;
		}

		const oldParent = this.getDataById(child.parentId);
		const oldCol = child.col;
		// eslint-disable-next-line no-param-reassign
		item.childItems[col] = child.id; child.col = col;
		// eslint-disable-next-line no-param-reassign
		child.parentId = item.id;
		// eslint-disable-next-line no-param-reassign
		child.parentIndex = items.indexOf(item);

		if (oldParent) {
			oldParent.childItems[oldCol] = null;
		}

		const list = items.filter((x) => x && x.parentId === item.id);
		const toRemove = list.filter((x) => item.childItems.indexOf(x.id) === -1);
		let newData = items;
		if (toRemove.length) {
			// console.log('toRemove', toRemove);
			newData = items.filter((x) => toRemove.indexOf(x) === -1);
		}
		if (!this.getDataById(child.id)) {
			newData.push(child);
		}
		store.dispatch('updateOrder', newData);
	}

	removeChild(item, col) {
		const { items } = this.state;
		const oldId = item.childItems[col];
		const oldItem = this.getDataById(oldId);
		if (oldItem) {
			const newData = items.filter(x => x !== oldItem);
			// eslint-disable-next-line no-param-reassign
			item.childItems[col] = null;
			// delete oldItem.parentId;
			this.seq = this.seq > 100000 ? 0 : this.seq + 1;
			store.dispatch('updateOrder', newData);
			this.setState({ items: newData });
		}
	}

	restoreCard(item, id) {
		const { items } = this.state;
		const parent = this.getDataById(item.item.parentId);
		const oldItem = this.getDataById(id);
		if (parent && oldItem) {
			const newIndex = items.indexOf(oldItem);
			const newData = [...items]; // items.filter(x => x !== oldItem);
			// eslint-disable-next-line no-param-reassign
			parent.childItems[oldItem.col] = null;
			delete oldItem.parentId;
			// eslint-disable-next-line no-param-reassign
			delete item.setAsChild;
			// eslint-disable-next-line no-param-reassign
			delete item.parentIndex;
			// eslint-disable-next-line no-param-reassign
			item.index = newIndex;
			this.seq = this.seq > 100000 ? 0 : this.seq + 1;
			store.dispatch('updateOrder', newData);
			this.setState({ items: newData });
		}
	}

	insertCard(item, hoverIndex, id) {
		const { items } = this.state;
		if (id) {
			this.restoreCard(item, id);
		} else {
			items.splice(hoverIndex, 0, item);
			this.saveData(item, hoverIndex, hoverIndex);
			store.dispatch('insertItem', item);
		}
	}

	moveCard(dragIndex, hoverIndex) {
		const { items } = this.state;
		const dragCard = items[dragIndex];
		this.saveData(dragCard, dragIndex, hoverIndex);
	}

	// eslint-disable-next-line no-unused-vars
	cardPlaceHolder(dragIndex, hoverIndex) {
		// Dummy
	}

	saveData(dragCard, dragIndex, hoverIndex) {
		const newData = update(this.state, {
			items: {
				$splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
			},
		});
		this.setState(newData);
		store.dispatch('updateOrder', newData.items);
	}

	getElement(item, index) {
		if (item.custom) {
			if (!item.component || typeof item.component !== 'function') {
				// eslint-disable-next-line no-param-reassign
				item.component = this.props.registry.get(item.key);
			}
		}
		const SortableFormElement = SortableFormElements[item.element];

		if (SortableFormElement === null) {
			return null;
		}
		return <SortableFormElement id={item.id} name={item.fieldName} seq={this.seq} index={index} moveCard={this.moveCard} insertCard={this.insertCard} mutable={false} parent={this.props.parent} editModeOn={this.props.editModeOn} isDraggable={true} key={item.id} sortData={item.id} item={item} getDataById={this.getDataById} setAsChild={this.setAsChild} removeChild={this.removeChild} _onDestroy={this._onDestroy} />;
	}

	showEditForm() {
		const handleUpdateElement = (element) => this.updateElement(element);
		handleUpdateElement.bind(this);

		const formElementEditProps = {
			showCorrectColumn: this.props.showCorrectColumn,
			files: this.props.files,
			manualEditModeOff: this.manualEditModeOff,
			preview: this,
			element: this.props.editElement,
			updateElement: handleUpdateElement,
		};

		return this.props.renderEditForm(formElementEditProps);
	}

	render() {
		let classes = this.props.className;
		if (this.props.editMode) { classes += ' is-editing'; }
		const $dataItems = this.state.items.filter(x => !!x && !x.parentId);
		const items = $dataItems.map((item, index) => this.getElement(item, index));

		return (
			<div className={classes}>
				<div className="edit-form" ref={this.editForm}>
					{this.props.editElement !== null && this.showEditForm()}
				</div>
				<div className="Sortable">{items}</div>
				<PlaceHolder id="form-place-holder" show={items.length === 0} index={items.length} moveCard={this.cardPlaceHolder} insertCard={this.insertCard} />
				<CustomDragLayer />
			</div>
		);
	}
}

Preview.defaultProps = {
	showCorrectColumn: false,
	files: [],
	editMode: false,
	editElement: null,
	className: 'react-survey-builder-preview',
	renderEditForm: props => <SurveyElementsEdit {...props} />,
};
