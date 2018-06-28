import{XtalInsertJson}from"./xtal-insert-json.js";(function(){var pass_thru_on_init="pass-thru-on-init",XtalJSONMerge=function(_XtalInsertJson){babelHelpers.inherits(XtalJSONMerge,_XtalInsertJson);function XtalJSONMerge(){babelHelpers.classCallCheck(this,XtalJSONMerge);return babelHelpers.possibleConstructorReturn(this,(XtalJSONMerge.__proto__||Object.getPrototypeOf(XtalJSONMerge)).apply(this,arguments))}babelHelpers.createClass(XtalJSONMerge,[{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(["passThruOnInit"]);babelHelpers.get(XtalJSONMerge.prototype.__proto__||Object.getPrototypeOf(XtalJSONMerge.prototype),"connectedCallback",this).call(this)}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){babelHelpers.get(XtalJSONMerge.prototype.__proto__||Object.getPrototypeOf(XtalJSONMerge.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);switch(name){case pass_thru_on_init:this._passThruOnInit=null!==newVal;break;}}},{key:"postLoadJson",value:function postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(var i=0,ii=this._objectsToMerge.length,objToMerge;i<ii;i++){objToMerge=this._objectsToMerge[i];switch(babelHelpers.typeof(objToMerge)){case"object":this.mergeDeep(mergedObj,objToMerge);break;default:throw"TODO:  error message";}}}this.mergedProp=mergedObj}},{key:"getParent",value:function getParent(){return this.parentElement}},{key:"mergeDeep",value:function mergeDeep(target,source){if("object"!==babelHelpers.typeof(target))return;if("object"!==babelHelpers.typeof(source))return;for(var key in source){var sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}if(Array.isArray(sourceVal)&&Array.isArray(targetVal)){if(0<targetVal.length&&"undefined"===typeof targetVal[0].id)continue;for(var i=0,ii=sourceVal.length;i<ii;i++){sourceVal[i]}continue}switch(babelHelpers.typeof(sourceVal)){case"object":switch(babelHelpers.typeof(targetVal)){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}},{key:"passThruOnInit",get:function get(){return this._passThruOnInit},set:function set(val){this.attr(pass_thru_on_init,val,"");m}}],[{key:"is",get:function get(){return"xtal-json-merge"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(XtalJSONMerge.__proto__||Object.getPrototypeOf(XtalJSONMerge),"observedAttributes",this).concat(["pass-thru-on-init"])}}]);return XtalJSONMerge}(XtalInsertJson);customElements.define(XtalJSONMerge.is,XtalJSONMerge)})();