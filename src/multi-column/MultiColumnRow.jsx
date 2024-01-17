/* eslint-disable camelcase */
import React from 'react';
import ComponentHeader from '../survey-elements/component-header';
import ComponentLabel from '../survey-elements/component-label';
import Dustbin from './dustbin';
import ItemTypes from '../ItemTypes';
import { Row } from 'react-bootstrap';

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

class MultiColumnRowBase extends React.Component {
	render() {
		const {
			controls, data, editModeOn, getDataById, setAsChild, removeChild, seq, className, index,
		} = this.props;
		const { childItems, pageBreakBefore } = data;
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
										data={data}
										accepts={accepts}
										items={childItems}
										col={i}
										parentIndex={index}
										editModeOn={editModeOn}
										_onDestroy={() => removeChild(data, i)}
										getDataById={getDataById}
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

const TwoColumnRow = ({ data, className, ...rest }) => {
	const classNameVal = className || 'col-md-6';
	if (!data.childItems) {
		// eslint-disable-next-line no-param-reassign
		data.childItems = [null, null]; data.isContainer = true;
	}
	return (
		<MultiColumnRowBase {...rest} className={classNameVal} data={data} />
	);
};

const ThreeColumnRow = ({ data, className, ...rest }) => {
	const classNameVal = className || 'col-md-4';
	if (!data.childItems) {
		// eslint-disable-next-line no-param-reassign
		data.childItems = [null, null, null]; data.isContainer = true;
	}
	return (
		<MultiColumnRowBase {...rest} className={classNameVal} data={data} />
	);
};

const MultiColumnRow = ({ data, ...rest }) => {
	const colCount = data.colCount || 4;
	const classNameVal = data.className || (colCount === 4 ? 'col-md-3' : 'col');
	if (!data.childItems) {
		// eslint-disable-next-line no-param-reassign
		data.childItems = Array.from({ length: colCount }, (v, i) => null);
		data.isContainer = true;
	}
	return <MultiColumnRowBase {...rest} className={classNameVal} data={data} />;
};

export { TwoColumnRow, ThreeColumnRow, MultiColumnRow };