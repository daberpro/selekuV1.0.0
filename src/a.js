let nama = "andi";
let x = 100;
let a = 10;
let b = 3;
let card = ({
  target
}) => {
  let count = 0;
  let seleku_components_ = [{
    element: "h1",
    inner: "hello world",
    attribute: [],
    child: []
  }, {
    element: "b",
    inner: "{count}",
    attribute: [],
    child: []
  }];
  let index2 = [];
  let prop = [];
  for (let $components_ of seleku_components_) {
    index2.push(Seleku($components_));
  }
  for (let $components_final of index2) {
    $components_final.create = {
      target
    };
    $components_final.bindingContext = {
      count
    };
    prop.push($components_final.bindingContext = {
      count
    });
  }
  return prop;
};
let seleku_components_index = [{
  element: "config",
  inner: "",
  attribute: [{
    global: {
      value: "true"
    }
  }],
  child: [{
    element: "title",
    inner: "Hello world",
    attribute: [],
    child: []
  }]
}, {
  element: "h1",
  inner: "hello {nama} ",
  attribute: [{
    class: {
      value: "box"
    },
    id: {
      value: "box1"
    }
  }],
  child: [{
    element: "span",
    inner: "tinggiku ",
    attribute: [],
    child: []
  }, {
    element: "p",
    inner: "haha",
    attribute: [],
    child: [{
      element: "b",
      inner: "{x}",
      attribute: [],
      child: []
    }]
  }]
}, {
  element: "h1",
  inner: "hasil : {a+b}",
  attribute: [],
  child: []
}];
let seleku_components_style_index = [{
  type: "rule",
  selectors: ["b"],
  declarations: [{
    type: "declaration",
    property: "color",
    value: "gray",
    position: {
      start: {
        line: 4,
        column: 3
      },
      end: {
        line: 4,
        column: 14
      }
    }
  }, {
    type: "declaration",
    property: "width",
    value: '((args)=> {return 100/3+"%"})',
    position: {
      start: {
        line: 5,
        column: 3
      },
      end: {
        line: 9,
        column: 7
      }
    }
  }],
  position: {
    start: {
      line: 3,
      column: 2
    },
    end: {
      line: 10,
      column: 3
    }
  }
}, {
  type: "rule",
  selectors: [".box"],
  declarations: [{
    type: "declaration",
    property: "width",
    value: "100%",
    position: {
      start: {
        line: 13,
        column: 3
      },
      end: {
        line: 13,
        column: 15
      }
    }
  }],
  position: {
    start: {
      line: 12,
      column: 2
    },
    end: {
      line: 14,
      column: 3
    }
  }
}, {
  type: "rule",
  selectors: ["h1"],
  declarations: [{
    type: "declaration",
    property: "width",
    value: "100%",
    position: {
      start: {
        line: 17,
        column: 3
      },
      end: {
        line: 17,
        column: 14
      }
    }
  }],
  position: {
    start: {
      line: 16,
      column: 2
    },
    end: {
      line: 18,
      column: 3
    }
  }
}];
let all_style = [];
function __StyleSheet(args) {
  let {
    type,
    selectors,
    declarations
  } = args;
  if (type === "rule" && selectors[0].length > 0) {
    for (let x in declarations) {
      let $x = declarations[x];
      try {
        let $fn = eval($x.value) instanceof Function ? eval($x.value) : () => {
        };
        if (!($fn instanceof Function))
          $x.value = $fn;
        $x.value = $fn({
          get(args) {
            return {
              element: document.querySelector(args),
              rect: document.querySelector(args).getClientRects()
            };
          }
        });
        declarations[x] = $x;
      } catch (err) {
      }
    }
    all_style.push(args);
  }
}
function __renderCSS(args) {
  let {
    selectors,
    declarations
  } = args;
  let properties = "";
  if (selectors[0].length > 0) {
    for (let $x of declarations) {
      properties += `${$x.property} : ${$x.value.replace(/(\r|\t|\n)/igm, "")};`;
    }
  }
  return `${selectors[0]} {${properties}}`;
}
function __Update() {
  let result = "";
  for (let $style of all_style) {
    result += __renderCSS($style);
  }
  return result;
}
for (let $style_ of seleku_components_style_index) {
  __StyleSheet($style_);
}
let sort_int = (args = []) => {
  let restore;
  for (let i = 0; i < args.length; i++) {
    for (let j = i; j < args.length; j++) {
      if (args[i] > args[j]) {
        restore = args[i];
        args[i] = args[j];
        args[j] = restore;
      }
    }
  }
  let result = [];
  for (let x2 = 0; x2 < args.length; x2++) {
    if (args[x2] === args[x2 + 1]) {
      delete args[x2];
    } else {
      result = [...result, args[x2]];
    }
  }
  args = [];
  return result;
};
let clear_paste = (args = [], type = "") => {
  let result = [];
  if (type === "string") {
    for (let i = 0; i < args.length; i++) {
      for (let j = i; j < args.length; j++) {
        if (args[i] === args[j] && i !== j) {
          delete args[i];
        }
      }
    }
    for (let x2 of args) {
      if (x2) {
        result = [...result, x2];
      }
    }
    return result;
  }
  if (type === "number") {
    return sort_int(args);
  }
  if (type === "object" && args[0] instanceof Object) {
    let property_of_args = [];
    for (let x2 of args) {
      for (let y in x2) {
        property_of_args.push(y);
        break;
      }
    }
    for (let x2 = 0; x2 < args.length; x2++) {
      for (let y = x2; y < args.length; y++) {
        for (let z of property_of_args) {
          if (args[x2].hasOwnProperty(z)) {
            if (args[x2][z] === args[y][z] && x2 !== y) {
              args[x2] = {};
            }
          }
        }
      }
    }
    for (let x2 of args) {
      if (Object.keys(x2).length > 0)
        result.push(x2);
    }
    return result;
  }
};
class draw {
  property_basic = ["element", "inner", "attribute", "child"];
  parents = null;
  constructor(components_, target) {
    this.components = components_;
    this.target = target;
  }
  parent = null;
  render() {
    for (let $property of this.property_basic) {
      if (!this.components.hasOwnProperty($property)) {
        console.warn(`cannot find the property ${$property}`);
      }
      if ($property === "element") {
        this.parent = document.createElement(this.components[$property]);
      }
      if ($property === "inner") {
        if (this.parent instanceof HTMLElement)
          this.parent.append(this.components[$property].replace(/\"/igm, ""));
      }
      if ($property === "attribute") {
        if (this.components[$property] instanceof Array) {
          for (let $child_attr of this.components[$property]) {
            for (let $child_attr_value in $child_attr) {
              this.parent.setAttribute($child_attr_value, $child_attr[$child_attr_value].value);
            }
          }
        }
      }
      if ($property === "child") {
        if (this.components[$property] instanceof Array) {
          for (let $child of this.components[$property]) {
            new draw($child, this.parent).render();
          }
        }
      }
    }
    if (/\{.*?\}/igm.test(this.parent.innerHTML)) {
      let bind = this.parent.innerHTML.match(/\{.*?\}/igm);
      this.binding.push({
        element: this.parent,
        bind,
        inner: this.parent.innerHTML
      });
    }
    if (this.parent.nodeName !== "CONFIG") {
      this.target.appendChild(this.parent);
    }
    this.parents = this.parent;
  }
  binding = [];
  reactivity(components_) {
    let parents = this.parents;
    const handler = {
      set(obj, prop, value) {
        if (prop === "inner") {
          parents.textContent = value;
          obj[prop] = value;
        }
      },
      get(target, prop) {
        return target[prop];
      }
    };
    return new Proxy(this.components, handler);
  }
}
function Reactivity(obj_, components) {
  if (!(obj_ instanceof Object))
    console.warn("the reactivity need an object");
  function registerProperty(object, key) {
    let value = object[key];
    Object.defineProperty(object, key, {
      get() {
        return value;
      },
      set(args) {
        try {
          let mirror = null;
          for (let $components_ of components) {
            for (let $i = 0; $i < $components_.bind.length; $i++) {
              let data = $components_.bind[$i]?.replace(/{/igm, "").replace(/}/igm, "").trim();
              if (mirror === null) {
                mirror = $components_.inner;
              }
              if (data === key.trim()) {
                if (typeof args === "number")
                  eval(`${data} = ${args}`);
                if (typeof args === "string")
                  eval(`${data} = "${args}"`);
              }
              mirror = mirror.replace($components_.bind[$i], eval(data));
              $components_.element.innerHTML = mirror;
            }
          }
        } catch (err) {
          console.log(err);
        }
        ;
      }
    });
  }
  for (let $prop in obj_) {
    if (obj_.hasOwnProperty($prop)) {
      registerProperty(obj_, $prop);
    }
  }
  return obj_;
}
class Ecosystem {
  constructor(object) {
    this.object = object;
    this.binding = [];
    this.onDestroyEvent = null;
    this.$element = null;
  }
  set create({
    target,
    onCreate = () => {
    },
    onUpdate = () => {
    },
    onDestroy = () => {
    }
  }) {
    let component = new draw(this.object, target);
    component.render();
    if (document.head.querySelector("style") instanceof HTMLStyleElement) {
      document.head.querySelector("style").textContent = __Update();
    } else {
      let style = document.createElement("style");
      style.textContent = __Update();
      document.head.appendChild(style);
    }
    onCreate(component);
    this.onDestroyEvent = onDestroy;
    this.binding = component.binding;
    this.$element = this.binding[0]?.element;
  }
  ctx = null;
  set bindingContext(variabel) {
    let setContext = [];
    for (let $x in variabel) {
      setContext.push($x);
    }
    let context = Reactivity(variabel, this.binding);
    context[setContext[0]] = context[setContext[0]];
  }
  get bindingContext() {
    return this.ctx;
  }
  destroy() {
    this.$element.remove();
    this.onDestroyEvent();
  }
}
let Seleku = ($c) => new Ecosystem($c);
let index = [];
for (let $components_ of seleku_components_index) {
  index.push(Seleku($components_));
}
for (let $components_final of index) {
  $components_final.create = {
    target: document.body,
    onCreate() {
      console.log("i am create");
    }
  };
  $components_final.bindingContext = {
    nama,
    x,
    a,
    b
  };
}
