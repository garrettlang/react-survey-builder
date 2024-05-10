/* eslint-disable camelcase */
import React from "react";
import ComponentHeader from "../survey-elements/component-header";
import FieldsetDustbin from '../multi-column/dustbin';
import ItemTypes from "../ItemTypes";
import { Col, Container, Row } from "react-bootstrap";
import { isListNotEmpty, isObjectNotEmpty } from "../utils/objectUtils";

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

const StepBase = ({ item, controls, items, answers, editModeOn, getItemById, setAsChild, removeChild, seq, index, style, ...otherProps }) => {
	const { pageBreakBefore } = item;
	let baseClasses = "SortableItem rfb-item";
	if (pageBreakBefore) {
		baseClasses += " alwaysbreak";
	}

	const [hidden, setHidden] = React.useState(item?.conditional ?? false);
	const [childItemIds, setChildItemIds] = React.useState(isObjectNotEmpty(item) && isListNotEmpty(item?.childItems) ? [...item?.childItems] : [null]);

	const onDropSuccess = (droppedIndex) => {
		// let updatedItem = isObjectNotEmpty(item) ? { ...item } : {};
		// let existingChildItemIds = isListNotEmpty(updatedItem.childItems) ? [...updatedItem.childItems] : [null];
		// const isLastChild = existingChildItemIds === (droppedIndex + 1);
		// console.log('onDropSuccess', droppedIndex, existingChildItemIds, childItemIds, item, isLastChild);

		// if (isLastChild) {
		//     let updatedChildItemIds = Array.from({ length: existingChildItemIds.length + 1 }, (v, i) => { return existingChildItemIds[i] ? existingChildItemIds[i] : null });
		//     setChildItemIds(updatedChildItemIds);
		// }
	};

	React.useEffect(() => {
		if (isObjectNotEmpty(item) && isListNotEmpty(item?.childItems)) {
			setChildItemIds([...item?.childItems, null]);
		} else {
			setChildItemIds([null]);
		}
	}, [item]);

	React.useEffect(() => {
		// console.log('all items', items);
		let hideStep = false;
		if (item?.conditional === true) {
			hideStep = true;
			if (item.conditionalFieldName && item.conditionalFieldValue && answers !== undefined && answers !== null && answers.length > 0) {
				const answerField = answers.find(i => i.name === item.conditionalFieldName);
				if (answerField !== undefined && answerField?.value !== undefined) {
					if (Array.isArray(item.conditionalFieldValue)) {
						if (Array.isArray(answerField?.value)) {
							let match = item.conditionalFieldValue.some(i => answerField.value.includes(i));
							if (match) {
								hideStep = false;
							}
						} else if (item.conditionalFieldValue.includes(answerField.value)) {
							hideStep = false;
						}
					} else {
						if (Array.isArray(answerField?.value)) {
							let match = answerField.value.includes(item.conditionalFieldValue);
							if (match) {
								hideStep = false;
							}
						} else if (item.conditionalFieldValue === answerField.value) {
							hideStep = false;
						}
					}
				}
			}
		}

		setHidden(hideStep);
	}, [item, answers]);

	return (
		<div style={{ ...style }} className={baseClasses}>
			<ComponentHeader item={item} index={index} editModeOn={editModeOn} setAsChild={setAsChild} {...otherProps} />
			<fieldset className={hidden ? 'w-100 d-none' : 'w-100'}>
				{/* <Row> */}
				{childItemIds?.map((childItemId, childItemIndex) => (
					<div key={`${childItemIndex}_${childItemId || "_"}`}>
						{controls ? controls[childItemIndex] : (
							<FieldsetDustbin
								style={{ width: "100%" }}
								item={item}
								accepts={accepts}
								items={childItemIds}
								key={childItemIndex}
								col={childItemIndex}
								onDropSuccess={() => { onDropSuccess(childItemIndex); }}
								parentIndex={index}
								editModeOn={editModeOn}
								_onDestroy={() => { removeChild(item, childItemIndex); }}
								getItemById={getItemById}
								setAsChild={setAsChild}
								seq={seq}
								rowNo={childItemIndex}
							/>
						)}
					</div>
				))}
				{/* </Row> */}
			</fieldset>
		</div>
	);
};

export default StepBase;