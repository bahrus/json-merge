import { XtallatX, define } from 'xtal-element/xtal-latx.js';
import { WithPath } from 'xtal-element/with-path.js';
import { hydrate } from 'trans-render/hydrate.js';
import { AttributeProps } from 'xtal-element/types.d.js';

/**
 * Combine passed-in JSON with JSON defined within script tag
 * @element xtal-insert-json
 *  
 */
export class XtalInsertJson extends XtallatX(hydrate(WithPath(HTMLElement))) {
    static is = 'xtal-insert-json';

    static attributeProps: any = ({ mergedProp, refs, input, objectsToMerge, stringToParse, withPath, rawMergedProp }: XtalInsertJson) => ({
        obj: [mergedProp, refs, objectsToMerge, stringToParse, rawMergedProp, input],
        str: [withPath],
        jsonProp: [input],
        notify: [mergedProp],
        dry: [input, objectsToMerge]
    } as AttributeProps);

    static parse =  ({ stringToParse, disabled, self, refs, delay }: XtalInsertJson) => {
        if (stringToParse === undefined || disabled) return;

        setTimeout(() => {
            try {
                if (refs) {
                    self.objectsToMerge = JSON.parse(stringToParse, (key, val) => {
                        if (typeof val !== 'string') return val;
                        if (!val.startsWith('${refs.') || !val.endsWith('}')) return val;
                        const realKey = val.substring(7, val.length - 1);
                        return self.refs[realKey];
                    });
                } else {
                    if (!self.objectsToMerge) self.objectsToMerge = JSON.parse(stringToParse);
                }
                self.stringToParse = undefined;
            } catch (e) {
                console.error("Unable to parse " + stringToParse);
            }
        }, delay === undefined ? 0 : delay);


    };


    static wrapAndMerge =  ({ input, objectsToMerge, withPath, self, disabled, delay }: XtalInsertJson) => {
        if (disabled || input === undefined || objectsToMerge === undefined) return;
        const wrappedObject = self.wrap(input);
        objectsToMerge.forEach(objToMerge => {
            self.merge(wrappedObject, objToMerge);
        })
        self.rawMergedProp = wrappedObject
    };

    static postMergeCallback = ({ rawMergedProp, self, disabled, postMergeCallbackFn }: XtalInsertJson) => {
        if (disabled || rawMergedProp === undefined) return;
        let newVal = undefined;

        if (postMergeCallbackFn) {
            newVal = postMergeCallbackFn(rawMergedProp, self);
            if (!newVal) return;
        }
        self.mergedProp = newVal ? newVal : rawMergedProp;
    };

    value: any;

    /**
     * An object that should be merged with the JSON inside the element
     * @type {object}
     * @attr
     **/
    input: object;

    /**
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     * @type {object}
     */
    refs: object;

    rawMergedProp: object;

    /**
     * @type {object}
     * ⚡merged-prop-changed
     * The result of merging the input property with the JSON inside the script tag.
     * 
     */
    mergedProp: object;


    /**
     * Pass in a function to handle the resulting merged object, rather than using events.
     * @type {function}
     * 
     */
    postMergeCallbackFn: (mergedObj: any, t: XtalInsertJson) => any;


    /**
     * Number of milliseconds to wait before passing the input on for processing.
     * @type {number}
     * 
     */
    delay: number;

    stringToParse: string;


    /**
     * The object array that is to be merged.
     * @type {array}
     * 
     */
    objectsToMerge: object[];



    merge(dest: object, src: object) {
        Object.assign(dest, src);
    }

    propActions = [
        XtalInsertJson.parse,
        XtalInsertJson.wrapAndMerge,
        XtalInsertJson.postMergeCallback,
    ];



    loadJSON() {
        const scriptTag = this.querySelector('script[type="application\/json"]') as HTMLScriptElement;
        if (!scriptTag) {
            setTimeout(() => {
                this.loadJSON();
            }, 100);
            return;
        }
        this.stringToParse = scriptTag.innerText;
    }

    connectedCallback() {
        this.style.display = 'none';
        super.connectedCallback();
        this.loadJSON();
    }

}
define(XtalInsertJson);