[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

<a href="https://nodei.co/npm/xtal-json-merge/"><img src="https://nodei.co/npm/xtal-json-merge.png"></a>
# \<xtal-json-merge\>

[Demo](https://xtal-json-editor-demo.glitch.me/) 

xtal-json-merge and xtal-insert-json are dependency free web components, that merge predefined json with some dynamic json.  xtal-json-merge extends xtal-insert-json. They provide binding support compatible with Polymer, but they can be used in non Polymer settings as well.  It may seem more natural to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps like VueJS, Polymer (as we mentioned already), Aurelia, Svelte, Angular. It may seem somewhat jarring to see it inside a JavaScript, code-centric render function, like those found in (P)React / LitHTML / HyperHTML / SkateJS / StencilJS, etc.  More on that later.

These two components can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.

xtal-insert-json.js is ~1.2KB minified and gzipped (not counting a common utility mixin used by multiple xtal-* components, such as xtal-fetch mentioned below).  xtal-json-merge.js is ~820b minified and gzipped.  Both require importing via ES6 Modules. 

The two files, plus the common utility mixin mentioned above, are combined into one IIFE file, json-merge.js, which can be imported via a classic script tag.  This combined file is ~1.8kb minified and gzipped

## Mission

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

I would venture that 50% of UI Screens in the world consist of the following workflow:  

1)  Get data 
2)  Merge with configuration (and/or other manipulation of the data, not discussed here)
3)  Render using some specialized renderer (like a grid or chart component).  

We assume here that step 3 is:

1) done with another third party web component.  For simplicity we'll assume it's called my-grid
2) defined via some form of template markup i.e. \<my-grid\>

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it. Often that api consists of a single function or two, with a single parameter, where declarative JSON is expected to be passed.  These components are designed to facilitate working with such components. 

These components, xtal-insert-json and xtal-json-merge, enforce the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [other examples of embedding JSON as part of the markup](https://www.ampproject.org/docs/reference/components/amp-bind).

If using a markup-centric framework, the JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<xtal-insert-json>
<script type="application/json">
//JSON goes here
</script>
</xtal-insert-json>
```

## Why is this the right approach?

For productivity purposes, I like the places that define the first two steps to be as "physically close" to the place where the third step is defined as possible.  What this looks like in Polymer is a beauty to behold (according to my eye):


```html
<!--- Polymer Syntax -->
<fetch-data url="https://HRDatabase.com" output="{{rowData}}"></fetch-data>
<xtal-insert-json  input="[[rowData]]" refs="[[formatters]]" with-path="data" merged-prop="{{employeeGridData}}">
    <script type="application/json">
    [{
        "columns":[
            {"id": "index",       "name": "Index",      "field": "index"},
            {"id": "isActive",    "name": "Active",     "field": "isActive"},
            {"id": "salary",     "name": "Salary",      "field": "balance", "formatter":  "${refs.dollarFormatter}"},
            {"id": "age",         "name": "Age",        "field": "age"},
            {"id": "eyeColor",    "name": "Eye Color",  "field": "eyeColor"},
            {"id": "name",        "name": "Name",       "field": "name"},
            {"id": "gender",      "name": "Gender",     "field": "gender"},
        ],
        "gridSettings":{
            "enableCellNavigation": true,
            "enableColumnReorder": false
        }
    }]
    </script>
</xtal-insert-json>
<my-grid grid-options="[[employeeGridData]]"></my-grid>
```

Here's why I like to keep this trio of tags (data retrieval, data merge, grid) cozily next to eachother:

1)  I can see at a glance the whole picture. This makes developing and debugging easy.
2)  If the grid needs to move elsewhere, it's a single cut and paste operation.

## You can't do that!

I have heard, but never understood, a great number of reasons why this love triangle should be torn apart.

###  Data flow must be unidirectional!

It is, the data flows down the page.  

Okay, by relying on two-way binding support, one *could* have the data flow "upwards."  But the pattern above clearly shows the data flowing down (at the sibling level).

In fact, another component, [p-d](https://www.webcomponents.org/element/p-d.p-u) provides an alternative way of explicitly passing the data down the document, so there's no ambiguity that data flow is unidrectional, and no dependency on a two-way binding container needed.

###  That has no place in a render function!

If a framework can't handle it running inside a render function, the framework needs to see a therapist for controlling issues. 

The UI is still a function of state.  All we've done is give some part of the rendering responsibility to xtal-insert-json (and of course the grid takes it from there).

### You're mixing concerns!

True, we are using different technologies, but there's only one concern -- show a grid with as little fuss as possible.

###  Isn't your component too thick?

I'm too thick to understand the question.


## Dynamic fields
During the parsing of the JSON, you can insert dynamic fields, if they are passed to the refs property of json-merge:

```html
<!--- Polymer Syntax -->
<xtal-insert-json  input="[[gridData]]" refs="[[formatters]]" with-path="data" merged-obj="{{gridOptions}}">
<script type="application/json">
[{
    "columns":[
        {"id": "index",       "name": "Index",      "field": "index"},
        {"id": "isActive",    "name": "Active",     "field": "isActive"},
        {"id": "balance",     "name": "Balance",    "field": "balance", "formatter":  "${refs.testFormatter}"},
        {"id": "age",         "name": "Age",        "field": "age"},
        {"id": "eyeColor",    "name": "Eye Color",  "field": "eyeColor"},
        {"id": "name",        "name": "Name",       "field": "name"},
        {"id": "gender",      "name": "Gender",     "field": "gender"},
        {"id": "company",     "name":"Company",     "field": "company"}
    ],
    "gridSettings":{
        "enableCellNavigation": true,
        "enableColumnReorder": false
    }
}]
</script>
</xtal-insert-json>
<my-grid gridOptions="[[gridOptions]]"></my-grid>
```

Those refs are evaluated using the revivor function callback of JSON.parse.

## Post Merge callback

If you want to handle the merged object yourself, but either can't live with the minimal performance penalty of listening for an event, or are cursed to work with a framework that doesn't support listening for native custom DOM events, you can attach a callback function instead:

```html
<!--- Polymer Syntax -->
<xtal-json-merge  input="[[gridData]]" refs="[[formatters]]" with-path="data" post-merge-callback-fn="[[renderGrid]]">
<script type="application/json">
...
</script>
</xtal-json-merge>
<my-grid>
```

This may be useful if the declarative json (combined with dynamic refs in the revivor function) isn't quite powerful enough to handle your scenario.  The callback function should return the (modified) merged object.  If it is null, no further processing will take place.

## Final concession

Finally, the whole concept of adhering to strict declarative syntax when using a code-centric framework is kind of moot.  Claims to the contrary, these frameworks only dimly resemble true declarative solutions.  Where this becomes most apparent is in defining side-effect free JSON inside a JavaScript method.  What's the point?

In these scenarios, you can simply pass the configuration to xtal-insert-json's "objectsToMerge" property.  You will still benefit from less callback boilerplate code.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
