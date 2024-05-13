import React from 'react';
import HeaderBar from './header-bar';

const ComponentHeader = ({ item, isFieldSet = false, isStep = false, index, editModeOn, setAsChild, _onDestroy, onEdit }) => {
	if (item?.mutable) { return null; }

	return (
		<div>
			{item?.pageBreakBefore && <div className="preview-page-break">Page Break</div>}
			<HeaderBar
				isFieldSet={isFieldSet}
				isStep={isStep}
				editModeOn={editModeOn}
				item={item}
				index={index}
				setAsChild={setAsChild}
				onDestroy={_onDestroy}
				onEdit={onEdit}
				static={item?.static}
				required={item?.required}
			/>
		</div>
	);
};

export default ComponentHeader;