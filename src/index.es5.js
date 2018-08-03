'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _picker = require('./picker.es5.vue');

var _picker2 = _interopRequireDefault(_picker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VueIosPickers = {
  install: function install(Vue) {
    Vue.component(_picker2.default.name, _picker2.default);
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use(VueIosPickers);
}

exports.default = VueIosPickers;