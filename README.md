[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)
# \<xtal-json-merge\>

json-merge is a dependency free web component.  It provides binding support compatible with Polymer, but it can be used in non Polymer settings as well.  It may make more sense to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps like VueJS, Polymer (as we mentioned already) or Aurelia (or Angular?). It may seem somewhat jarring to see it inside a JavaScript, code-centric render function, like those found in (P)React / LitHTML / HyperHTML / SkateJS, etc.  More on that later.

json-merge can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.


## Mission

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

I would venture that 50% of UI Screens in the world consist of the following workflow:  

1)  Get data 
2)  Merge with configuration (and/or other manipulation of the data, not discussed here)
3)  Render using some specialized renderer (like a grid or chart component).  

We assume here that step 3 is:

1) done with another third party web component.  For simplicity we'll assume it's called my-grid
2) defined via some form of template markup i.e. \<my-grid\>

For productivity purposes, I like the places that define the first two steps to be as "physically close" to the place where the third step is defined as possible.  What this looks like in Polymer is a beauty to behold (according to my eye):


```html
<!--- Polymer Syntax -->
<fetch-data url="https://HRDatabase.com" output="{{rowData}}"></fetch-data>
<json-merge  input="[[rowData]]" refs="{{formatters}}" with-path="data" merged-obj="{{employeeGridData}}">
    <script type="application/json">
    [{
        "columns":[
            {"id": "index",       "name": "Index",      "field": "index"},
            {"id": "isActive",    "name": "Active",     "field": "isActive"},
            {"id": "balance",     "name": "Balance",    "field": "balance", "formatter":  "${refs.dollarFormatter}"},
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
</json-merge>
<my-grid grid-options="[[employeeGridData]]"></my-grid>
```


Here's why I like to keep this trio of tags (data retrieval, data merge, grid) cozily next to eachother:

1)  I can see at a glance the whole picture. This makes developing and debugging easy.
2)  If the grid needs to move elsewhere, it's a single cut and paste operation.

## You can't do that!!!

I have heard, but never understood, a great number of reasons why this trio should be torn apart.

###  Data flow must be unidirectional!!!

It is, the data flows down the page.

###  That has no place in a render function!!!

If a framework can't handle it running inside a render function, the framework needs to see a therapist for controlling issues. 

The UI is still a function of state.  All we've done is given some part of the rendering responsibility to json-merge (and of course the grid takes it from there).

### You're mixing concerns!!!

True, we are using different technologies, but there's only one concern -- show a grid with as little fuss as possible.

###  Isn't your component too thick?

I'm too thick to understand the question.

## When is json-merge useful?

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it.  

json-merge enforces the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [other examples of embedding JSON as part of the markup](https://www.ampproject.org/docs/reference/components/amp-bin).

The JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<json-merge>
<script type="application/json">
//JSON goes here
</script>
</json-merge>
```

During the parsing of the JSON, you can insert dynamic fields, if they are passed to the refs property of json-merge:

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="{{formatters}}" with-path="data" merged-obj="{{gridOptions}}">
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
</json-merge>
<my-grid gridOptions="[[gridOptions]]"></my-grid>
```

By default, the mergedObject property / event raises an event containing the merged object.

One can raise the objection that using an event handler to pass data between components violates some philophical tenet or other, or that it is less efficient.  May I see the day when this is actually the bottleneck of any application.  Still, if this is a concern, you can instead provide a callback function, which will skip the event-based approach:

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="[[formatters]]" with-path="data" post-merge-callback-fn="[[renderGrid]]">
<script type="application/json">
...
</script>
</json-merge>
<my-grid>
```

If you would rather not write such a function, nor an event handler, you can alternatively specify where to pass it to.

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="[[formatters]]" with-path="data" pass-to="myGrid{gridOptions:detail.mergedObject}">
<script type="application/json">
...
</script>
</json-merge>
<my-grid></my-grid>
```

The query for myGrid will begin from the parent DOM element (or shadowRoot fragment).  Yes, in this scenario, we have a component that is poking its parent.  Tsk, tsk!  

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
