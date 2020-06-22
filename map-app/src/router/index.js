import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const MapEditorPage = () => import('../views/MapEditorPage');
// const PreviewCreatorPage = () => import('./components/previewcreator/PreviewCreatorPage');
import PreviewCreatorPageContainer from '../views/PreviewCreatorPageContainer';

const HomePage = () => import('../views/HomePage') ;
const CheckoutPage = () => import('../views/CheckoutPage');
const AboutPage = () => import('../views/AboutPage');
const ContactPage = () => import('../views/ContactPage');
const FAQPage = () => import('../views/FAQPage');
const ConfirmationPage = () => import('../views/ConfirmationPage');
const PrivacyPage = () => import('../views/PrivacyPage');
const TermsPage = () => import('../views/TermsPage');
const TestMobilePage = () => import('../views/test/TestMobilePage');
const MockupWidgetTestPage = () => import('../views/test/MockupWidgetTestPage');
const FindMyOrderPage = () => import('../views/FindMyOrderPage');
const NotFoundPage = () => import('../views/404Page');
const ExamplesPage = () => import('../views/ExamplesPage');
const ThemesPage = () => import('../views/ThemesPage');
const mapGenerateClientSideTestPage = () => import('../views/test/mapGenerateClientSideTestPage');

import Loading from "../components/common/LoadingPage.vue";
import Error from "../components/common/LoadingPage.vue";
import LoadingPage from "../components/common/LoadingPage";


function formatTitle(title)
{
  return title + ' - Make.Map.Art'
}

let mapMakerMeta = {
  title: formatTitle('Map Editor'),
  metaTags: [
    {
      name: 'description',
      content: formatTitle('Map Editor')
    },
    {
      property: 'og:description',
      content: formatTitle('Map Editor')
    }
  ]
};

let homeMeta = {
  title: formatTitle('Create beautiful abstract map art of anywhere in the world'),
  metaTags: [
    {
      name: 'description',
      content: 'Create beautiful abstract map art of anywhere in the world'
    },
    {
      property: 'og:description',
      content: 'Create beautiful abstract map art of anywhere in the world'
    }
  ]
};

