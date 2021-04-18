[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/json-merge)

<a href="https://nodei.co/npm/xtal-json-merge/"><img src="https://nodei.co/npm/xtal-json-merge.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-json-merge">

# \<xtal-json-merge\>




xtal-json-merge merges predefined json with some dynamic json.  

These two components can also be useful for declarative custom elements, or template-based components, and demo pages that use html markup as the primary way of demonstrating the functionality of specific types of components, which we categorize below.

[Demo](https://codepen.io/bahrus/pen/ZELMbrN)

## Mission

Many complex components, like grids or charts, require a large amount of declarative configuration, beyond what is optimally configured via attributes.

I would venture that 50% of UI Screens in the world consist of the following workflow:  

1)  Get data 
2)  Merge with configuration (and/or other manipulation of the data, not discussed here)
3)  Render using some specialized renderer (like a grid or chart component).  

We assume here that step 3 is:

1) done with another third party web component.  For simplicity we'll assume it's called my-grid
2) defined via some form of template markup i.e. \<my-grid\>

Some components, like the Vaadin grid, choose to be configured via light DOM elements (a perfectly fine approach).  This component is of no help in those circumstances.

Other components tend to view themselves primarily as a JavaScript api, and then just quickly put a web component wrapper around it. Often that api consists of a single function or two, with a single parameter, where declarative JSON is expected to be passed.  These components are designed to facilitate working with such components. 

These components, xtal-insert-json and xtal-json-merge, enforce the declarative, optimized, side-effect free, XSS safe principles by insisting that the content is strictly compliant JSON.  See [other examples of embedding JSON as part of the markup](https://www.ampproject.org/docs/reference/components/amp-bind).

Note that someone ([Νίκος](https://marketplace.visualstudio.com/items?itemName=sissel.json-script-tag)) has kindly provided a nice VSCode extension, that makes editing JSON much easier.

The JSON needs to be wrapped inside a script tag with type application/json, as shown below.

```html
<xtal-insert-json>
<script type="application/json">
//JSON goes here
</script>
</xtal-insert-json>
```

## Example


```html
  <xtal-json-merge input={} with-path=rowData>
    <script type="application/json">
    [
      {
          "formula": "NaCl",
          "meltingPoint": 801,
          "boilingPoint": 1413
      },
      {
          "formula": "CaF2",
          "meltingPoint": 1418,
          "boilingPoint": 1533
      }
    ]
    </script>
  </xtal-json-merge>
  <p-d on=value-changed to=[-value] val=detail.value init-val=value m=1></p-d>
  <p-d on=value-changed to=[-input] val=detail.value init-val=value m=1></p-d>
  <xtal-editor -value key="Xtal Data"></xtal-editor>
  <div>Merge with</div>
  <code>
    [{
      "columns":[
          {"name": "Formula",         "field": "formula"},
          {"name": "Melting Point",   "field": "meltingPoint"},
          {"name": "BoilingPoint",    "field": "boilingPoint"}
      ],
      "gridOptions":{
          "enableCellNavigation": true,
          "enableColumnReorder": false
      }
    }]              
  </code>
  <xtal-json-merge -input id="insertData">
  <script type="application/json">
    {
      "columns":[
          {"name": "Formula",         "field": "formula"},
          {"name": "Melting Point",   "field": "meltingPoint"},
          {"name": "BoilingPoint",    "field": "boilingPoint"}
      ],
      "gridOptions":{
          "enableCellNavigation": true,
          "enableColumnReorder": false
      }
    }
  </script>
  </xtal-json-merge>
```


## Running xtal-json-merge

1. Install node.js
2. Fork or clone this repo.
3. Open command and navigate to location of fork or clone.
4. Issue the following commands:

```
$ npm install
$ npm run serve
```

5.  Open your browser to (typically) http://localhost:3030/demo/dev.html

