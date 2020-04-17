import { useReducer, useCallback } from 'react';

const initState = {
    loading: false,
    error: null,
    dataId: null,
    values: null,
    identifier: null
}

const httpReducer = (curHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {
                loading: true,
                error: null,
                dataId: null,
                values: null,
                identifier: null
            };
        case 'RESPONSE':
            return {
                ...curHttpState,
                loading: false,
                dataId: action.id,
                values: action.values,
                identifier: action.identifier
            };
        case 'ERROR':
            return { loading: false, error: action.errorMessage };
        case 'CLEAR':
            return initState;
        default:
            throw new Error('Should not be reached!');
    }
};

const useHttp = () => {
    const [httpState, dispatch] = useReducer(httpReducer, initState);

    const ClearState = () => {
        dispatch({ type: 'CLEAR' });
    }

    const sendRequest = (url, method, body, values, reqIdentifer) => {
        dispatch({ type: 'SEND' });
        fetch(url, {
            method: method,
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json();
            })
            .then(responseData => {
                dispatch({ type: 'RESPONSE', id: responseData.name, values: values, identifier: reqIdentifer });
            })
            .catch(error => {
                dispatch({ type: 'ERROR', errorMessage: 'Something went wrong!' });
            });
    }

    return {
        isLoading: httpState.loading,
        dataId: httpState.dataId,
        error: httpState.error,
        sendRequest: sendRequest,
        values: httpState.values,
        reqIdentifer: httpState.identifier,
        clear: ClearState
    }
}

export default useHttp;