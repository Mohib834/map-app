module.exports = function(api) {
  api.cache(true);

  let plugins = [];
  if(process.env.NODE_ENV == "production")
  {
    // rmeove console output for prudction build
    //plugins.push("transform-remove-console");
  }

  return {
    presets: [
      '@vue/app'
    ],
    sourceType: 'unambiguous',
    plugins: plugins
  }
};
