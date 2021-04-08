import { xc } from 'xtal-element/lib/XtalCore.js';
/**
 * Combine passed-in JSON with JSON defined within script tag
 * @element xtal-insert-json
 *
 */
export class XtalInsertJson extends HTMLElement {
    constructor() {
        super(...arguments);
        this.self = this;
        this.propActions = propActions;
        this.reactor = new xc.Rx(this);
    }
    connectedCallback() {
        this.style.display = 'none';
        xc.hydrate(this, slicedPropDefs);
        this.loadJSON();
    }
    onPropChange(n, prop, newVal) {
        this.reactor.addToQueue(prop, newVal);
    }
    merge(dest, src) {
        Object.assign(dest, src);
    }
    loadJSON() {
        const scriptTag = this.querySelector('script[type="application\/json"]');
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON();
            }, 100);
            return;
        }
        this.stringToParse = scriptTag.innerText;
    }
}
XtalInsertJson.is = 'xtal-insert-json';
const parse = ({ stringToParse, disabled, self, refs, delay }) => {
    if (stringToParse === undefined || disabled)
        return;
    setTimeout(() => {
        try {
            if (refs) {
                self.objectsToMerge = JSON.parse(stringToParse, (key, val) => {
                    if (typeof val !== 'string')
                        return val;
                    if (!val.startsWith('${refs.') || !val.endsWith('}'))
                        return val;
                    const realKey = val.substring(7, val.length - 1);
                    return self.refs[realKey];
                });
            }
            else {
                if (!self.objectsToMerge)
                    self.objectsToMerge = JSON.parse(stringToParse);
            }
            self.stringToParse = undefined;
        }
        catch (e) {
            console.error("Unable to parse " + stringToParse);
        }
    }, delay === undefined ? 0 : delay);
};
const wrapAndMerge = ({ input, objectsToMerge, withPath, self, disabled, delay }) => {
    if (disabled || input === undefined || objectsToMerge === undefined)
        return;
    const wrappedObject = self.wrap(input);
    objectsToMerge.forEach(objToMerge => {
        self.merge(wrappedObject, objToMerge);
    });
    self.rawMergedProp = wrappedObject;
};
const postMergeCallback = ({ rawMergedProp, self, disabled, postMergeCallbackFn }) => {
    if (disabled || rawMergedProp === undefined)
        return;
    let newVal = undefined;
    if (postMergeCallbackFn) {
        newVal = postMergeCallbackFn(rawMergedProp, self);
        if (!newVal)
            return;
    }
    self.mergedProp = newVal ? newVal : rawMergedProp;
};
const propActions = [parse, wrapAndMerge, postMergeCallback];
const baseProp = {
    dry: true,
    async: true,
};
const objProp1 = {
    ...baseProp,
    type: Object
};
const objProp2 = {
    ...objProp1,
    notify: true,
    obfuscate: true,
    echoTo: 'value'
};
const objProp3 = {
    ...objProp1,
    parse: true
};
const propDefMap = {
    refs: objProp1, objectsToMerge: objProp1, stringToParse: objProp1, rawMergedProp: objProp1,
    mergedProp: objProp2, input: objProp3, value: objProp2
};
const slicedPropDefs = xc.getSlicedPropDefs(propDefMap);
xc.letThereBeProps(XtalInsertJson, slicedPropDefs, 'onPropChange');
xc.define(XtalInsertJson);
