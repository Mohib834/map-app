//custom version of https://dev.to/timber/wait-for-a-script-to-load-in-javascript-579k

export default class StyleSheetLoader {
  constructor (options) {
    const { href, integrity, global, protocol = document.location.protocol } = options;
    this.href = href;
    this.integrity = integrity;
    this.global = global;
    this.protocol = protocol;
    this.isLoaded = false;
    this.promise = null;
  }

  loadScript () {
    if(this.isLoaded){
      return Promise.resolve(this.href);
    }
    if(this.promise)
    {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      // Create script element and set attributes
      const cssElement = document.createElement('link');
      cssElement.rel = "stylesheet";
      cssElement.async = true;
      //script.href = `${this.protocol}//${this.href}`;
      cssElement.href  = this.href;
      console.log("loading css ", this.href);

      // Append the script to the DOM
      //const el = document.getElementsByTagName('script')[0];
      // el.parentNode.insertBefore(script, el);
      //document.head.appendChild(script);
      // insert it at the end of the head in a legacy-friendly manner
      document.head.insertBefore( cssElement, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );

      // Resolve the promise once the script is loaded
      cssElement.addEventListener('load', () => {
        this.isLoaded = true;
        console.log("loaded css", this.href);
        resolve(cssElement);
      });

      // Catch any errors while loading the script
      cssElement.addEventListener('error', () => {
        reject(new Error(`${this.href} failed to load.`))
      });
    });
    return this.promise;
  }
}