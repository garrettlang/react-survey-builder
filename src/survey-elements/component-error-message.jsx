import React from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { Alert } from "react-bootstrap";

export const getError = (errors, name) => {
    if (name !== undefined && errors !== undefined) {
        let obj = errors;

        name = name.split('.');
        let len = name.length;
        for (let i = 0; i < len - 1; i++) {
            if (obj[name[i]] !== undefined) {
                //console.log(obj[name[i]]);
                obj = obj[name[i]];
            }
        }

        return obj[name[len - 1]];
    } else {
        return undefined;
    }
};

const ComponentErrorMessage = ({ name }) => {
    const methods = useFormContext();

    if (!methods) return null;
    
    if (getError(methods.formState.errors, name) !== undefined) {
        return (
            <ErrorMessage
                errors={methods.formState.errors}
                name={name}
                render={({ message, messages }) => {
                    if (messages !== undefined && messages !== null) {
                        return Object.entries(messages).map(([type, message]) => (<Alert key={`${name}-${type}`} variant="danger" className="form-error">{message}</Alert>));
                    } else if (message !== undefined && message !== null && message !== '') {
                        return <Alert variant="danger" className="form-error">{message}</Alert>;
                    } else {
                        return null;
                    }
                }}
            />
        );
    } else {
        return null;
    }
};

export default ComponentErrorMessage;