/**
 * Loading exception error.
 * @param {String} message Error message.
 */
function LoadingException(message) {
    const error = new Error(message);
    return error;
}

/**
 * Key exception error.
 * @param {String} message Error message.
 */
function KeyException(message) {
    const error = new Error(message);
    return error;
}

/**
 * Set error message to pop out.
 * @param {String} msg Error message
 * @param {String} url Url.
 * @param {number} linenumber Line number.
 */
// window.onerror = function (msg, url, linenumber) {
//     alert('Error message: ' + msg + '\nURL: ' + url + '\nError handler source: ' + linenumber);
//     return true;
// }