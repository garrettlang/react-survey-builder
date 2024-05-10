import { isArrayLikeObject, isEmpty } from 'lodash';

export const isListNotEmpty = (list) => {
    return isArrayLikeObject(list) && list !== undefined && list !== null && list.length > 0;
};

export const isObjectNotEmpty = (obj) => {
    if (obj !== undefined && obj !== null && !isEmpty(obj)) {
        return true;
    }

    return false;
};

export const updateObject = (oldObject, updatedValues) => {
    return {
        ...oldObject,
        ...updatedValues
    };
};

export const addObjectToTopOfArray = (oldObjects, newObject) => {
    return [newObject, ...oldObjects];
};

export const addObjectToBottomOfArray = (oldObjects, newObject) => {
    return [...oldObjects, newObject];
};

export const addRecordToTop = (idFieldName, newRecord, oldList) => {
    // check to see if record already exists in the old list, update if so, insert if not
    let existingList = isListNotEmpty(oldList) ? [...oldList] : [];
    const index = existingList.findIndex(obj => obj[idFieldName] === newRecord[idFieldName]);
    let updatedRecords = [];
    // only update if the record exists in the list
    if (index !== -1) {
        updatedRecords = [
            ...existingList.slice(0, index), // everything before current obj
            newRecord,
            ...existingList.slice(index + 1), // everything after current obj
        ];
    } else {
        updatedRecords = addObjectToTopOfArray(existingList, newRecord);
    }

    return updatedRecords;
};

export const addRecordToBottom = (idFieldName, newRecord, oldList) => {
    // check to see if record already exists in the old list, update if so, insert if not
    let existingList = isListNotEmpty(oldList) ? [...oldList] : [];
    const index = existingList.findIndex(obj => obj[idFieldName] === newRecord[idFieldName]);
    let updatedRecords = [];
    // only update if the record exists in the list
    if (index !== -1) {
        updatedRecords = [
            ...existingList.slice(0, index), // everything before current obj
            newRecord,
            ...existingList.slice(index + 1), // everything after current obj
        ];
    } else {
        updatedRecords = addObjectToBottomOfArray(existingList, newRecord);
    }

    return updatedRecords;
};

export const updateRecord = (idFieldName, updatedRecord, oldList) => {
    // check to see if record already exists in the old list, update if so, insert if not
    let existingList = isListNotEmpty(oldList) ? [...oldList] : [];
    const index = existingList.findIndex(obj => obj[idFieldName] === updatedRecord[idFieldName]);
    let updatedRecords = [];
    // only update if the record exists in the list
    if (index !== -1) {
        updatedRecords = [
            ...existingList.slice(0, index), // everything before current obj
            updatedRecord,
            ...existingList.slice(index + 1), // everything after current obj
        ];
    } else {
        updatedRecords = addObjectToBottomOfArray(existingList, updatedRecord);
    }

    return updatedRecords;
};

export const updateRecordField = (idFieldName, idFieldValue, updatedFieldName, updatedFieldValue, oldList) => {
    if (isListNotEmpty(oldList)) {
        let existingList = [...oldList];
        const index = existingList.findIndex(obj => obj[idFieldName] === idFieldValue);
        let updatedRecords = [];
        if (index !== -1) {
            const existingRecord = existingList[index];
            // only update if the record exists in the list
            if (isObjectNotEmpty(existingRecord)) {
                let updatedRecord = { ...existingRecord, [updatedFieldName]: updatedFieldValue };
                updatedRecords = [
                    ...existingList.slice(0, index), // everything before current obj
                    updatedRecord,
                    ...existingList.slice(index + 1), // everything after current obj
                ];

                return updatedRecords;
            }
        }
    }

    return oldList;
};

export const updateRecordFields = (idFieldName, idFieldValue, updatedFields, oldList) => {
    if (isListNotEmpty(oldList)) {
        let existingList = [...oldList];
        const index = existingList.findIndex(obj => obj[idFieldName] === idFieldValue);
        let updatedRecords = [];
        if (index !== -1) {
            const existingRecord = existingList[index];
            // only update if the record exists in the list
            if (isObjectNotEmpty(existingRecord)) {
                let updatedRecord = { ...existingRecord, ...updatedFields };
                updatedRecords = [
                    ...existingList.slice(0, index), // everything before current obj
                    updatedRecord,
                    ...existingList.slice(index + 1), // everything after current obj
                ];

                return updatedRecords;
            }
        }
    }

    return oldList;
};

export const removeRecord = (idFieldName, idToRemove, oldList) => {
    if (isListNotEmpty(oldList)) {
        let existingList = [...oldList];
        const index = existingList.findIndex(obj => obj[idFieldName] === idToRemove);
        // only update if the record exists in the list
        if (index !== -1) {
            // returns the deleted items
            existingList.splice(index, 1);
        }

        return existingList;
    }

    return oldList;
};