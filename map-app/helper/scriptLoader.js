//custom version of https://dev.to/timber/wait-for-a-script-to-load-in-javascript-579k

export default class ScriptLoader {
  constructor (options) {
    const { src, global, protocol = document.location.protocol } = options;
    this.src = src;
    this.global = global;
    this.protocol = protocol;
    this.isLoaded = false;
    this.promise = null;
  }

  loadScript () {
    if(this.isLoaded){
      return Promise.resolve(this.src);
    }
    if(this.promise)
    {
      return this.promise;
    }

    this.promise = new Promise((resolve, reject) => {
      // Create script element and set attributes
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      //script.src = `${this.protocol}//${this.src}`;
      script.src = this.src;
      console.log("loading ", this.src);

      // Append the script to the DOM
      //const el = document.getElementsByTagName('script')[0];
     // el.parentNode.insertBefore(script, el);
      //document.head.appendChild(script);
      // insert it at the end of the head in a legacy-friendly manner
      document.head.insertBefore( script, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );

      // Resolve the promise once the script is loaded
      script.addEventListener('load', () => {
        this.isLoaded = true;
        console.log("loaded ", this.src);
        resolve(script);
      });

      // Catch any errors while loading the script
      script.addEventListener('error', () => {
        reject(new Error(`${this.src} failed to load.`))
      });
    });
    return this.promise;
  }
}