import React from 'react';
import DragHandle from './component-drag-handle';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Badge, Button, ButtonToolbar } from 'react-bootstrap';

const HeaderBar = ({ item, editModeOn, onDestroy, setAsChild, index, isStep = false }) => {
	return (
		<ButtonToolbar className="d-flex toolbar-header align-items-center justify-content-between p-2">
			<Badge bg="secondary">{item.text}{isStep ? ' ' + (Number(index) + 1) + ': ' + item.label : ''}{isStep && item?.conditional === true ? ' (Conditional)' : ''}</Badge>
			<div className="toolbar-header-buttons">
				{item.element !== 'LineBreak' &&
					<Button variant="default" className="is-isolated" onClick={(e) => { editModeOn(item, e); }}><FaEdit className="is-isolated" /></Button>
				}
				<Button variant="default" className="is-isolated" onClick={() => { onDestroy(item); }}><FaTrash className="is-isolated" /></Button>
				<DragHandle item={item} index={index} onDestroy={onDestroy} setAsChild={setAsChild} />
			</div>
		</ButtonToolbar>
	);
};

export default HeaderBar;