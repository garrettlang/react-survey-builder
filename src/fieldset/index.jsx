/* eslint-disable camelcase */
import React from "react";
import ComponentHeader from "../survey-elements/component-header";
import FieldsetDustbin from '../multi-column/dustbin';
import ItemTypes from "../ItemTypes";
import { Col, Container, Row } from "react-bootstrap/esm";
import myxss from "../survey-elements/myxss";

const accepts = [ItemTypes.BOX, ItemTypes.CARD];

const ComponentLegend = ({ item }) => {
	let labelText = myxss.process(item.label);
	if (!labelText || !labelText.trim()) {
		return null;
	}

	return (
		<legend dangerouslySetInnerHTML={{ __html: labelText }} />
	);
};

const FieldSet = (props) => {
	const [childItem, setChildItem] = React.useState({});
	const [childItems, setChildItems] = React.useState(null);

	React.useEffect(() => {
		const { item, className, ...rest } = props;
		setChildItem(item);
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

	const { controls, editModeOn, getItemById, setAsChild, removeChild, seq, index } = props;

	const { pageBreakBefore } = childItem;

	let baseClasses = "SortableItem rfb-item";
	if (pageBreakBefore) {
		baseClasses += " alwaysbreak";
	}

	return (
		<div style={{ ...props.style }} className={baseClasses}>
			<ComponentHeader {...props} isFieldSet={true} />
			<fieldset>
				<ComponentLegend {...props} />
				<Container fluid>
					<Row>
						{childItems?.map((x, i) => (
								<Col key={`${i}_${x || "_"}`} md={12}>
									{controls ? (
										controls[i]
									) : (
										<FieldsetDustbin
											style={{ width: "100%" }}
											item={childItem}
											accepts={accepts}
											items={childItems}
											key={i}
											col={i}
											onDropSuccess={() => onDropSuccess(i)}
											parentIndex={index}
											editModeOn={editModeOn}
											_onDestroy={() => removeChild(childItem, i)}
											getItemById={getItemById}
											setAsChild={setAsChild}
											seq={seq}
											rowNo={i}
										/>
									)}
								</Col>
							))}
					</Row>
				</Container>
			</fieldset>
		</div>
	);
};

export default FieldSet;