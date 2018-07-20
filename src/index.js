import Picker from './picker.vue';

const VueIosPickers = {
  install(Vue) {
    Vue.component(Picker.name, Picker);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(VueIosPickers);
}

export default VueIosPickers;
