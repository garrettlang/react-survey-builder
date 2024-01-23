import React from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from '../ItemTypes';
import { FaGripVertical } from 'react-icons/fa';

const style = {
	// display: 'inline-block',
	// border: '1px dashed gray',
	// padding: '0.5rem 1rem',
	// backgroundColor: 'white',
	cursor: 'move',
};

const gripSource = {
	beginDrag(props) {
		const { item, index, onDestroy, setAsChild, getDataById } = props;
		return {
			itemType: ItemTypes.BOX,
			index: item.parentId ? -1 : index,
			parentIndex: item.parentIndex,
			id: item.id,
			col: item.col,
			onDestroy,
			setAsChild,
			getDataById,
			item,
		};
	},
};

const Grip = ({ connectDragSource }) => connectDragSource(
	<div className="btn is-isolated" style={style} ><FaGripVertical className="is-isolated" /></div>,
);

export default DragSource(
	ItemTypes.BOX,
	gripSource,
	(connect) => ({
		connectDragSource: connect.dragSource(),
	}),
)(Grip);
