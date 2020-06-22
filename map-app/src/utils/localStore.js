// wrapper for the Localstorage.  do not use Localstorage directly as this is lead to a DOM exception error - for example when private browsing
let storageFactory =  require( "./storageFactory.js");

var localStore= storageFactory(() => localStorage);
module.exports = localStore;
