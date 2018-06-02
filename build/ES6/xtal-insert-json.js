const input="input",with_path="with-path",delay="delay",pass_down="pass-down",disabled="disabled";export class XtalInsertJson extends HTMLElement{static get is(){return"xtal-insert-json"}static get observedAttributes(){return[delay,with_path,input,pass_down,disabled]}get input(){return this._input}set input(val){this._input=val;if(this._delay){setTimeout(()=>{this.onPropChange()},this._delay)}else{this.onPropChange()}}get refs(){return this._refs}set refs(val){this._refs=val}de(val){const mergedObjectChangedEvent=new CustomEvent("merged-prop-changed",{detail:{value:val},bubbles:!0,composed:!1});return mergedObjectChangedEvent}get mergedProp(){return this._mergedProp}set mergedProp(val){this._mergedProp=val;if(this.cssKeyMappers){let nextSibling=this.nextElementSibling;while(nextSibling){this.cssKeyMappers.forEach(map=>{if(nextSibling.matches(map.cssSelector)){nextSibling[map.propTarget]=val}});nextSibling=nextSibling.nextElementSibling}return}const mergedObjectChangedEvent=this.de(val);if(this._postMergeCallbackFn){this._postMergeCallbackFn(mergedObjectChangedEvent,this);return}this.dispatchEvent(mergedObjectChangedEvent)}get postMergeCallbackFn(){return this._postMergeCallbackFn}set postMergeCallbackFn(val){this._postMergeCallbackFn}get withPath(){return this._withPath}set withPath(val){this.setAttribute(with_path,val)}get delay(){return this._delay}set delay(newVal){this.setAttribute(delay,newVal.toString())}get passDown(){return this._passDown}set passDown(val){this.setAttribute(pass_down,val)}get disabled(){return this._disabled}set disabled(val){if(val){this.setAttribute(disabled,"")}else{this.removeAttribute(disabled)}}attributeChangedCallback(name,oldVal,newVal){switch(name){case input:this.input=JSON.parse(newVal);break;case with_path:this._withPath=newVal;break;case delay:this._delay=parseFloat(newVal);break;case pass_down:this._passDown=newVal;this.parsePassDown();break;case disabled:this._disabled=null!==newVal;break;}this.onPropChange()}loadJSON(callBack){const scriptTag=this.querySelector("script[type=\"application/json\"]");if(!scriptTag){setTimeout(()=>{this.loadJSON(callBack)},100);return}const stringToParse=scriptTag.innerText;try{if(this.refs){this._objectsToMerge=JSON.parse(stringToParse,(key,val)=>{if("string"!==typeof val)return val;if(!val.startsWith("${refs.")||!val.endsWith("}"))return val;const realKey=val.substring(7,val.length-1);return this.refs[realKey]})}else{this._objectsToMerge=JSON.parse(stringToParse)}}catch(e){console.error("Unable to parse "+stringToParse)}callBack()}postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(let i=0,ii=this._objectsToMerge.length;i<ii;i++){const objToMerge=this._objectsToMerge[i];Object.assign(mergedObj,objToMerge)}}this.mergedProp=mergedObj}onPropChange(){if(!this._connected||this._disabled)return;let mergedObj;if(this._withPath){mergedObj={};const splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach((pathToken,idx)=>{if(idx===lenMinus1){mergedObj[pathToken]=this._input}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=this._input}this.loadJSON(()=>{this.postLoadJson(mergedObj)})}_upgradeProperties(props){props.forEach(prop=>{if(this.hasOwnProperty(prop)){let value=this[prop];delete this[prop];this[prop]=value}})}connectedCallback(){this._upgradeProperties([delay,input,"refs","withPath","passDown","postMergeCallbackFn"]);this._connected=!0;this.onPropChange()}parsePassDown(){this.cssKeyMappers=[];const splitPassDown=this._passDown.split("};");splitPassDown.forEach(passDownSelectorAndProp=>{if(!passDownSelectorAndProp)return;const splitPassTo2=passDownSelectorAndProp.split("{");this.cssKeyMappers.push({cssSelector:splitPassTo2[0],propTarget:splitPassTo2[1]})})}}if(!customElements.get(XtalInsertJson.is)){customElements.define(XtalInsertJson.is,XtalInsertJson)}