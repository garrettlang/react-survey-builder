/**
  * <HeaderBar />
  */

import React from 'react';
// import Grip from '../multi-column/grip';
import DragHandle from './component-drag-handle';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Badge, Button, ButtonToolbar } from 'react-bootstrap';

export default class HeaderBar extends React.Component {
	render() {
		return (
			<ButtonToolbar className="d-flex toolbar-header align-items-center justify-content-between p-2">
				<Badge bg="secondary">{this.props.data.text}</Badge>
				<div className="toolbar-header-buttons">
					{this.props.data.element !== 'LineBreak' &&
						<Button variant="default" className="is-isolated" onClick={this.props.editModeOn.bind(this.props.parent, this.props.data)}><FaEdit className="is-isolated" /></Button>
					}
					<Button variant="default" className="is-isolated" onClick={this.props.onDestroy.bind(this, this.props.data)}><FaTrash className="is-isolated" /></Button>
					{/* {!this.props.data.isContainer &&
						<DragHandle data={this.props.data} index={this.props.index} onDestroy={this.props.onDestroy} setAsChild={this.props.setAsChild} />
					} */}

					<DragHandle data={this.props.data} index={this.props.index} onDestroy={this.props.onDestroy} setAsChild={this.props.setAsChild} />
				</div>
			</ButtonToolbar>
		);
	}
}
