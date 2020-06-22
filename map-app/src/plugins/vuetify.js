import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  theme: {
      primary:   '#7091c3' ,
      secondary: '#504e56',
      hero: '#3d83ee' /* '#07a3e5'*/,
      accent: '#82B1FF',
      create: '#19be87',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  customProperties: true,
  iconfont: 'mdi',
})
