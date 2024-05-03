import React from 'react';
import { DragLayer } from 'react-dnd';
import ItemTypes from '../ItemTypes';
import { BoxDragPreview } from './component-drag-preview';

const layerStyles = {
	position: 'fixed',
	pointerEvents: 'none',
	zIndex: 100,
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
};

const getItemStyles = ({ initialOffset, currentOffset }) => {
	if (!initialOffset || !currentOffset) {
		return {
			display: 'none',
		};
	}
	
	let { x, y } = currentOffset;

	const transform = `translate(${x}px, ${y}px)`;

	return { transform, WebkitTransform: transform };
};

const CustomDragLayer = (props) => {
	const renderItem = () => {
		switch (props.itemType) {
			case ItemTypes.BOX:
				return <BoxDragPreview item={props.item} />;
			default:
				return null;
		}
	};

	if (!props.isDragging) { return null; }

	return (
		<div style={layerStyles}>
			<div style={getItemStyles(props)}>{renderItem()}</div>
		</div>
	);
};

export default DragLayer((monitor) => ({
	item: monitor.getItem(),
	itemType: monitor.getItemType(),
	initialOffset: monitor.getInitialSourceClientOffset(),
	currentOffset: monitor.getSourceClientOffset(),
	isDragging: monitor.isDragging(),
}))(CustomDragLayer);