import Picker from './picker.vue';

var VueIosPickers = {
  install: function(Vue) {
    Vue.component(Picker.name, Picker);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(VueIosPickers);
}

export default VueIosPickers;
