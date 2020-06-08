import { XtallatX, define } from 'xtal-element/xtal-latx.js';
import { WithPath } from 'xtal-element/with-path.js';
import { hydrate } from 'trans-render/hydrate.js';
/**
 * Combine passed-in JSON with JSON defined within script tag
 * @element xtal-insert-json
 *
 */
let XtalInsertJson = /** @class */ (() => {
    class XtalInsertJson extends XtallatX(hydrate(WithPath(HTMLElement))) {
        constructor() {
            super(...arguments);
            this.propActions = [
                XtalInsertJson.parse,
                XtalInsertJson.wrapAndMerge,
                XtalInsertJson.postMergeCallback,
            ];
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
        connectedCallback() {
            this.style.display = 'none';
            super.connectedCallback();
            this.loadJSON();
        }
    }
    XtalInsertJson.is = 'xtal-insert-json';
    XtalInsertJson.attributeProps = ({ mergedProp, refs, input, objectsToMerge, stringToParse, withPath, rawMergedProp }) => ({
        obj: [mergedProp, refs, objectsToMerge, stringToParse, rawMergedProp, input],
        str: [withPath],
        jsonProp: [input],
        notify: [mergedProp],
        dry: [input, objectsToMerge]
    });
    XtalInsertJson.parse = ({ stringToParse, disabled, self, refs, delay }) => {
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
    XtalInsertJson.wrapAndMerge = ({ input, objectsToMerge, withPath, self, disabled, delay }) => {
        if (disabled || input === undefined || objectsToMerge === undefined)
            return;
        const wrappedObject = self.wrap(input);
        objectsToMerge.forEach(objToMerge => {
            self.merge(wrappedObject, objToMerge);
        });
        self.rawMergedProp = wrappedObject;
    };
    XtalInsertJson.postMergeCallback = ({ rawMergedProp, self, disabled, postMergeCallbackFn }) => {
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
    return XtalInsertJson;
})();
export { XtalInsertJson };
define(XtalInsertJson);
