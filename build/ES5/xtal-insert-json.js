var input="input",with_path="with-path";export var XtalInsertJson=function(_HTMLElement){babelHelpers.inherits(XtalInsertJson,_HTMLElement);function XtalInsertJson(){babelHelpers.classCallCheck(this,XtalInsertJson);return babelHelpers.possibleConstructorReturn(this,(XtalInsertJson.__proto__||Object.getPrototypeOf(XtalInsertJson)).apply(this,arguments))}babelHelpers.createClass(XtalInsertJson,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case input:this.input=JSON.parse(newVal);break;case with_path:this._withPath=newVal;break;}}},{key:"loadJSON",value:function loadJSON(callBack){var _this=this,scriptTag=this.querySelector("script[type=\"application/json\"]");if(!scriptTag){setTimeout(function(){_this.loadJSON(callBack)},100);return}var stringToParse=scriptTag.innerText;try{if(this.refs){this._objectsToMerge=JSON.parse(stringToParse,function(key,val){if("string"!==typeof val)return val;if(!val.startsWith("${refs.")||!val.endsWith("}"))return val;var realKey=val.substring(7,val.length-1);return _this.refs[realKey]})}else{this._objectsToMerge=JSON.parse(stringToParse)}}catch(e){console.error("Unable to parse "+stringToParse)}callBack()}},{key:"postLoadJson",value:function postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(var i=0,ii=this._objectsToMerge.length,objToMerge;i<ii;i++){objToMerge=this._objectsToMerge[i];Object.assign(mergedObj,objToMerge)}}this.mergedProp=mergedObj}},{key:"onInputChange",value:function onInputChange(newVal){var _this2=this;if(!this._connected)return;var mergedObj;if(this._withPath){mergedObj={};var splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach(function(pathToken,idx){if(idx===lenMinus1){mergedObj[pathToken]=newVal}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=newVal}this.loadJSON(function(){_this2.postLoadJson(mergedObj)})}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this3=this;props.forEach(function(prop){if(_this3.hasOwnProperty(prop)){var value=_this3[prop];delete _this3[prop];_this3[prop]=value}})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([input]);this._connected=!0;this.onInputChange(this._input)}},{key:"input",get:function get(){return this._input},set:function set(val){this._input=val;this.onInputChange(val)}},{key:"refs",get:function get(){return this._refs},set:function set(val){this._refs=val}},{key:"mergedProp",get:function get(){return this._mergedProp},set:function set(val){this._mergedProp=val;var mergedObjectChangedEvent=new CustomEvent("merged-prop-changed",{detail:{value:val},bubbles:!0,composed:!1});this.dispatchEvent(mergedObjectChangedEvent)}},{key:"withPath",get:function get(){return this._withPath},set:function set(val){this.setAttribute(with_path,val)}}],[{key:"is",get:function get(){return"xtal-insert-json"}},{key:"observedAttributes",get:function get(){return["with-path",input]}}]);return XtalInsertJson}(HTMLElement);if(!customElements.get(XtalInsertJson.is)){customElements.define(XtalInsertJson.is,XtalInsertJson)}