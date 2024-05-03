import React from 'react';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import ItemTypes from '../ItemTypes';
import { FaGripVertical } from 'react-icons/fa';

const style = {
	// display: 'inline-block',
	// border: '1px dashed gray',
	// padding: '0.5rem 1rem',
	// backgroundColor: 'white',
	cursor: 'move',
};

const dragHandleSource = {
	beginDrag(props) {
		const { item, index, onDestroy, setAsChild, getItemById } = props;
		return {
			itemType: ItemTypes.BOX,
			index: item.parentId ? -1 : index,
			parentIndex: item.parentIndex,
			id: item.id,
			col: item.col,
			onDestroy,
			setAsChild,
			getItemById,
			item: item,
		};
	},
};

class DragHandle extends React.PureComponent {
	componentDidMount() {
		const { connectDragPreview } = this.props;
		if (connectDragPreview) {
			// Use empty image as a drag preview so browsers don't draw it
			// and we can draw whatever we want on the custom drag layer instead.
			connectDragPreview(getEmptyImage(), {
				// IE fallback: specify that we'd rather screenshot the node
				// when it already knows it's being dragged so we can hide it with CSS.
				captureDraggingState: true,
			});
		}
	}

	render() {
		const { connectDragSource } = this.props;
		return connectDragSource(<div className="btn is-isolated" style={style} ><FaGripVertical className="is-isolated" /></div>);
	}
}

export default DragSource(
	ItemTypes.BOX,
	dragHandleSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
	}),
)(DragHandle);