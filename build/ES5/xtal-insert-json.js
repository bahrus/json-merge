import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";var input="input",with_path="with-path",delay="delay";export var XtalInsertJson=function(_XtallatX){babelHelpers.inherits(XtalInsertJson,_XtallatX);function XtalInsertJson(){babelHelpers.classCallCheck(this,XtalInsertJson);return babelHelpers.possibleConstructorReturn(this,(XtalInsertJson.__proto__||Object.getPrototypeOf(XtalInsertJson)).apply(this,arguments))}babelHelpers.createClass(XtalInsertJson,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case input:this.input=JSON.parse(newVal);break;case with_path:this._withPath=newVal;break;case delay:this._delay=parseFloat(newVal);break;}babelHelpers.get(XtalInsertJson.prototype.__proto__||Object.getPrototypeOf(XtalInsertJson.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropChange()}},{key:"loadJSON",value:function loadJSON(callBack){var _this=this,scriptTag=this.querySelector("script[type=\"application/json\"]");if(!scriptTag){setTimeout(function(){_this.loadJSON(callBack)},100);return}var stringToParse=scriptTag.innerText;if(!this._objectsToMerge){try{if(this.refs){this._objectsToMerge=JSON.parse(stringToParse,function(key,val){if("string"!==typeof val)return val;if(!val.startsWith("${refs.")||!val.endsWith("}"))return val;var realKey=val.substring(7,val.length-1);return _this.refs[realKey]})}else{if(!this._objectsToMerge)this._objectsToMerge=JSON.parse(stringToParse)}}catch(e){console.error("Unable to parse "+stringToParse)}}callBack()}},{key:"postLoadJson",value:function postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(var i=0,ii=this._objectsToMerge.length,objToMerge;i<ii;i++){objToMerge=this._objectsToMerge[i];Object.assign(mergedObj,objToMerge)}}this.mergedProp=mergedObj}},{key:"onPropChange",value:function onPropChange(){var _this2=this;if(!this._connected||this._disabled)return;var mergedObj;if(this._withPath){mergedObj={};var splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach(function(pathToken,idx){if(idx===lenMinus1){mergedObj[pathToken]=_this2._input}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=this._input}this.loadJSON(function(){_this2.postLoadJson(mergedObj)})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([delay,input,"refs","withPath","passDown","postMergeCallbackFn"]);this._connected=!0;this.onPropChange()}},{key:"input",get:function get(){return this._input},set:function set(val){var _this3=this;this._input=val;if(this._delay){setTimeout(function(){_this3.onPropChange()},this._delay)}else{this.onPropChange()}}},{key:"refs",get:function get(){return this._refs},set:function set(val){this._refs=val;delete this._objectsToMerge;this.onPropChange()}},{key:"mergedProp",get:function get(){return this._mergedProp},set:function set(val){this._mergedProp=val;if(this._cssPropMap){this.passDownProp(val);return}if(this._postMergeCallbackFn){this._postMergeCallbackFn(val,this);return}this.de("merged-prop",val)}},{key:"postMergeCallbackFn",get:function get(){return this._postMergeCallbackFn},set:function set(){this._postMergeCallbackFn}},{key:"withPath",get:function get(){return this._withPath},set:function set(val){this.setAttribute(with_path,val)}},{key:"delay",get:function get(){return this._delay},set:function set(newVal){this.setAttribute(delay,newVal.toString())}}],[{key:"is",get:function get(){return"xtal-insert-json"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalInsertJson.__proto__||Object.getPrototypeOf(XtalInsertJson),"observedAttributes",this).concat([delay,with_path,input])}}]);return XtalInsertJson}(XtallatX);if(!customElements.get(XtalInsertJson.is)){customElements.define(XtalInsertJson.is,XtalInsertJson)}