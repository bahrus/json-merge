(function(){function a(a){var b=function(a){function b(){babelHelpers.classCallCheck(this,b);var a=babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments));return a.passThruOnInit=!1,a}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:'mergeDeep',value:function(a,b){var c=this;if('object'===('undefined'===typeof a?'undefined':babelHelpers.typeof(a))&&'object'===('undefined'===typeof b?'undefined':babelHelpers.typeof(b))){for(var d in b){var e=b[d],f=a[d];if(e){if(!f){a[d]=e;continue}if(Array.isArray(e)&&Array.isArray(f)){if(0<f.length&&'undefined'===typeof f[0].id)continue;for(var g,h=function(){var a=e[j];if('undefined'===typeof a.id)return'continue';var b=f.find(function(b){return b.id===a.id});b?c.mergeDeep(b,a):f.push(a)},j=0,i=e.length;j<i;j++)g=h(),'continue'===g;continue}switch('undefined'===typeof e?'undefined':babelHelpers.typeof(e)){case'object':switch('undefined'===typeof f?'undefined':babelHelpers.typeof(f)){case'object':this.mergeDeep(f,e);break;default:console.log(d),a[d]=e;}break;default:a[d]=e;}}}return a}}},{key:'loadJSON',value:function(){var a,b=this,c=this.querySelector('script[type="application/json"]');if(c)a=c.innerText;else if(void 0!==('undefined'===typeof json_merge_allow_json_without_script_tag?'undefined':babelHelpers.typeof(json_merge_allow_json_without_script_tag))&&json_merge_allow_json_without_script_tag)a=this.innerText;else return void console.error('Unable to find script tag child with type application/json, and global variable json_merge_allow_json_without_script_tag != true');try{this._objectsToMerge=this.refs?JSON.parse(a,function(a,c){if('string'!==typeof c)return c;if(!c.startsWith('${refs.')||!c.endsWith('}'))return c;var d=c.substring(7,c.length-1);return b.refs[d]}):JSON.parse(a)}catch(b){console.error('Unable to parse '+a)}return this._objectsToMerge}},{key:'onPrePropsChange',value:function(a){var b=this;this.delay?setTimeout(function(){b.onPropsChange(a)},this.delay):this.onPropsChange(a)}},{key:'onPropsChange',value:function(a){var b;if(this.wrapObjectWithPath?(b={},b[this.wrapObjectWithPath]=a):b=a,this.loadJSON(),this._objectsToMerge&&b)for(var c,d=0,e=this._objectsToMerge.length;d<e;d++)switch(c=this._objectsToMerge[d],'undefined'===typeof c?'undefined':babelHelpers.typeof(c)){case'object':this.mergeDeep(b,c);break;default:throw'TODO:  error message';}this._setResult(b)}},{key:'ready',value:function(){babelHelpers.get(b.prototype.__proto__||Object.getPrototypeOf(b.prototype),'ready',this).call(this),this.passThruOnInit&&this.onPropsChange({})}}],[{key:'is',get:function(){return'json-merge'}},{key:'properties',get:function(){return{wrapObjectWithPath:{type:String},watch:{type:Object,observer:'onPrePropsChange'},result:{type:Object,notify:!0,readOnly:!0},refs:{type:Object},passThruOnInit:{type:Boolean},delay:{type:Number}}}}]),b}(a(HTMLElement));customElements.define(b.is,b)}function b(){return c=document.currentScript,'function'!==typeof Polymer||'function'!==typeof Polymer.ElementMixin?void setTimeout(b,100):void a(Polymer.ElementMixin)}var c;b()})();