(function(){"use strict";var t={9422:function(t,e,i){var n=i(7195),o=function(){var t=this,e=t._self._c;return e("div",{staticClass:"signature"},[e("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.handleOuterDialogVisible}},[t._v(" 設定簽名 ")]),e("el-dialog",{attrs:{title:"簽名設定",visible:t.outerDialogVisible,width:"300px",center:""},on:{"update:visible":function(e){t.outerDialogVisible=e}}},[e("div",{staticStyle:{"text-align":"center"}},[e("el-button",{directives:[{name:"show",rawName:"v-show",value:t.isSignatureImgEmpty,expression:"isSignatureImgEmpty"}],staticStyle:{width:"100%"},on:{click:t.openCanvasDialog}},[t._v(" 簽名 ")]),e("div",t._l(t.signatureImg,(function(i){return e("el-tag",{directives:[{name:"show",rawName:"v-show",value:!t.isSignatureImgEmpty,expression:"!isSignatureImgEmpty"}],key:i.src,staticClass:"signature__tag",staticStyle:{height:"100%"},attrs:{closable:"",size:"medium"},on:{close:function(e){return t.removeTag(i.src)}}},[e("el-image",{staticClass:"signature__tag__image",attrs:{src:i.src}})],1)})),1),e("el-dialog",{staticClass:"signDialog",attrs:{visible:t.dialogVisible,width:t.isMobile?"300px":"580px",center:"",appendToBody:""},on:{"update:visible":function(e){t.dialogVisible=e}},scopedSlots:t._u([{key:"title",fn:function(){return[e("div",{staticClass:"signDialog__label"},[t._v("編輯我的簽名")])]},proxy:!0}])},[[e("MyCanvas",{ref:"signatureCanvas",attrs:{width:t.canvasSetting.width,height:t.canvasSetting.height}})],e("div",{attrs:{slot:"footer"},slot:"footer"},[e("el-button",{on:{click:function(e){t.dialogVisible=!1}}},[t._v("取 消")]),e("el-button",{attrs:{type:"primary"},on:{click:t.signatureConfirm}},[t._v(" 確 定 ")])],1)],2)],1),e("div",{attrs:{slot:"footer"},slot:"footer"},[e("el-button",{attrs:{type:"primary"},on:{click:t.handleOuterDialogVisible}},[t._v("確定")])],1)])],1)},s=[],r=function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"canvas-outer",style:{height:""+(t.isMobile?"204px":"214px")}},[e("canvas",{ref:"canvas",staticClass:"canvas-inner",on:{mousedown:t.onCanvasMouseDown,mouseup:t.onCanvasMouseUp,touchstart:t.onCanvasMouseDown,touchmove:t.touchmove}})]),e("div",{staticClass:"toolBox"},[e("el-tooltip",{attrs:{effect:"dark",content:"重新簽名",placement:"top"}},[e("el-button",{attrs:{type:"danger",icon:"el-icon-refresh",circle:"",size:"mini"},on:{click:t.resetCanvas}})],1),e("div",[t.isMobile?t._e():e("el-tooltip",{attrs:{effect:"dark",content:"線條顏色",placement:"top"}},[e("el-radio-group",{attrs:{size:"mini",fill:`${t.currentPenColor}`},model:{value:t.currentPenColor,callback:function(e){t.currentPenColor=e},expression:"currentPenColor"}},t._l(t.penColors,(function(i){return e("el-radio-button",{key:i.color,style:{color:i.color},attrs:{label:i.color}},[t._v(t._s(i.name))])})),1)],1)],1)],1)])},a=[],l=i(3380),u=i.n(l),c=i(1579),h={props:{width:{default:300,type:[Number,String]},height:{default:200,type:Number}},data(){return{isMobile:!1,canvasContext:null,backgroundColor:"lightgoldenrodyellow",currentPenColor:null,penColors:[{name:"Black",color:"black"},{name:"Lightgreen",color:"#9BFFCD"},{name:"Bpm-purple",color:"#822FEB"},{name:"Red",color:"red"}],pointer:{x:0,y:0},isCanvasMouseDown:!1,coordinateOrigin:{x:null,y:null}}},created(){this.isMobile=u()({featureDetect:!0,tablet:!0})},mounted(){this.initCanvas()},computed:{getCoordinateOrigin(){const t=this.canvasContext.canvas.getBoundingClientRect();return{x:t.x,y:t.y}},currentSize(){return this.isMobile?"1":"3"}},methods:{initCanvas(){this.setCanvas(),this.currentPenColor=this.penColors[0].color,this.setWindowEvent()},setCanvas(){const t=this.$refs.canvas;[t.width,t.height]=[this.width,this.height];const e=t.getContext("2d");e.lineCap="round",e.linJoin="round",this.canvasContext=e},setWindowEvent(){window.addEventListener("mousemove",this.handleTrackingMouse)},handleTrackingMouse(t){let e=this.getAbsolutePosition(t);this.isCanvasMouseDown&&this.pointer&&this.draw((t=>{t.strokeStyle=this.currentPenColor,t.moveTo(this.pointer.x,this.pointer.y),t.lineTo(e.x,e.y),(this.pointer.x>this.width||this.pointer.x<0||this.pointer.y>this.height||this.pointer<0)&&this.onCanvasMouseUp()})),this.pointer=e},removeEventListener(){window.removeEventListener("mousemove",this.handleTrackingMouse)},getAbsolutePosition(t){const e=this.canvasContext.canvas.getBoundingClientRect();this.coordinateOrigin={x:e.x,y:e.y};const[i,n]=[t.clientX-e.x,t.clientY-e.y];return{x:i,y:n}},getTouchPosition(t){if(!(0,c.isEmpty)(t.targetTouches)&&this.isMobile){const e=t.targetTouches[0];return this.getAbsolutePosition(e)}},draw(t){let e=this.canvasContext;e.beginPath(),e.lineWidth=2*this.currentSize,t(e),e.stroke()},onCanvasMouseDown(){if(this.isMobile){let t=this.getTouchPosition(event);this.lastPtr={x:t?.x,y:t?.y},this.canvasContext.moveTo(t?.x,t?.y)}else this.isCanvasMouseDown=!0},onCanvasMouseUp(){this.isCanvasMouseDown=!1},resetCanvas(){let t=this.canvasContext.canvas;this.canvasContext.clearRect(0,0,t.width,t.height)},touchmove(t){const e=this.getTouchPosition(t);this.draw((t=>{e&&(t.strokeStyle=this.currentPenColor,t.moveTo(this.lastPtr.x,this.lastPtr.y),t.lineTo(e.x,e.y),this.lastPtr={x:e.x,y:e.y})}))},getSignature(){const t=this.$refs.canvas.toDataURL("image/png");return this.resetCanvas(),this.removeEventListener(),{src:t}}}},g=h,v=i(1001),d=(0,v.Z)(g,r,a,!1,null,null,null),f=d.exports,p={name:"SignatureDisplay",components:{MyCanvas:f},data(){return{outerDialogVisible:!1,dialogVisible:!1,signatureImg:[],isMoible:!1}},created(){this.isMobile=u()({featureDetect:!0,tablet:!0})},computed:{isSignatureImgEmpty(){return(0,c.isEmpty)(this.signatureImg)},canvasSetting(){return this.isMobile?{width:245,height:200}:{width:525,height:210}}},methods:{handleOuterDialogVisible(){this.outerDialogVisible=!this.outerDialogVisible},openCanvasDialog(){this.dialogVisible=!0,this.$refs.signatureCanvas?.initCanvas()},signatureConfirm(){const t=this.$refs.signatureCanvas.getSignature();this.signatureImg=[...this.signatureImg,t],this.dialogVisible=!1},removeTag(t){this.signatureImg=this.signatureImg.filter((({src:e})=>t!==e))}}},m=p,b=(0,v.Z)(m,o,s,!1,null,"4aa6e082",null),y=b.exports,C=i(408);n["default"].use(C.ZP);var w=new C.ZP.Store({state:{},getters:{},mutations:{},actions:{},modules:{}}),x=i(5114),_=i.n(x);n["default"].config.productionTip=!1,n["default"].use(_()),new n["default"]({store:w,render:t=>t(y)}).$mount("#app")}},e={};function i(n){var o=e[n];if(void 0!==o)return o.exports;var s=e[n]={id:n,loaded:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.loaded=!0,s.exports}i.m=t,function(){i.amdO={}}(),function(){var t=[];i.O=function(e,n,o,s){if(!n){var r=1/0;for(c=0;c<t.length;c++){n=t[c][0],o=t[c][1],s=t[c][2];for(var a=!0,l=0;l<n.length;l++)(!1&s||r>=s)&&Object.keys(i.O).every((function(t){return i.O[t](n[l])}))?n.splice(l--,1):(a=!1,s<r&&(r=s));if(a){t.splice(c--,1);var u=o();void 0!==u&&(e=u)}}return e}s=s||0;for(var c=t.length;c>0&&t[c-1][2]>s;c--)t[c]=t[c-1];t[c]=[n,o,s]}}(),function(){i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,{a:e}),e}}(),function(){i.d=function(t,e){for(var n in e)i.o(e,n)&&!i.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})}}(),function(){i.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){i.nmd=function(t){return t.paths=[],t.children||(t.children=[]),t}}(),function(){var t={143:0};i.O.j=function(e){return 0===t[e]};var e=function(e,n){var o,s,r=n[0],a=n[1],l=n[2],u=0;if(r.some((function(e){return 0!==t[e]}))){for(o in a)i.o(a,o)&&(i.m[o]=a[o]);if(l)var c=l(i)}for(e&&e(n);u<r.length;u++)s=r[u],i.o(t,s)&&t[s]&&t[s][0](),t[s]=0;return i.O(c)},n=self["webpackChunkcanva_vue"]=self["webpackChunkcanva_vue"]||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))}();var n=i.O(void 0,[998],(function(){return i(9422)}));n=i.O(n)})();
//# sourceMappingURL=app.bb22fe72.js.map