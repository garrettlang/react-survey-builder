/* eslint-disable camelcase */
import React from "react";
import ComponentHeader from "../survey-elements/component-header";
import FieldsetDustbin from '../multi-column/dustbin';
import ItemTypes from "../ItemTypes";
import { Col, Container, Row } from "react-bootstrap";
import myxss from "../survey-elements/myxss";
import { isListNotEmpty, isObjectNotEmpty } from "../utils/objectUtils";

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

const FieldsetBase = ({ item, controls, items, editModeOn, getItemById, setAsChild, removeChild, seq, index, style, ...otherProps }) => {
    const { pageBreakBefore } = item;
    let baseClasses = "SortableItem rfb-item";
    if (pageBreakBefore) {
        baseClasses += " alwaysbreak";
    }

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

    return (
        <div style={{ ...style }} className={baseClasses}>
            <ComponentHeader item={item} index={index} editModeOn={editModeOn} setAsChild={setAsChild} {...otherProps} />
            <fieldset>
                <ComponentLegend item={item} />
                {/* <Container fluid>
                    <Row> */}
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
                {/* </Row>
                </Container> */}
            </fieldset>
        </div>
    );
};

export default FieldsetBase;