let index = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'default',
      component:  HomePage,
      meta: homeMeta
    },
    {
      path: '/home',
      name: 'home',
      component: HomePage,
      meta: homeMeta
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutPage,
      meta: {
        title: formatTitle('Checkout'),
        metaTags: [
          {
            name: 'description',
            content:  'Checkout'
          },
          {
            property: 'og:description',
            content: 'Checkout'
          }
        ]
      }
    },

    {
      path: '/editor/basemap/:route_basemapID',
      name: 'createMap',
      component: MapEditorPage,
      props: true,
      meta: mapMakerMeta
    },
    {
      path: '/editortools/basemap/:route_basemapID',
      name: 'createMapWithTools',
      component: MapEditorPage,
      props: function(route) {
        // append some extra props
        return Object.assign({}, route.params, {
          showThemeEditorTools: true
        })
      },
      meta: mapMakerMeta
    },
    {
      path: '/editor/map/:route_mapID',
      name: 'editMap',
      component: MapEditorPage,
      props: true,
      meta: mapMakerMeta
    },
    {
      path: '/editor/add/:route_exampleMapID',
      name: 'exampleMap',
      component: MapEditorPage,
      props: true,
      meta: mapMakerMeta
    },
    {
      path: '/editortools/map/:route_mapID',
      name: 'editMapWithTools',
      component: MapEditorPage,
      props: function(route) {
        // append some extra props
        return Object.assign({}, route.params, {
          showThemeEditorTools: true
        })
      },
      meta: mapMakerMeta
    },
    {
      path: '/editor/basemap',
      name: 'editMapGenerated',
      component: MapEditorPage,
      props: function(route) {
        // append some extra props
        return Object.assign({}, route.params, {
          showThemeEditorTools: true,
          //route_basemapID : 'somethingnotnull',
          //useSampleBasemapRoute: false ,
          //sampleImageNameRoute: "outputtest"
        })
      },
      meta: mapMakerMeta
    },
    {
      path: '/editor/basemaptest',
      name: 'editMapTest',
      component: MapEditorPage,
      props:  {route_basemapID : 'somethingnotnull', useSampleBasemapRoute: true, showThemeEditorTools:true },
      meta: mapMakerMeta
    },
    {
      path: '/editor/basemaptest/:sampleImageNameRoute',
      name: 'editMapTestWithImage',
      component: MapEditorPage,
      props: function(route) {
        // append some extra props
        return Object.assign({}, route.params, {
          showThemeEditorTools: true,
          route_basemapID : 'somethingnotnull',
          useSampleBasemapRoute: true ,
          sampleImageNameRoute: "outputtest"
        })
      },
      meta: mapMakerMeta
    },
    /* todo-  is required? */
    {
      path: '/editor/map/:route_mapID/:route_basemapID',
      name: 'editMapWithBasemap',
      component: MapEditorPage,
      props: true,
      meta: mapMakerMeta
    },
    /*  goto PreviewEditorPage and reset the location */
    {
      path: '/create',
      name: 'createnew',
      component : PreviewCreatorPageContainer,
      props:  {routeProp_createNew : true},
      meta: mapMakerMeta
    },
    /*  goto PreviewEditorPage and dont reset the location */
    {
      path: '/create',
      name: 'create',
      component : PreviewCreatorPageContainer,
      props:  {routeProp_createNew : false},
      meta: mapMakerMeta
    },
    /*  goto PreviewEditorPage to edit an existing map */
    {
      path: '/areaedit/:editRoute_mapID/:editRoute_basemapID',
      name: 'areaEdit',
      component: PreviewCreatorPageContainer,
      props: true,
      meta: mapMakerMeta
    },
    {
      path: '/areaedit',
      name: 'areaEditRetain',
      component: PreviewCreatorPageContainer,
      meta: mapMakerMeta
    },
    {
      path: '/examples',
      name: 'examples',
      component: ExamplesPage,
      meta: {
        title:formatTitle( 'Examples')
      }
    },
    {
      path: '/themes',
      name: 'themes',
      component: ThemesPage,
      meta: {
        title:formatTitle( 'Themes')
      }
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage,
      meta: {
        title: formatTitle( 'About')
      }
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage,
      meta: {
        title: formatTitle('Contact')
      }
    },
    {
      path: '/faq',
      name: 'faq',
      component: FAQPage,
      meta: {
        title:formatTitle( 'FAQ')
      }
    },
    {
      path: '/findmyorder',
      name: 'findmyorder',
      component: FindMyOrderPage,
      meta: {
        title:formatTitle( 'Find My Order')
      }
    },
    {
      path: '/order/:route_orderReferenceID',
      name: 'order',
      component: ConfirmationPage,
      meta: {
        title: formatTitle('My Order')
      },
      props: true
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyPage,
      meta: {
        title: formatTitle('Privacy Policy')
      }
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsPage,
      meta: {
        title: formatTitle('Terms & Conditions')
      }
    },
    {
      path: '/test',
      name: 'test',
      component: mapGenerateClientSideTestPage
    },
    {
      path: '/loadertest',
      name: 'loadertest',
      component: LoadingPage
    },
    {
      path: '/mockup',
      name: 'mockup',
      component: MockupWidgetTestPage
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFoundPage
    },
  ],

  //https://router.vuejs.org/guide/advanced/scroll-behavior.html
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }

});


function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    // A component to use while the component is loading.
    loading: Loading,
    // Delay before showing the loading component.
    // Default: 200 (milliseconds).
    delay: 400,
    // A fallback component in case the timeout is exceeded
    // when loading the component.
    error: Loading,
    // Time before giving up trying to load the component.
    // Default: Infinity (milliseconds).
    timeout: 10000,
  });

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      // Transparently pass any props or children
      // to the view component.
      return h(AsyncHandler, data, children)
    },
  });
}


//https://alligator.io/vuejs/vue-router-modify-head/

// This callback runs before every route change, including on page load.
index.beforeEach((to, from, next) => {

  ///
  console.log("router beforeEach", to);


  ///////////////////////////////////////////////////

  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
});

export default index;

const AsyncComponent = () => ({
  // The component to load (should be a Promise)
  component: Loading,
  // A component to use while the async component is loading
  loading: Loading,
  // A component to use if the load fails
  error: Loading,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
});

