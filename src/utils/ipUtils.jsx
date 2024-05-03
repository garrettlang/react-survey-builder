import fetch from 'isomorphic-fetch';

export const getIPAddress = async () => {
    const response = await fetch("https://api.ipify.org/?format=json");
    if (response.status >= 400) {
        throw new Error("Bad response from server");
    }

    const resData = await response.json();
    if (resData && resData.ip) {
        return resData.ip;
    }

    return null;
};

export const getUserAgent = () => {
    return window.navigator.userAgent;
};

export const getReferrerUrl = () => {
    return document.referrer ? document.referrer : (window.frames.top.document.referrer ? window.frames.top.document.referrer : null);
};