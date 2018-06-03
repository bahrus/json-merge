import{XtallatX}from"./node_modules/xtal-latx/xtal-latx.js";const input="input",with_path="with-path",delay="delay";export class XtalInsertJson extends XtallatX(HTMLElement){static get is(){return"xtal-insert-json"}static get observedAttributes(){return super.observedAttributes.concat([delay,with_path,input])}get input(){return this._input}set input(val){this._input=val;if(this._delay){setTimeout(()=>{this.onPropChange()},this._delay)}else{this.onPropChange()}}get refs(){return this._refs}set refs(val){this._refs=val;delete this._objectsToMerge;this.onPropChange()}get mergedProp(){return this._mergedProp}set mergedProp(val){this.updateResultProp(val,"merged-prop","_mergedProp",this._postMergeCallbackFn)}get postMergeCallbackFn(){return this._postMergeCallbackFn}set postMergeCallbackFn(val){this._postMergeCallbackFn}get withPath(){return this._withPath}set withPath(val){this.setAttribute(with_path,val)}get delay(){return this._delay}set delay(newVal){this.setAttribute(delay,newVal.toString())}attributeChangedCallback(name,oldVal,newVal){switch(name){case input:this.input=JSON.parse(newVal);break;case with_path:this._withPath=newVal;break;case delay:this._delay=parseFloat(newVal);break;}super.attributeChangedCallback(name,oldVal,newVal);this.onPropChange()}get objectsToMerge(){return this._objectsToMerge}set objectsToMerge(val){this._objectsToMerge=val}loadJSON(callBack){const scriptTag=this.querySelector("script[type=\"application/json\"]");if(!scriptTag){setTimeout(()=>{this.loadJSON(callBack)},100);return}const stringToParse=scriptTag.innerText;if(!this._objectsToMerge){try{if(this.refs){this._objectsToMerge=JSON.parse(stringToParse,(key,val)=>{if("string"!==typeof val)return val;if(!val.startsWith("${refs.")||!val.endsWith("}"))return val;const realKey=val.substring(7,val.length-1);return this.refs[realKey]})}else{if(!this._objectsToMerge)this._objectsToMerge=JSON.parse(stringToParse)}}catch(e){console.error("Unable to parse "+stringToParse)}}callBack()}postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(let i=0,ii=this._objectsToMerge.length;i<ii;i++){const objToMerge=this._objectsToMerge[i];Object.assign(mergedObj,objToMerge)}}this.mergedProp=mergedObj}onPropChange(){if(!this._connected||this._disabled)return;let mergedObj;if(this._withPath){mergedObj={};const splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach((pathToken,idx)=>{if(idx===lenMinus1){mergedObj[pathToken]=this._input}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=this._input}this.loadJSON(()=>{this.postLoadJson(mergedObj)})}connectedCallback(){this._upgradeProperties([delay,input,"refs","withPath","passDown","postMergeCallbackFn"]);this._connected=!0;this.onPropChange()}}if(!customElements.get(XtalInsertJson.is)){customElements.define(XtalInsertJson.is,XtalInsertJson)}