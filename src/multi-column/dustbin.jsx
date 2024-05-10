import React from 'react';
import { DropTarget } from 'react-dnd';
import SurveyElements from '../survey-elements';
import ItemTypes from '../ItemTypes';
import CustomElement from '../survey-elements/custom-element';
import Registry from '../stores/registry';
import store from '../stores/store';

function getCustomElement(item, props) {
	if (!item.component || typeof item.component !== 'function') {
		item.component = Registry.get(item.key);
		if (!item.component) {
			console.error(`${item.element} was not registered`);
		}
	}

	return (
		<CustomElement
			{...props}
			mutable={false}
			key={`form_${item.id}`}
			id={item.id}
			name={item.fieldName ?? item.name}
			item={{ ...item, mutable: false, readOnly: false, print: false }}
		/>
	);
}

const getElement = (item, props) => {
	if (!item) return null;
	if (item.custom) {
		return getCustomElement(item, props);
	}
	console.log('getDustbinElement', item);
	const Element = SurveyElements[item.element || item.key];
	return <Element {...props} id={item.id} key={`form_${item.id}`} name={item.fieldName ?? item.name} mutable={false} item={{ ...item, mutable: false, readOnly: false, print: false }} />;
};

const getStyle = (backgroundColor) => {
	return {
		border: '1px dashed rgba(0,0,0,0.2)',
		minHeight: '2rem',
		minWidth: '7rem',
		width: '100%',
		backgroundColor,
		padding: 0,
		float: 'left',
	};
};

const isContainer = (containerItem) => {
	if (containerItem.itemType !== ItemTypes.CARD) {
		const { item } = containerItem;
		if (item) {
			if (item.isContainer) {
				return true;
			}

			if (item.fieldName) {
				return item.fieldName.indexOf('_col_row') > -1;
			}
		}
	}

	return false;
};

const Dustbin = React.forwardRef(({ onDropSuccess, seq, draggedItem, parentIndex, canDrop, isOver, isOverCurrent, connectDropTarget, items, col, getItemById, ...otherProps }, ref) => {
	const item = getItemById(items[col]);

	React.useImperativeHandle(ref, () => ({
		onDrop: (dropped) => {
			console.log("dropped item", dropped);
			const { item } = dropped;
			if (item) {
				if (onDropSuccess) {
					onDropSuccess();
				}

				store.dispatch('deleteLastItem');
			}
		},
	}), []);

	const element = getElement(item, otherProps);
	const sameCard = draggedItem ? draggedItem.index === parentIndex : false;

	// console.log('dragIndex:',draggedItem?.index)
	// console.log('HoverIndex:',parentIndex)
	// console.log('SameCard:',sameCard)

	let backgroundColor = 'rgba(0, 0, 0, .03)';

	if (!sameCard && isOver && canDrop && !draggedItem.item.isContainer) {
		backgroundColor = '#F7F589';
	}

	// console.log('sameCard, canDrop', sameCard, canDrop);
	return connectDropTarget(
		<div style={!sameCard ? getStyle(backgroundColor) : getStyle('rgba(0, 0, 0, .03')}>
			{!element && <div className="w-100 text-center" style={{ margin: 20 }}>Drop your element here </div>}
			{element}
		</div>,
	);
});

export default DropTarget(
	(props) => props.accepts,
	{
		drop(props, monitor, component) {
			console.log('droptargetprops', props)
			if (!component) {
				return;
			}

			// //Do nothing whith busy dustbin
			// if(props.items[props.col]) return;
			// Allow swap column if target and source are in same multi column row
			const isBusy = !!props.items[props.col];
			const item = monitor.getItem();

			console.log('dustbin', props, item, isBusy);

			// Do nothing when moving the box inside the same column
			if (props.col === item.col && props.items[props.col] === item.id) return;

			// Do not allow replace component other than both items in same multi column row
			if (item.col === undefined && props.items[props.col]) {
				//store.dispatch('resetLastItem');
				//console.log('dropping item in dustbin');
				//store.dispatch('deleteLastItem');
				return;
			}

			if (!isContainer(item)) {
				(component).onDrop(item);
				console.log("calling on Drop from 137", item)
				if (item.item && typeof props.setAsChild === 'function') {
					console.log('setAsChild function being called');
					const isNew = !item.item.id;
					const $dataItem = isNew ? item.onCreate(item.item) : item.item;
					props.setAsChild(props.item, $dataItem, isNew, item.index, props.col, isBusy);
				}
			}
		},
	},
	(connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		draggedItem: monitor.getItem() ? monitor.getItem() : null,
		isOver: monitor.isOver(),
		isOverCurrent: monitor.isOver({ shallow: true }),
		canDrop: monitor.canDrop(),
	}),
)(Dustbin);