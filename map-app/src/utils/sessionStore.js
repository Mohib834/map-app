import storageFactory from "./storageFactory.js";
let sessionStore = storageFactory(() => sessionStorage);
module.exports = sessionStore;
