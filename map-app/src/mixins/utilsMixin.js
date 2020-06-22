import ScriptLoader from '../../helper/scriptLoader'
import StyleSheetLoader from '../../helper/stylesheetLoader'

export default {
  methods:{
    // return promise
    loadExternalScript: function(url){

      var loader = findLoader(url);
      if(loader)
      {
        // returns promise if loaded already
        return loader.loadScript();
      }
      loader = new ScriptLoader({
        src: url
      });
      _loaders.push(loader);
      return loader.loadScript();
    },
    loadStyleSheet: function(href, integrity = null){
      var loader = findLoader(href);
      if(loader)
      {
        // returns promise if loaded already
        return loader.loadScript();
      }

      loader = new StyleSheetLoader({
        href: href,
        integrity: integrity
      });
      _loaders.push(loader);
      return loader.loadScript();
    },


    loadITourScripts: async function()
    {

      // load in order
      await this.loadStyleSheet("/static/lib/itour/itour.css");
      await this.loadExternalScript("/static/lib/itour/jquery.itour.js");
   //   return Promise.all([p1,p2,p3]);
    }
  },

  computed:{

  }

}


var _loaders = [];

function findLoader(url)
{
  for(var i =0; i < _loaders.length;++i)
  {
    let loader = _loaders[i];
    if(loader.src == url)
    {
      return loader;
    }
  }
  return null;
}