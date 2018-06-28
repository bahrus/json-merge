(function(){const disabled="disabled";function XtallatX(superClass){return class extends superClass{constructor(){super(...arguments);this._evCount={}}static get observedAttributes(){return[disabled]}get disabled(){return this._disabled}set disabled(val){this.attr(disabled,val,"")}attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}incAttr(name){const ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr(name,ec[name].toString())}attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}de(name,detail){const eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}}}const input="input",with_path="with-path",delay="delay";class XtalInsertJson extends XtallatX(HTMLElement){static get is(){return"xtal-insert-json"}static get observedAttributes(){return super.observedAttributes.concat([delay,with_path,input])}get input(){return this._input}set input(val){if(this._delay){setTimeout(()=>{this._input=val;this.onPropChange()},this._delay)}else{this._input=val;this.onPropChange()}}get refs(){return this._refs}set refs(val){this._refs=val;delete this._objectsToMerge;this.onPropChange()}get mergedProp(){return this._mergedProp}set mergedProp(val){let newVal=val;if(this._postMergeCallbackFn){newVal=this._postMergeCallbackFn(val,this);if(!newVal)return}this.value=this._mergedProp=newVal;this.de("merged-prop",{value:newVal})}get postMergeCallbackFn(){return this._postMergeCallbackFn}set postMergeCallbackFn(val){this._postMergeCallbackFn}get withPath(){return this._withPath}set withPath(val){this.attr(with_path,val)}get delay(){return this._delay}set delay(newVal){this.attr(delay,newVal.toString())}attributeChangedCallback(name,oldVal,newVal){switch(name){case input:this.input=JSON.parse(newVal);break;case with_path:this._withPath=newVal;break;case delay:this._delay=parseFloat(newVal);break;}super.attributeChangedCallback(name,oldVal,newVal);this.onPropChange()}get objectsToMerge(){return this._objectsToMerge}set objectsToMerge(val){this._objectsToMerge=val}loadJSON(callBack){const scriptTag=this.querySelector("script[type=\"application/json\"]");if(!scriptTag){setTimeout(()=>{this.loadJSON(callBack)},100);return}const stringToParse=scriptTag.innerText;if(!this._objectsToMerge){try{if(this.refs){this._objectsToMerge=JSON.parse(stringToParse,(key,val)=>{if("string"!==typeof val)return val;if(!val.startsWith("${refs.")||!val.endsWith("}"))return val;const realKey=val.substring(7,val.length-1);return this.refs[realKey]})}else{if(!this._objectsToMerge)this._objectsToMerge=JSON.parse(stringToParse)}}catch(e){console.error("Unable to parse "+stringToParse)}}callBack()}postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(let i=0,ii=this._objectsToMerge.length;i<ii;i++){const objToMerge=this._objectsToMerge[i];Object.assign(mergedObj,objToMerge)}}this.mergedProp=mergedObj}onPropChange(){if(!this._connected||this._disabled||!this._input)return;let mergedObj;if(this._withPath){mergedObj={};const splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach((pathToken,idx)=>{if(idx===lenMinus1){mergedObj[pathToken]=this._input}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=this._input}this.loadJSON(()=>{this.postLoadJson(mergedObj)})}connectedCallback(){this._upgradeProperties([delay,input,"refs","withPath","postMergeCallbackFn"]);this._connected=!0;this.onPropChange()}}if(!customElements.get(XtalInsertJson.is)){customElements.define(XtalInsertJson.is,XtalInsertJson)}(function(){const pass_thru_on_init="pass-thru-on-init";class XtalJSONMerge extends XtalInsertJson{static get is(){return"xtal-json-merge"}static get observedAttributes(){return super.observedAttributes.concat(["pass-thru-on-init"])}connectedCallback(){this._upgradeProperties(["passThruOnInit"]);super.connectedCallback()}get passThruOnInit(){return this._passThruOnInit}set passThruOnInit(val){this.attr(pass_thru_on_init,val,"");m}attributeChangedCallback(name,oldVal,newVal){super.attributeChangedCallback(name,oldVal,newVal);switch(name){case pass_thru_on_init:this._passThruOnInit=null!==newVal;break;}}postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(let i=0,ii=this._objectsToMerge.length;i<ii;i++){const objToMerge=this._objectsToMerge[i];switch(typeof objToMerge){case"object":this.mergeDeep(mergedObj,objToMerge);break;default:throw"TODO:  error message";}}}this.mergedProp=mergedObj}getParent(){return this.parentElement}mergeDeep(target,source){if("object"!==typeof target)return;if("object"!==typeof source)return;for(const key in source){const sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}if(Array.isArray(sourceVal)&&Array.isArray(targetVal)){if(0<targetVal.length&&"undefined"===typeof targetVal[0].id)continue;for(var i=0,ii=sourceVal.length;i<ii;i++){sourceVal[i]}continue}switch(typeof sourceVal){case"object":switch(typeof targetVal){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}}customElements.define(XtalJSONMerge.is,XtalJSONMerge)})()})();