import React from 'react';
import { Button } from 'react-bootstrap';

const ToolbarGroupItem = ({ name, group, renderItem }) => {
	const [show, setShow] = React.useState(false);

	const onClick = () => {
		setShow(!show);
	};

	const classShow = 'collapse' + (show ? ' show' : '');

	return (
		<li>
			<div className="toolbar-group-item">
				<Button variant="link" className="btn-block text-left" type="button" onClick={onClick}>
					{name}
				</Button>
				<div className={classShow}>
					<ul>
						{group.map(renderItem)}
					</ul>
				</div>
			</div>
		</li>
	);
};

export default ToolbarGroupItem;