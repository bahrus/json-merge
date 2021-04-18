
export interface XtalJsonMergeProps{
    disabled: boolean | undefined;

    value: any;

    /**
     * A key value pair object that allows the JSON to be passed functions or objects during the JSON parsing phase.
     * @type {object}
     */
    refs: object;

    /**
     * An object that should be merged with the JSON inside the element
     * @type {object}
     * @attr
     **/
    input: object;

    /**
     * Pass in a function to handle the resulting merged object, rather than using events.
     * @type {function}
     * 
     */
    postMergeCallbackFn: (mergedObj: any, t: XtalJsonMergeProps) => any;

    /**
     * Number of milliseconds to wait before passing the input on for processing.
     * @type {number}
     * 
     */
     delay: number;
}