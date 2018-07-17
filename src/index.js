import Picker from './picker.vue';

function install(Vue) {
  Vue.component(Picker.name, Picker);
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
}

export {
  install as default,
  Picker as VueIosPickers
};
