export function isValidAddress(address) {
    if (!address) return false;
    const unprefixedAddress = address.replace(/^0x/, '');
    if (/^([A-Fa-f0-9]{40})$/.test(unprefixedAddress))
        return unprefixedAddress;
    else
        return false;
}

export function isValidUrl(url) {
    if (!url) return false;

    if (/^(http|https)\:\/\/[a-z0-9\.-]+\.[a-z]{2,4}(\:[0-9]{1,4})?/gi.test(url)
        || /^(http|https)\:\/\/[a-z0-9\.-]+(\:[0-9]{1,4})?/gi.test(url)
        || /^(http|https)\:\/\/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+(\:[0-9]{1,4})?/gi.test(url)) {
        return true;
    }
    return false;
}

export function getInputErrors(address, url) {

    if (!isValidAddress(address) && !isValidUrl(url)) {
        return {
            addressInput: 'Invalid Address! Please try again.',
            nodeInput: 'Invalid Url! Please try again.'
        }
    }
    if (!isValidAddress(address) && isValidUrl(url)) {
        return 'Invalid Address! Please try again.'
    }

    if (isValidAddress(address) && !isValidUrl(url)) {
        return 'Invalid Url! Please try again.'
    }

    if (!isValidAddress(address)) {
        return 'Invalid Address! Please try again.'
    }

    return false;
}