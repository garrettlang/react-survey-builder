import React from 'react';
import store from './stores/store';
import SurveyElementsEdit from './survey-dynamic-edit';
import SortableFormElements from './sortable-form-elements';
import CustomDragLayer from './survey-elements/component-drag-layer';
import { isListNotEmpty, isObjectNotEmpty, removeRecord, updateRecord } from './utils/objectUtils';

const { PlaceHolder } = SortableFormElements;

const Preview = ({ items: loadItems = [], showCorrectColumn = false, showDescription = false, files = [], renderEditForm, onLoad, onPost, className, editMode = false, setEditMode, editElement = null, setEditElement, variables = {}, staticVariables = {}, checkboxButtonClassName, headerClassName, labelClassName, paragraphClassName, url, saveUrl, saveAlways = false, registry }) => {
	const [items, setItems] = React.useState(isListNotEmpty(loadItems) ? [...loadItems] : []);
	const [answerData, setAnswerData] = React.useState({});
	const [seq, setSeq] = React.useState(0);

	const editForm = React.useRef();

	const editModeOn = (item, e) => {
		e.preventDefault();
		e.stopPropagation();

		if (editMode) {
			setEditMode(false);
			setEditElement(null);
		} else {
			setEditMode(true);
			setEditElement(item);
		}
	};

	const editModeOff = (e) => {
		if (editForm.current && !editForm.current.contains(e.target)) {
			manualEditModeOff();
		}
	};

	const manualEditModeOff = () => {
		if (editElement && editElement.dirty) {
			editElement.dirty = false;
			updateElement({ ...editElement, dirty: false });
		}

		if (editMode) {
			setEditMode(false);
			setEditElement(null);
		}
	};

	const updateElement = (element) => {
		let updatedElement = isObjectNotEmpty(element) ? { ...element } : {};
		let existingList = isListNotEmpty(items) ? [...items] : [];
		let found = existingList.some(i => updatedElement && updatedElement.id && i.id === updatedElement.id);
		let updatedList = updateRecord('id', updatedElement, existingList);

		if (found) {
			setSeq(seq > 100000 ? 0 : seq + 1);
			store.dispatch('updateOrder', updatedList);
			setEditElement(updatedElement);
		}
	};

	const _onChange = (stateItems) => {
		// console.log('_onChange', stateItems);
		let updatedItems = isListNotEmpty(stateItems) ? [...stateItems] : [];
		const updatedAnswerData = { ...answerData };

		updatedItems.forEach((item) => {
			if (item && item.readOnly && variables[item.variableKey]) {
				updatedAnswerData[item.fieldName] = variables[item.variableKey];
			}
		});

		setItems(updatedItems);
		setAnswerData(updatedAnswerData);
	};

	const _onDestroy = (item) => {
		// console.log('_onDestroy', item);
		let updatedList = [...items];
		if (isListNotEmpty(item.childItems)) {
			item.childItems.forEach((childItem) => {
				updatedList = removeRecord('id', childItem?.id, [...updatedList]);
			});
		}

		updatedList = removeRecord('id', item.id, [...updatedList]);

		store.dispatch('updateOrder', updatedList);
		setItems([...updatedList]);
	};

	const getItemById = (id) => {
		return items.find((x) => x && x.id === id);
	};

	const swapChildren = (item, child, col) => {
		// console.log('swapping children', item, child, col);
		if (child.col !== undefined && item.id !== child.parentId) {
			return false;
		}

		if (!(child.col !== undefined && child.col !== col && item.childItems[col])) {
			// No child was assigned yet in both source and target.
			console.log('No child was assigned yet in both source and target.');
			return false;
		}

		// if ((item.element === 'Fieldset' || item.element === 'Step') && isListNotEmpty(item.childItems) && child.col === item.childItems.length) {
		// 	return false;
		// }

		let oldItems = [...items];

		const oldId = item.childItems[col];
		const oldItem = oldItems.find(i => i.id === oldId);
		//const oldCol = child.col;
		// eslint-disable-next-line no-param-reassign
		let updatedChildItems = [...item.childItems];
		updatedChildItems[child.col] = oldId;
		updatedChildItems[col] = child.id;
		const updatedItem = { ...item, childItems: updatedChildItems };
		const updatedOldItem = { ...oldItem, col: child.col };
		const updatedChild = { ...child, col: col };

		let updatedItems = updateRecord('id', updatedItem, oldItems);
		updatedItems = updateRecord('id', updatedOldItem, [...updatedItems]);
		updatedItems = updateRecord('id', updatedChild, [...updatedItems]);

		store.dispatch('updateOrder', updatedItems);
		setItems(updatedItems);

		return true;
	}

	const setAsChild = (item, child, childIsNew, childIndex, col, isBusy) => {
		// console.log('saveAsChild', item, child, childIsNew, childIndex, col, isBusy);

		if (swapChildren(item, child, col)) {
			return;
		}

		if (isBusy) {
			return;
		}

		if (isListNotEmpty(item.childItems) && child.col !== undefined && col === item.childItems.length) {
			// console.log('Cannot drop in the dropzone');
			return;
		}

		let oldItems = [...items];

		// eslint-disable-next-line no-param-reassign
		let updatedChildItems = isListNotEmpty(item.childItems) ? [...item.childItems] : [];
		updatedChildItems[col] = child.id;

		const updatedItem = { ...item, childItems: updatedChildItems };
		const updatedChild = { ...child, col: col, parentId: item.id, parentIndex: oldItems.indexOf(item) };

		const oldParent = oldItems.find(i => i.id === child.parentId);
		let updatedParent = null;
		if (oldParent) {
			updatedParent = { ...oldParent };
			let updatedParentChildItems = [...oldParent.childItems];
			updatedParentChildItems[child.col] = null;
		}

		const list = oldItems.filter((x) => x && x.parentId === item.id);
		let toRemove = list.filter((x) => item.childItems.indexOf(x.id) === -1);

		let updatedList = [...items];
		if (toRemove.length) {
			console.log('toRemove', toRemove);
			updatedList = updatedList.filter((x) => toRemove.indexOf(x) === -1);
		}
		if (!updatedList.find(i => i.id === child.id)) {
			updatedList.push(updatedChild);
		}
		if (childIsNew && childIndex > -1) {
			// Instance where child was hovered over main drop zone first and then
			// dropped into a container, it will not be created yet due to race condition but will
			// have an index equal to the position in the main drop zone where it was hovering prior 
			// to being dropped in the container. Therefore, we need to delete the item in the main 
			// drop zone so that there aren't duplicates since it was intended to go into the container.

			// add item to toRemove list to be removed
			updatedList = removeRecord('id', oldItems[childIndex]?.id, [...updatedList]);
		}

		updatedList = updateRecord('id', updatedItem, [...updatedList]);
		updatedList = updateRecord('id', updatedChild, [...updatedList]);
		if (updatedParent) {
			updatedList = updateRecord('id', updatedParent, [...updatedList]);
		}

		store.dispatch('updateOrder', updatedList);
		setItems(updatedList);
	};

	const removeChild = (item, col) => {
		console.log('removeChild', item, col);
		const existingList = [...items];

		const oldId = item.childItems[col];
		const oldItem = existingList.find(i => i.id === oldId);
		if (oldItem) {
			const updatedListWithoutChild = existingList.filter(x => x !== oldItem);
			// eslint-disable-next-line no-param-reassign
			let updatedItem = { ...item };
			// for multi-column containers, set back to null
			// for fieldsets and steps, delete it
			if (updatedItem.element === 'Fieldset' || updatedItem.element === 'Step') {
				updatedItem.childItems.splice(col, 1);
			} else {
				updatedItem.childItems[col] = null;
			}

			// delete oldItem.parentId;
			setSeq(seq > 100000 ? 0 : seq + 1);

			let updatedItems = updateRecord('id', updatedItem, [...updatedListWithoutChild]);

			store.dispatch('updateOrder', updatedItems);
			setItems(updatedItems);
		}
	};

	const restoreCard = (item, id) => {
		// console.log('restoreCard', item, id);
		const existingItems = [...items];

		const parent = existingItems.find(i => i.id === item.item.parentId);
		const oldItem = existingItems.find(i => i.id === id);
		if (parent && oldItem) {
			let updatedParent = { ...parent };
			let updatedOldItem = { ...oldItem };

			// for multi-column containers, set back to null
			// for fieldsets and steps, delete it
			if (updatedParent.element === 'Fieldset' || updatedParent.element === 'Step') {
				updatedParent.childItems.splice(oldItem.col, 1);
			} else {
				updatedParent.childItems[oldItem.col] = null;
			}

			// eslint-disable-next-line no-param-reassign
			delete updatedOldItem.parentId;
			// eslint-disable-next-line no-param-reassign
			delete updatedOldItem.setAsChild;
			// eslint-disable-next-line no-param-reassign
			delete updatedOldItem.parentIndex;
			// eslint-disable-next-line no-param-reassign
			delete updatedOldItem.col;
			setSeq(seq > 100000 ? 0 : seq + 1);

			let updatedItems = updateRecord('id', updatedOldItem, [...items]);
			updatedItems = updateRecord('id', updatedParent, [...updatedItems]);

			store.dispatch('updateOrder', updatedItems);
			setItems(updatedItems);
		}
	};

	const insertCard = (item, hoverIndex, id) => {
		// console.log('insertCard', item, hoverIndex, id);
		const $dataItems = [...items];
		if (id) {
			restoreCard(item, id);
		} else {
			// fixed bug where cards were getting wiped out when you dragged another card over a card to insert it. card should be inserted, not replacing existing cards. If an existing card should be removed, the remove button should be used
			$dataItems.splice(hoverIndex, 0, item);

			setItems($dataItems);
			store.dispatch('updateOrder', $dataItems);
			// store.dispatch('insertItem', { ...item });
		}
	};

	const moveCard = (dragIndex, hoverIndex) => {
		// console.log('moveCard', dragIndex, hoverIndex);
		const $dataItems = [...items];

		const dragCard = $dataItems[dragIndex];

		$dataItems.splice(dragIndex, 1);
		$dataItems.splice(hoverIndex, 0, dragCard);

		setItems($dataItems);
		store.dispatch('updateOrder', $dataItems);
	};

	// eslint-disable-next-line no-unused-vars
	const cardPlaceHolder = (dragIndex, hoverIndex) => {
		// Dummy
	};

	const getElement = (item, index) => {
		if (item.custom) {
			if (!item.component || typeof item.component !== 'function') {
				// eslint-disable-next-line no-param-reassign
				item.component = registry.get(item.key);
			}
		}

		const SortableFormElement = SortableFormElements[item.element];

		if (SortableFormElement === null) {
			return null;
		}

		return <SortableFormElement id={item.id} name={item.fieldName ?? item.name} seq={seq} index={index} moveCard={moveCard} insertCard={insertCard} mutable={false} editModeOn={editModeOn} isDraggable={true} key={item.id} sortData={item.id} item={{ ...item, staticVariables: staticVariables, checkboxButtonClassName: checkboxButtonClassName, headerClassName: headerClassName, labelClassName: labelClassName, paragraphClassName: paragraphClassName, mutable: false, readOnly: false, print: false }} getItemById={getItemById} setAsChild={setAsChild} removeChild={removeChild} _onDestroy={_onDestroy} />;
	};

	const showEditForm = () => {
		const editFormProps = {
			showCorrectColumn: showCorrectColumn,
			showDescription: showDescription,
			files: files,
			manualEditModeOff: manualEditModeOff,
			element: editElement,
			setElement: setEditElement,
			updateElement: (element) => updateElement(element)
		};

		return renderEditForm(editFormProps);
	};

	React.useEffect(() => {
		store.setExternalHandler(onLoad, onPost);
	}, [onLoad, onPost]);

	React.useEffect(() => {
		setItems(loadItems);
		store.subscribe(state => { _onChange(state.items); });
		store.dispatch('load', { loadUrl: url, saveUrl: saveUrl, items: loadItems, saveAlways: saveAlways });
		document.addEventListener('mousedown', editModeOff);

		return () => { document.removeEventListener('mousedown', editModeOff); };
	}, []);

	const dataItems = items.filter(x => !!x && !x.parentId);
	const elementItems = dataItems.map((item, index) => getElement(item, index));

	return (
		<div className={editMode ? className + ' is-editing' : className}>
			<div className="edit-form" ref={editForm}>
				{editElement !== undefined && editElement !== null && showEditForm()}
			</div>
			<div className="Sortable">{elementItems}</div>
			<PlaceHolder id="form-place-holder" show={true} index={elementItems.length} moveCard={cardPlaceHolder} insertCard={insertCard} />
			<CustomDragLayer />
		</div>
	);
};

Preview.defaultProps = {
	showCorrectColumn: false,
	files: [],
	editMode: false,
	editElement: null,
	className: 'react-survey-builder-preview',
	renderEditForm: (editFormProps) => <SurveyElementsEdit {...editFormProps} />,
};

export default Preview;