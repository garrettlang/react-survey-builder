/* eslint-disable camelcase */
import React from 'react';
import ComponentHeader from '../survey-elements/component-header';
import ComponentLabel from '../survey-elements/component-label';
import Dustbin from './dustbin';
import ItemTypes from '../ItemTypes';
import { Row } from 'react-bootstrap/esm';

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

class MultiColumnRowBase extends React.Component {
	render() {
		const {	controls, item, editModeOn, getItemById, setAsChild, removeChild, seq, className, index	} = this.props;
		
		const { childItems, pageBreakBefore } = item;
		
		let baseClasses = 'SortableItem rfb-item';
		if (pageBreakBefore) { baseClasses += ' alwaysbreak'; }

		return (
			<div style={{ ...this.props.style }} className={baseClasses}>
				<ComponentHeader {...this.props} />
				<div>
					<ComponentLabel {...this.props} />
					<Row>
						{childItems.map((x, i) => (
							<div key={`${i}_${x || '_'}`} className={className}>{
								controls ? controls[i] :
									<Dustbin
										style={{ width: '100%' }}
										item={item}
										accepts={accepts}
										items={childItems}
										col={i}
										parentIndex={index}
										editModeOn={editModeOn}
										_onDestroy={() => removeChild(item, i)}
										getItemById={getItemById}
										setAsChild={setAsChild}
										seq={seq}
									/>}
							</div>))}
					</Row>
				</div>
			</div>
		);
	}
}

const TwoColumnRow = ({ item, className, ...rest }) => {
	const classNameVal = className || 'col-md-6';
	if (!item.childItems) {
		// eslint-disable-next-line no-param-reassign
		item.childItems = [null, null]; 
		item.isContainer = true;
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
		item.isContainer = true;
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
		item.isContainer = true;
	}
	return <MultiColumnRowBase {...rest} className={classNameVal} item={item} />;
};

export { TwoColumnRow, ThreeColumnRow, MultiColumnRow };