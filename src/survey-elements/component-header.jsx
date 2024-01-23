import React from 'react';
import HeaderBar from './header-bar';

const ComponentHeader = (props) => {
	if (props.item.mutable) { return null; }
	
	return (
		<div>
			{props.item.pageBreakBefore && <div className="preview-page-break">Page Break</div>}
			<HeaderBar
				isFieldSet={props.isFieldSet}
				parent={props.parent}
				editModeOn={props.editModeOn}
				item={props.item}
				index={props.index}
				setAsChild={props.setAsChild}
				onDestroy={props._onDestroy}
				onEdit={props.onEdit}
				static={props.item.static}
				required={props.item.required}
			/>
		</div>
	);
};

export default ComponentHeader;
