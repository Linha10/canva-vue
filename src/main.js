import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 引入全局樣式
import "@/assets/common.scss";

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
