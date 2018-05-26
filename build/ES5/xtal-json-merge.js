import{XtalInsertJson}from"./xtal-insert-json.js";(function(){var delay="delay",pass_thru_on_init="pass-thru-on-init",pass_to="pass-to",XtalJSONMerge=function(_XtalInsertJson){babelHelpers.inherits(XtalJSONMerge,_XtalInsertJson);function XtalJSONMerge(){babelHelpers.classCallCheck(this,XtalJSONMerge);return babelHelpers.possibleConstructorReturn(this,(XtalJSONMerge.__proto__||Object.getPrototypeOf(XtalJSONMerge)).apply(this,arguments))}babelHelpers.createClass(XtalJSONMerge,[{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this=this;props.forEach(function(prop){if(_this.hasOwnProperty(prop)){var value=_this[prop];delete _this[prop];_this[prop]=value}})}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([delay,"withPath","passThruOnInit","refs",pass_to,"postMergeCallbackFn"]);babelHelpers.get(XtalJSONMerge.prototype.__proto__||Object.getPrototypeOf(XtalJSONMerge.prototype),"connectedCallback",this).call(this)}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){babelHelpers.get(XtalJSONMerge.prototype.__proto__||Object.getPrototypeOf(XtalJSONMerge.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);switch(name){case pass_thru_on_init:this._passThruOnInit=null!==newVal;break;case delay:this._delay=parseFloat(newVal);break;case pass_to:this._passTo=newVal;if(newVal){this.parsePassTo()}else{this.cssKeyMappers=null}break;}}},{key:"onInputChange",value:function onInputChange(newVal){var _this2=this;if(!this._connected)return;var mergedObj;if(this._withPath){mergedObj={};var splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach(function(pathToken,idx){if(idx===lenMinus1){mergedObj[pathToken]=newVal}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=newVal}this.loadJSON(function(){_this2.postLoadJson(mergedObj)})}},{key:"postLoadJson",value:function postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(var i=0,ii=this._objectsToMerge.length,objToMerge;i<ii;i++){objToMerge=this._objectsToMerge[i];switch(babelHelpers.typeof(objToMerge)){case"object":this.mergeDeep(mergedObj,objToMerge);break;default:throw"TODO:  error message";}}}this.mergedProp=mergedObj}},{key:"getParent",value:function getParent(){return this.parentElement}},{key:"mergeDeep",value:function mergeDeep(target,source){if("object"!==babelHelpers.typeof(target))return;if("object"!==babelHelpers.typeof(source))return;for(var key in source){var sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}if(Array.isArray(sourceVal)&&Array.isArray(targetVal)){if(0<targetVal.length&&"undefined"===typeof targetVal[0].id)continue;for(var i=0,ii=sourceVal.length;i<ii;i++){sourceVal[i]}continue}switch(babelHelpers.typeof(sourceVal)){case"object":switch(babelHelpers.typeof(targetVal)){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}},{key:"parsePassTo",value:function parsePassTo(){var _this3=this;this.cssKeyMappers=[];var endsWithBrace=this._passTo.endsWith("}"),adjustedPassTo=this._passTo+(endsWithBrace?";":""),splitPassTo=adjustedPassTo.split("};");splitPassTo.forEach(function(passTo){if(!passTo)return;var splitPassTo2=passTo.split("{"),tokens=splitPassTo2[1].split(";"),propMapper={};tokens.forEach(function(token){var nameValuePair=token.split(":");propMapper[nameValuePair[0]]=nameValuePair[1].split(".")});_this3.cssKeyMappers.push({cssSelector:splitPassTo2[0],propMapper:propMapper})})}},{key:"mergedProp",get:function get(){return this._mergedProp},set:function set(val){var _this4=this;this._mergedProp=val;var mergedObjectChangedEvent=new CustomEvent("merged-prop-changed",{detail:{value:val},bubbles:!0,composed:!1});if(this._postMergeCallbackFn){this._postMergeCallbackFn(mergedObjectChangedEvent,this);return}if(this.cssKeyMappers){this.cssKeyMappers.forEach(function(cssKeyMapper){for(var targetEls=_this4.getParent().querySelectorAll(cssKeyMapper.cssSelector),i=0,ii=targetEls.length;i<ii;i++){var targetEl=targetEls[i],_loop=function(key){var pathSelector=cssKeyMapper.propMapper[key],context=mergedObjectChangedEvent;pathSelector.forEach(function(path){if(context)context=context[path]});targetEl[key]=context};for(var key in cssKeyMapper.propMapper){_loop(key)}}});return}this.dispatchEvent(mergedObjectChangedEvent)}},{key:"postMergeCallbackFn",get:function get(){return this._postMergeCallbackFn},set:function set(){this._postMergeCallbackFn}},{key:"delay",get:function get(){return this._delay},set:function set(newVal){this.setAttribute(delay,newVal.toString())}},{key:"passThruOnInit",get:function get(){return this._passThruOnInit},set:function set(val){if(val){this.setAttribute(pass_thru_on_init,"")}else{this.removeAttribute(pass_thru_on_init)}}},{key:"passTo",get:function get(){return this._passTo},set:function set(val){this.setAttribute(pass_to,val)}}],[{key:"is",get:function get(){return"xtal-json-merge"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalJSONMerge.__proto__||Object.getPrototypeOf(XtalJSONMerge),"observedAttributes",this).concat(["delay","pass-thru-on-init",pass_to])}}]);return XtalJSONMerge}(XtalInsertJson);customElements.define(XtalJSONMerge.is,XtalJSONMerge)})();