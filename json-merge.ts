module xtal.elements{
    interface JSONMergeProperties{
        wrapObjectWithPath: string | polymer.PropObjectType,
        watch: object | polymer.PropObjectType,
        result: object | polymer.PropObjectType,
        refs: {[key: string] : any} | polymer.PropObjectType,
        passThruOnInit: boolean | polymer.PropObjectType
    }
    export interface JSONMergeMethods{
        loadJSON() : object[];
        /**
         * Deep merge two objects.
         * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
         * @param target
         * @param source
         * 
         */
        mergeDeep(target, source)
    }
    function initJSONMerge(){
        /**
         * <js-merge></js-merge> is a Polymer-based helper element, that watches for changes to a property defined in 
         * its containing host polymer element.  When it changes, this element will merge the data with an array of JSON 
         * elements contained inside the tag.
         * The JSON can reference items from the refs property using ${this.refs.myProp}
         */
        class JSONMerge extends  Polymer.Element implements JSONMergeProperties{
            static get is(){return 'json-merge';}
            static get properties() : JSONMergeProperties{
                return {
                    /**
                     * Wrap the incoming object inside a new empty object, with key equal to this value.
                     * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
                     * and wrap-object-with-path = 'myPath'
                     * then the source object which be merged into is:
                     * {myPath: {foo: 'hello', bar: 'world'}}
                     */
                    wrapObjectWithPath:{
                        type: String
                    },
                    /**
                     * The expression to observe and transform when it changes.
                     */
                    watch:{
                        type: Object,
                        observer: 'onPropsChange'
                    },
                    /**
                     * The expression for where to place the result.
                     */
                    result:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                    /**
                     * Allow for substitions into JSON object, where the value is of the form "key":"${this.refs.xyz}"
                     */
                    refs:{
                        type: Object
                    },
                    /**
                     * If set to true, the JSON object will directly go to result during initalization
                     */
                    passThruOnInit:{
                        type: Boolean
                    }
                }
            }
            /**
            * Fired when a transform is in progress.
            *
            * @event transform
            */

            _objectsToMerge: Function[];

            wrapObjectWithPath: string;
            watch: object;
            result: object;
            refs: {[key: string] : any} ;
            passThruOnInit = false;

            /**
             * Deep merge two objects.
             * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
             * @param target
             * @param source
             * 
             */
            mergeDeep(target, source) {
                if(typeof target !== 'object') return;
                if(typeof source !== 'object') return;
                for (const key in source) {
                    const sourceVal = source[key];
                    const targetVal = target[key];
                    if(!sourceVal) continue; //TODO:  null out property?
                    if(!targetVal){
                        console.log(key);
                        target[key] = sourceVal;
                        continue;
                    }
                    if(Array.isArray(sourceVal) && Array.isArray(targetVal)){
                        //warning!! code below not yet tested
                        if(targetVal.length > 0 && typeof targetVal[0].id === 'undefined') continue;
                        for(var i = 0, ii = sourceVal.length; i < ii; i++){
                            const srcEl = sourceVal[i];
                            if(typeof srcEl.id === 'undefined') continue;
                            const targetEl = targetVal.find(function(el){return el.id === srcEl.id;});
                            if(targetEl){
                                this.mergeDeep(targetEl, srcEl);
                            }else{
                                targetVal.push(srcEl);
                            }
                        }
                        continue;
                    }
                    switch(typeof sourceVal){
                        case 'object':
                            switch(typeof targetVal){
                                case 'object':
                                    this.mergeDeep(targetVal, sourceVal);
                                    break;
                                default:
                                    console.log(key);
                                    target[key] = sourceVal;
                                    break;
                            }
                            break;
                        default:
                            console.log(key);
                            target[key] = sourceVal;
                    }
                }
                return target;
            }

            loadJSON(){
                const scriptTag = this.querySelector('script[type="application/json"') as HTMLScriptElement;
                if(!scriptTag){
                    console.error('Unable to find script tag child with type application/json');
                    return;
                }
                const stringToParse = scriptTag.innerText;
                try{
                    
                    if(this.refs){
                        this._objectsToMerge = JSON.parse(stringToParse, (key, val) => {
                            if(typeof val !== 'string') return val;
                            if(!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                            const realKey = val.substring(7, val.length - 1);
                            return this.refs[realKey];
                        } );
                    }else{
                        this._objectsToMerge = JSON.parse( stringToParse);
                    }
                    
                }catch(e){
                    console.error("Unable to parse " + stringToParse);
                }
                return this._objectsToMerge;    
            }
            
            onPropsChange(newVal){
                let transformedObj;
                if(this.wrapObjectWithPath) {
                    transformedObj  = {};
                    transformedObj[this.wrapObjectWithPath] = newVal;
                }else{
                    transformedObj = newVal;
                }
                this.loadJSON();
                if(this._objectsToMerge && transformedObj){
                    for(let i  = 0, ii = this._objectsToMerge.length; i < ii; i++)
                    {
                        const objToMerge = this._objectsToMerge[i];
                        switch(typeof(objToMerge)){
                            case 'object':
                                this.mergeDeep(transformedObj, objToMerge);
                                break;
                            default:
                                throw 'TODO:  error message'
                            
                        }
                    }
                }
                this['_setResult'](transformedObj);
            }

            ready(){
                super.ready();
                if(this.passThruOnInit){
                    this.onPropsChange({});
                }
            }
        }
        customElements.define(JSONMerge.is, JSONMerge);
    }
    function waitForPolymerElement(){
        if(typeof Polymer === 'undefined' || Polymer.Element === undefined){ //asynchronous
            customElements.whenDefined('poly-prep').then(() => initJSONMerge());
        }else{
            initJSONMerge();
        }
    }
    waitForPolymerElement();
    

   
}