import{XtalInsertJson}from"./xtal-insert-json.js";(function(){const pass_thru_on_init="pass-thru-on-init",pass_to="pass-to";class XtalJSONMerge extends XtalInsertJson{static get is(){return"xtal-json-merge"}static get observedAttributes(){return super.observedAttributes.concat(["pass-thru-on-init",pass_to])}connectedCallback(){this._upgradeProperties(["passThruOnInit",pass_to,"postMergeCallbackFn"]);super.connectedCallback()}get mergedProp(){return this._mergedProp}set mergedProp(val){if(!this.cssKeyMappers&&!this.postMergeCallbackFn){super.mergedProp=val;return}this._mergedProp=val;const mergedObjectChangedEvent=this.de(val);if(this._postMergeCallbackFn){this._postMergeCallbackFn(mergedObjectChangedEvent,this);return}if(this.cssKeyMappers){this.cssKeyMappers.forEach(cssKeyMapper=>{const targetEls=this.getParent().querySelectorAll(cssKeyMapper.cssSelector);for(let i=0,ii=targetEls.length;i<ii;i++){const targetEl=targetEls[i];for(const key in cssKeyMapper.propMapper){const pathSelector=cssKeyMapper.propMapper[key];let context=mergedObjectChangedEvent;pathSelector.forEach(path=>{if(context)context=context[path]});targetEl[key]=context}}});return}this.dispatchEvent(mergedObjectChangedEvent)}get postMergeCallbackFn(){return this._postMergeCallbackFn}set postMergeCallbackFn(val){this._postMergeCallbackFn}get passThruOnInit(){return this._passThruOnInit}set passThruOnInit(val){if(val){this.setAttribute(pass_thru_on_init,"")}else{this.removeAttribute(pass_thru_on_init)}}get passTo(){return this._passTo}set passTo(val){this.setAttribute(pass_to,val)}attributeChangedCallback(name,oldVal,newVal){super.attributeChangedCallback(name,oldVal,newVal);switch(name){case pass_thru_on_init:this._passThruOnInit=null!==newVal;break;case pass_to:this._passTo=newVal;if(newVal){this.parsePassTo()}else{this.cssKeyMappers=null}break;}}onInputChange(newVal){if(!this._connected)return;let mergedObj;if(this._withPath){mergedObj={};const splitPath=this._withPath.split("."),lenMinus1=splitPath.length-1;splitPath.forEach((pathToken,idx)=>{if(idx===lenMinus1){mergedObj[pathToken]=newVal}else{mergedObj=mergedObj[pathToken]={}}})}else{mergedObj=newVal}this.loadJSON(()=>{this.postLoadJson(mergedObj)})}postLoadJson(mergedObj){if(this._objectsToMerge&&mergedObj){for(let i=0,ii=this._objectsToMerge.length;i<ii;i++){const objToMerge=this._objectsToMerge[i];switch(typeof objToMerge){case"object":this.mergeDeep(mergedObj,objToMerge);break;default:throw"TODO:  error message";}}}this.mergedProp=mergedObj}getParent(){return this.parentElement}mergeDeep(target,source){if("object"!==typeof target)return;if("object"!==typeof source)return;for(const key in source){const sourceVal=source[key],targetVal=target[key];if(!sourceVal)continue;if(!targetVal){target[key]=sourceVal;continue}if(Array.isArray(sourceVal)&&Array.isArray(targetVal)){if(0<targetVal.length&&"undefined"===typeof targetVal[0].id)continue;for(var i=0,ii=sourceVal.length;i<ii;i++){sourceVal[i]}continue}switch(typeof sourceVal){case"object":switch(typeof targetVal){case"object":this.mergeDeep(targetVal,sourceVal);break;default:target[key]=sourceVal;break;}break;default:target[key]=sourceVal;}}return target}parsePassTo(){this.cssKeyMappers=[];const endsWithBrace=this._passTo.endsWith("}"),adjustedPassTo=this._passTo+(endsWithBrace?";":""),splitPassTo=adjustedPassTo.split("};");splitPassTo.forEach(passTo=>{if(!passTo)return;const splitPassTo2=passTo.split("{"),tokens=splitPassTo2[1].split(";"),propMapper={};tokens.forEach(token=>{const nameValuePair=token.split(":");propMapper[nameValuePair[0]]=nameValuePair[1].split(".")});this.cssKeyMappers.push({cssSelector:splitPassTo2[0],propMapper:propMapper})})}}customElements.define(XtalJSONMerge.is,XtalJSONMerge)})();