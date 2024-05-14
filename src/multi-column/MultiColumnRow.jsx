/* eslint-disable camelcase */
import React from 'react';
import ComponentHeader from '../survey-elements/component-header';
import ComponentLabel from '../survey-elements/component-label';
import Dustbin from './dustbin';
import ItemTypes from '../ItemTypes';
import { Row } from 'react-bootstrap';

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

const MultiColumnRowBase = ({ controls, item, items, editModeOn, getItemById, setAsChild, removeChild, seq, className, index, style, ...otherProps }) => {
	const { childItems, pageBreakBefore } = item;

	let baseClasses = 'SortableItem rfb-item';
	if (pageBreakBefore) { baseClasses += ' alwaysbreak'; }

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} isFieldSet={false} index={index} editModeOn={editModeOn} setAsChild={setAsChild} {...otherProps} />
			<div>
				<ComponentLabel item={item} {...otherProps} />
				<Row>
					{childItems.map((childItemId, childItemIndex) => (
						<div key={`${childItemIndex}_${childItemId || '_'}`} className={className}>
							{controls ? controls[childItemIndex] :
								<Dustbin
									style={{ width: '100%' }}
									item={item}
									accepts={accepts}
									items={childItems}
									col={childItemIndex}
									parentIndex={index}
									editModeOn={editModeOn}
									_onDestroy={() => { removeChild(item, childItemIndex); }}
									getItemById={getItemById}
									setAsChild={setAsChild}
									seq={seq}
									checkboxButtonClassName={item?.checkboxButtonClassName}
									headerClassName={item?.headerClassName}
									labelClassName={item?.labelClassName}
									paragraphClassName={item?.paragraphClassName}
									staticVariables={item?.staticVariables}
								/>}
						</div>
					))}
				</Row>
			</div>
		</div>
	);
};

const TwoColumnRow = ({ item, className, ...rest }) => {
	const classNameVal = className || 'col-md-6';
	if (!item.childItems) {
		// eslint-disable-next-line no-param-reassign
		item.childItems = [null, null];
	}
	return (
		<MultiColumnRowBase {...rest} className={classNameVal} item={item} />
	);
};

const ThreeColumnRow = ({ item, className, ...rest }) => {
	const classNameVal = className || 'col-md-4';
	if (!item.childItems) {
		// eslint-disable-next-line no-param-reassign
		item.childItems = [null, null, null];
	}
	return (
		<MultiColumnRowBase {...rest} className={classNameVal} item={item} />
	);
};

const MultiColumnRow = ({ item, ...rest }) => {
	const colCount = item.colCount || 4;
	const classNameVal = item.className || (colCount === 4 ? 'col-md-3' : 'col');
	if (!item.childItems) {
		// eslint-disable-next-line no-param-reassign
		item.childItems = Array.from({ length: colCount }, (v, i) => null);
	}
	return <MultiColumnRowBase {...rest} className={classNameVal} item={item} />;
};

export { TwoColumnRow, ThreeColumnRow, MultiColumnRow };