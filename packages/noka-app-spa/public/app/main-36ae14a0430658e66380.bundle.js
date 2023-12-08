(()=>{"use strict";var e={520:(e,r,t)=>{var n=t(533);r.s=n.createRoot,n.hydrateRoot},533:e=>{e.exports=ReactDOM}},r={};function t(n){var o=r[n];if(void 0!==o)return o.exports;var u=r[n]={exports:{}};return e[n](u,u.exports,t),u.exports}t.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return t.d(r,{a:r}),r},t.d=(e,r)=>{for(var n in r)t.o(r,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:r[n]})},t.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),(()=>{const e=React;var r=t.n(e),n=t(533),o=function(e,r){return o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,r){e.__proto__=r}||function(e,r){for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t])},o(e,r)},u=function(){return u=Object.assign||function(e){for(var r,t=1,n=arguments.length;t<n;t++)for(var o in r=arguments[t])Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);return e},u.apply(this,arguments)};function i(e,r,t){if(t||2===arguments.length)for(var n,o=0,u=r.length;o<u;o++)!n&&o in r||(n||(n=Array.prototype.slice.call(r,0,o)),n[o]=r[o]);return e.concat(n||Array.prototype.slice.call(r))}var a="undefined",c="object",f="__Symbol",s=typeof Symbol!==a;function l(e){return s?Symbol(e):"".concat(f,"(").concat(e,")")}var p={Observable:l("Observable"),Proxy:l("Proxy"),Nothing:l("Nothing"),BindRequired:l("BindRequired"),BoundMethod:l("BoundMethod")};function d(e,r){return Object.getOwnPropertyDescriptor(e,r)}function v(e,r){if(e)return d(e,r)||v(Object.getPrototypeOf(e),r)}function b(e){return!function(e){return function(e){return null===e}(e)||function(e){return void 0===e}(e)}(e)&&typeof e===c}function h(e){return Array.isArray?Array.isArray(e):e instanceof Array}function y(e){return"function"==typeof e}function m(e,r){return!(!e||!r)&&(e.startsWith?e.startsWith(r):e.slice&&e.slice(0,r.length)===r)}function g(e){return s?"symbol"==typeof e:m(e,f)}function _(e){return m(e,"__")}function O(e,r,t){x(e)&&Object.defineProperty(e,r,{configurable:!0,enumerable:!1,value:t})}function w(e){return(function(e){return"string"==typeof e}(e)||function(e){return"number"==typeof e}(e))&&!g(e)&&!_(e)}function x(e){return!Object.isExtensible||Object.isExtensible(e)}var E=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)};function j(e){return!(!e||!E(e,p.Proxy))}function P(){var e=Object.create(null);return{get:function(r){return e[r]},set:function(r,t){return e[r]=t},has:function(r){return void 0!==e[r]},del:function(r){return e[r]=void 0}}}var k={report:!1,reportMark:"",change:!0,unref:!0,ref:!0,action:!1};function A(e){return e.id+"."+e.member}var M={};function S(e){k.report&&M.value&&(e.mark=k.reportMark,M.value(e))}var N="OBER",B=function(){if(typeof process===a)return{};var e=process.env&&process.env.OBER_CONFIG;if(!e)return{};if(b(e))return e;try{return JSON.parse(e)||{}}catch(e){throw new Error('"'.concat(N,'_CONFIG" has error'))}}(),C=Object.assign({mode:"property",strict:!1,maxListeners:1024,logPrefix:N},B),R=C.logPrefix;function W(e){throw Error("".concat(R,": ").concat(e))}function I(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];console.error.apply(console,i([R],e,!1))}var L={tasks:[],pending:!1},U=function(e){return e()};function F(){L.pending=!1;var e=L.tasks.slice(0);L.tasks.length=0;var r=D.batch;(void 0===r?U:r)((function(){return e.forEach((function(e){return function(e){e(),e.__pending=!1}(e)}))}))}var T=function(){if(typeof Promise!==a){var e=Promise.resolve();return function(){return e.then(F).catch((function(e){return I(e)}))}}if(typeof MutationObserver!==a){var r=1,t=new MutationObserver(F),n=document.createTextNode(String(r));return t.observe(n,{characterData:!0}),function(){r=(r+1)%2,n.data=String(r)}}return function(){return setTimeout(F,0)}}();function D(e){var r=e;r&&!r.__pending&&(r.__pending=!0,L.tasks.push(r),L.pending||(L.pending=!0,T()))}D.batch=U;var q={},G={change:P(),ref:P(),unref:P()};function z(e,r){var t=G[e];t&&r&&((r.dependencies||[]).forEach((function(e){t.has(e)?t.get(e).add(r):(t.set(e,new Set([r])),function(e){var r=e.split(".");H("ref",{id:r[0],member:r[1]})}(e))})),q.subscribe&&q.subscribe(e,r))}function J(e,r){var t=G[e];t&&r&&((r.dependencies||[]).forEach((function(e){if(t.has(e)){var n=t.get(e);n&&n.has(r)&&(1===n.size?(t.del(e),function(e){if(k.unref){var r=e.split(".");H("unref",{id:r[0],member:r[1]})}}(e)):n.delete(r))}})),q.unsubscribe&&q.unsubscribe(e,r))}function H(e,r){var t=G[e];if(t&&!g(r.member)&&!_(r.member)){var n=A(r),o=Array.from(t.get(n)||[]);o.length>C.maxListeners&&function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];console.warn.apply(console,i([R],e,!1))}("Found ".concat(o.length," listeners of ").concat(n)),o.forEach((function(e){return e(r)})),q.publish&&q.publish(e,r,o)}}function K(e){k.change&&H("change",e)}function Q(){C.strict&&!k.action&&W("Update outside of Action")}var V=0;function X(e){e&&b(e)||W("Invalid observe target");var r=e;if(!E(r,p.Observable)){var t=(null==r?void 0:r.constructor)||{},n=t.displayName||t.name||"Object",o="".concat(n,"_").concat(V++),u=h(r)?r.slice(0):{};O(r,p.Observable,{id:o,shadow:u,target:r})}return r[p.Observable]}function Y(e,r,t){if(e&&w(r)){var n=d(e,r);if(n&&"value"in n){var o=X(e).shadow;r in o||(o[r]=n.value),Object.defineProperty(e,r,{get:function(){var n=t.get?t.get(o,r,e):o[r];return h(n)&&x(n)?function(e,r){var t=X(e),n=t.id,o=t.shadow,u=t.isWrappedArray;return S({id:n,member:"length",value:e}),!h(e)||u||(t.isWrappedArray=!0,["push","pop","shift","unshift","splice","reverse"].forEach((function(t){O(e,t,(function(){for(var u=[],i=0;i<arguments.length;i++)u[i]=arguments[i];if(Q(),function(e){return Object.isSealed&&Object.isSealed(e)}(e))return I("Cannot call ".concat(t," of sealed object:"),e);var a=Array.prototype[t].apply(o,u);e.length=0;for(var c=0;c<o.length;c++)e[c]=o[c],Y(e,c,r);return K({id:n,member:"length",value:e}),a}))}))),e}(n,t):n},set:function(n){t.set&&t.set(o,r,n,e)||(o[r]=n)},configurable:!0,enumerable:!0})}}}function Z(e,r){if(b(e))return O(e,p.Proxy,!0),function(e,r){if(!b(e))return e;var t=X(e);return t.isWrappedObject||(t.isWrappedObject=!0,Object.keys(e).forEach((function(t){Y(e,t,r)}))),e}(e,r);W("Invalid LowProxy target")}var $=typeof Proxy!==a;function ee(e,r){return new Proxy(e,r)}var re,te="property"===(re=C.mode)?Z:"proxy"===re||$?ee:Z;function ne(e){if(j(e)||!b(e))return e;var r=X(e);return r.proxy||(r.proxy=te(e,{getOwnPropertyDescriptor:function(e,r){return r===p.Proxy?{configurable:!0,enumerable:!1,value:!0}:d(e,r)},get:function(e,t,n){var o=function(e,r,t){if(e===t)return e[r];var n=v(e,r);return n&&n.get?n.get.call(t):e[r]}(e,t,n);if(!w(t))return o;if(ee===te&&function(e){return y(e)&&void 0===e.prototype&&e.toString().indexOf("[native code]")<0}(o)&&W("Cannot have arrow function: ".concat(t)),function(e){return e&&e[p.BindRequired]}(o))return function(e,r,t,n){if(t[p.BoundMethod])return t;var o=t.bind(n);return O(o,p.BoundMethod,!0),O(e,r,o),o}(e,t,o,n);if(y(o))return o;var u=function(e){if(!e||!b(e)||!x(e))return!1;var r=e.constructor;return!r||r===Object||r===Array}(o)?ne(o):o;return S({id:r.id,member:t,value:o}),u},set:function(e,t,n,o){return Q(),r.shadow[t]===n&&!function(e,r){return h(e)&&"length"===r}(e,t)||(function(e,r,t,n){if(e!==n){var o=v(e,r);o&&o.set?o.set.call(n,t):e[r]=t}else e[r]=t}(e,t,n,o),r.shadow[t]=n,!w(t)||(K({id:r.id,member:t,value:n}),!0))}})),r.proxy}p.Nothing;var oe={};var ue=function(){try{return new Function("t","c","return class O extends t{constructor(...a){super(...a);return this.constructor!==O?null:c(this)}}")}catch(e){return null}}();var ie,ae,ce=!1,fe=!1,se=null;function le(e,r){"undefined"!=typeof document&&document.addEventListener(e,r,!0)}function pe(e,r,t){return void 0===t&&(t=!0),function(e,r){var t=u({},r),n=t.bind,o=void 0===n||n,a=t.batch,c=t.mark,f=t.ignore,s=t.update,l=!1!==o,p=null,d=function(){for(var r=[],t=0;t<arguments.length;t++)r[t]=arguments[t];oe.value=d,k.unref=!1,J("change",p),k.unref=!0;var n=function(e,r){var t=u({},r),n=t.mark,o=t.context,a=t.args,c=t.ignore,f=void 0===c?[]:c,s=new Set,l=M.value;M.value=function(e){if(!e.mark||e.mark===n){var r=A(e);f&&f.indexOf(r)>-1||s.add(r)}};var p=k.reportMark,d=k.report;k.reportMark=n||"",k.report=!0;var v=e.call.apply(e,i([o],a||[],!1));return k.report=d,k.reportMark=p,M.value=l,{result:v,dependencies:s}}(e,{context:this,args:r,mark:c,ignore:f}),o=n.result,a=n.dependencies;return p.dependencies=a,d.dependencies=a,l&&z("change",p),oe.value=null,o},v=function(e){return s?s(e):d()};return p=function(e){if(!g(e.member)&&!_(e.member))return a?D(v):v(e)},d.subscribe=function(){l||(z("change",p),l=!0)},d.unsubscribe=function(){l&&(J("change",p),l=!1)},d}(e,{bind:t,update:function(e){return t=null==e?void 0:e.value,(fe||ce)&&se===t?r():D(r);var t},batch:!1})}function de(e,r){return e.displayName||e.name||r}le("compositionUpdate",(function(){ce=!0})),le("compositionEnd",(function(){ce=!1})),le("input",(function(e){fe=!0,se=e.target.value,ie&&clearTimeout(ie),ie=setTimeout((function(){fe=!1,ie=null}),0)})),ae=n.unstable_batchedUpdates,D.batch=ae,C.logPrefix="mota".toLocaleUpperCase();var ve=t(520);const be=function(e){if(j(e))return e;if(y(e)){var r=function(e){var r;return y(e)&&!(null===(r=d(e,"prototype"))||void 0===r?void 0:r.writable)}(e)&&ue,t=r?ue(e,ne):function(e){function r(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var o=e.apply(this,t)||this;return o.constructor!==r?o:ne(o)}return function(e,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function t(){this.constructor=e}o(e,r),e.prototype=null===r?Object.create(r):(t.prototype=r.prototype,new t)}(r,e),r}(e);return O(t,"name",e.name),O(t,p.Proxy,!0),t}return b(e)?ne(e):e}({users:[]}),he=async()=>{const e=await fetch("/api/users/");be.users=(await e.json()).items},ye=async()=>{await fetch("/api/users/",{method:"post"}),await he()},me=function(r){if(!r||function(e,r){if(E(e,r))return e[r]}(r,"__observer__"))return r;var t,n,o,u,i=function(e){var r;return e&&!!(null===(r=e.prototype)||void 0===r?void 0:r.render)}(r)?(n=(t=r).prototype,o=n.render,u=n.componentWillUnmount,n.render=function(){var e=this;if(this.constructor!==t)return null==o?void 0:o.call(this);if(!this.__reactiver__){var r=0;this.__reactiver__=pe((function(){return null==o?void 0:o.call(e)}),(function(){return e.setState({__tick__:++r})}))}return this.__reactiver__()},n.componentWillUnmount=function(){this.__reactiver__.unsubscribe(),null==u||u.call(this)},t.displayName=de(t,"Component"),t):function(r){var t=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];var o=(0,e.useState)([])[1],u=(0,e.useMemo)((function(){return pe(r,(function(){return o([])}),!1)}),[]);return(0,e.useLayoutEffect)((function(){return u.subscribe(),u.unsubscribe}),[u]),u.apply(void 0,t)};return Object.setPrototypeOf(t,r),t.displayName=de(r,"FC"),t}(r);return r.__observer__=!0,O(r,"__observer__",!0),i}((function(){return function(r,t){(0,e.useMemo)((()=>r()),[])}(he),r().createElement("div",{style:{color:"white"}},r().createElement("table",{border:0},r().createElement("thead",null,r().createElement("tr",null,r().createElement("th",null,"Id"),r().createElement("th",null,"Name"),r().createElement("th",{style:{width:160}},r().createElement("button",{onClick:ye},"Add")))),r().createElement("tbody",null,be.users.map((e=>r().createElement("tr",{key:e.id},r().createElement("td",null,e.id),r().createElement("td",null,e.name)))))))}));(0,ve.s)(document.getElementById("root")).render(r().createElement(me,null))})()})();