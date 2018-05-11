[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

# \<json-merge\>

json-merge is a dependency free web component.  It may make more sense to use in [disciplined, declarative markup-centric](https://blog.153.io/2017/03/08/you-dont-get-amp/) environments -- server-driven architectures or HTML template-oriented components / web apps.  It may seem somewhat jarring to see it inside a JavaScript, code-centric render function, like those found in (P)React / LitHTML / HyperHTML / SkateJS, etc.  More on that later.

json-merge can also be useful for demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.


## Mission

Many complex components, like grids, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

For productivity purposes, I like  the configuration to be as physically close to the markup tag where the grid is placed.  In fact, I would venture that 50% of UI screens are doing something like the following:

```html
<!--- Polymer Syntax -->
<fetch-data url="https://HRDatabase.com" output="{{rowData}}"></fetch-data>
<json-merge  input="[[rowData]]" refs="{{formatters}}" wrap-object-with-path="data" mergedObject="{{employeeGridData}}">
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
<my-grid gridOptions="[[employeeGridData]]"></my-grid>
```

## You can't do that!!!

Here's why I like to keep this family intact -- 

1)  I can see at a glance the whole picture. This makes developing and debugging easy.
2)  If the grid needs to move elsewhere, it's a single cut and paste operation.

I have heard, but never understood, a great number of reasons why this family should be torn apart.

###  Is the data flowing uniderectionally?

Yes, the data flows down the page.

###  Does this belong inside a render function?

If a framework can't handle it running inside a render function, the framework needs to see a therapist for controlling issues. 

The UI is still a function of state.  It's just that part of that function is handled by json-merge.

### Aren't you mixing concerns?

True, we are using different technologies, but there's only one concern -- show a grid with as little fuss as possible.

###  Isn't your component too thick?

I'm too thick to understand the question.

## When is json-merge useful?

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it.  

json-merge enforces the declarative, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [https://www.ampproject.org/docs/reference/components/amp-bind](other examples of embedding JSON as part of the markup).

The JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<json-merge>
<script type="application/json">
//JSON goes here
</script>
```

During the parsing of the JSON, you can insert dynamic fields, if they are passed to the refs property of json-merge:

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="{{formatters}}" wrap-object-with-path="data" mergedObject="{{gridOptions}}">
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
<json-merge  input="[[gridData]]" refs="[[formatters]]" wrap-object-with-path="data" post-merge-callback-fn="[[renderGrid]]">
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
<my-grid>
```

If you would rather not write such a function, nor an event handler, you can alternatively specify where to pass it to.

```html
<!--- Polymer Syntax -->
<json-merge  input="[[gridData]]" refs="[[formatters]]" wrap-object-with-path="data" pass-to="myGrid{gridOptions:detail.mergedObject}">
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
<my-grid></my-grid>
```

The query for myGrid will begin from the parent DOM element (or shadowRoot fragment).  Yes, in this scenario, we have a component that is poking its parent.  Tsk, tsk!   
