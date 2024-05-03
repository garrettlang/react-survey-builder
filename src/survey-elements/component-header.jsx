import React from 'react';
import HeaderBar from './header-bar';

const ComponentHeader = ({ item, ...props }) => {
	if (item?.mutable) { return null; }

	return (
		<div>
			{item?.pageBreakBefore && <div className="preview-page-break">Page Break</div>}
			<HeaderBar
				isFieldSet={props.isFieldSet}
				parent={props.parent}
				editModeOn={props.editModeOn}
				item={item}
				index={props.index}
				setAsChild={props.setAsChild}
				onDestroy={props._onDestroy}
				onEdit={props.onEdit}
				static={item?.static}
				required={item?.required}
			/>
		</div>
	);
};

export default ComponentHeader;