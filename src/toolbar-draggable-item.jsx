import React from 'react';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';
import ID from './UUID';

const cardSource = {
	beginDrag(props) {
		return {
			id: ID.uuid(),
			index: -1,
			item: props.item,
			onCreate: props.onCreate,
		};
	},
};

class ToolbarItem extends React.Component {
	render() {
		const { connectDragSource, item, onClick } = this.props;
		const IconComponent = item.icon;
		if (!connectDragSource) return null;
		return (
			connectDragSource(
				<li onClick={onClick}><IconComponent />{item.name}</li>,
			)
		);
	}
}

export default DragSource(ItemTypes.CARD, cardSource, connect => ({
	connectDragSource: connect.dragSource(),
}))(ToolbarItem);
