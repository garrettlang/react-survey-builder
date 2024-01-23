/* eslint-disable camelcase */
import React from "react";
import ComponentHeader from "../survey-elements/component-header";
import ComponentLabel from "../survey-elements/component-label";
import FieldsetDustbin from '../multi-column/dustbin';
import ItemTypes from "../ItemTypes";
import { Col, Row } from "react-bootstrap";

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

export default function FieldSetBase(props) {

	const [childData, setChildData] = React.useState({});
	const [childItems, setChildItems] = React.useState(null);

	React.useEffect(() => {
		const { item, className, ...rest } = props;
		setChildData(item);
		let count = 1;
		createChild(count, item);

	}, [props]);


	const addNewChild = () => {
		let $dataItem = props.item;
		let colCount = $dataItem.childItems.length + 1;
		let oldChilds = $dataItem.childItems;
		$dataItem.childItems = Array.from({ length: colCount }, (v, i) => { return oldChilds[i] ? oldChilds[i] : null });

		setChildItems($dataItem.childItems)
	}

	const onDropSuccess = (droppedIndex) => {
		const totalChild = childItems ? childItems.length : 0;
		const isLastChild = totalChild === droppedIndex + 1;

		if (isLastChild) {
			addNewChild()
		}
	}

	const createChild = (count, $dataItem) => {
		const colCount = count;
		if (!$dataItem.childItems) {
			// eslint-disable-next-line no-param-reassign
			$dataItem.childItems = Array.from({ length: colCount }, (v, i) => null);
			$dataItem.isContainer = true;
		}
		setChildItems($dataItem.childItems);
	};
	const { controls, editModeOn, getDataById, setAsChild, removeChild, seq, index } = props;
	const { pageBreakBefore } = childData;
	let baseClasses = "SortableItem rfb-item";
	if (pageBreakBefore) {
		baseClasses += " alwaysbreak";
	}

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} isFieldSet={true} />
			<div>
				<ComponentLabel {...props} />
				<Row>
					{
						childItems?.map((x, i) => (
							<Col key={`${i}_${x || "_"}`} md={12}>
								{controls ? (
									controls[i]
								) : (
									<FieldsetDustbin
										style={{ width: "100%" }}
										item={childData}
										accepts={accepts}
										items={childItems}
										key={i}
										col={i}
										onDropSuccess={() => onDropSuccess(i)}
										parentIndex={index}
										editModeOn={editModeOn}
										_onDestroy={() => removeChild(childData, i)}
										getDataById={getDataById}
										setAsChild={setAsChild}
										seq={seq}
										rowNo={i}
									/>
								)}
							</Col>
						))}
				</Row>
			</div>
		</div>
	);
}
