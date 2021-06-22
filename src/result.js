let $_context__ = [];
$_component__ = []; // importer seleku (4:0)

// fungsi yang akan mengembalikan hasil dari import (4:1)
let card = ({
  target
}) => {



  let seleku_components_ = [{
    element: "h1",
    inner: "hello {nama}",
    attribute: [],
    child: [],
  }, {
    element: "b",
    inner: "{count}",
    attribute: [],
    child: [],
  }, ]

  let index = [];
  let prop = [];
  let component_life = []
  let position = 0;

  for (let $components_ of seleku_components_) {
    index.push(Seleku($components_));
  }


  for (let $components_final of index) {

    $components_final.create =

      {
        target,
        onCreate(node) {

          console.log(" i am card component has been create");

        },
        onUpdate() {

          console.log(" i am updated ");

        }
      }

    ;

    $components_final.$element = $components_final.component.parents;

    $components_final.position = position;

    component_life.push($components_final);

    prop.push($components_final.bindingContext = {
      count,
    })

    position++;

  }

  $_component__ = [...$_component__, ...component_life];
  $_context__ = [...$_context__, ...prop];

  return prop;

};
let seleku_components_index = [{
  element: "config",
  inner: "",
  attribute: [{
    global: {
      value: "true",
    },
  }, ],
  child: [{
    element: "title",
    inner: "Hello world",
    attribute: [],
    child: [],
  }, ],
}, {
  element: "h1",
  inner: "hello {nama} ",
  attribute: [{
    class: {
      value: "box",
    },
    id: {
      value: "box1",
    },
  }, ],
  child: [{
    element: "span",
    inner: "tinggiku ",
    attribute: [],
    child: [],
  }, {
    element: "p",
    inner: "haha",
    attribute: [],
    child: [{
      element: "b",
      inner: "{x}",
      attribute: [],
      child: [],
    }, ],
  }, ],
}, {
  element: "h1",
  inner: "hasil : {a+b}",
  attribute: [],
  child: [],
}, ]
let seleku_components_style_index = [{
  "type": "rule",
  "selectors": ["b"],
  "declarations": [{
    "type": "declaration",
    "property": "color",
    "value": "gray",
    "position": {
      "start": {
        "line": 4,
        "column": 3
      },
      "end": {
        "line": 4,
        "column": 14
      }
    }
  }, {
    "type": "declaration",
    "property": "width",
    "value": "((args)=> {return 100/3+\"%\"})",
    "position": {
      "start": {
        "line": 5,
        "column": 3
      },
      "end": {
        "line": 9,
        "column": 7
      }
    }
  }],
  "position": {
    "start": {
      "line": 3,
      "column": 2
    },
    "end": {
      "line": 10,
      "column": 3
    }
  }
}, {
  "type": "rule",
  "selectors": [".box"],
  "declarations": [{
    "type": "declaration",
    "property": "width",
    "value": "100%",
    "position": {
      "start": {
        "line": 13,
        "column": 3
      },
      "end": {
        "line": 13,
        "column": 15
      }
    }
  }],
  "position": {
    "start": {
      "line": 12,
      "column": 2
    },
    "end": {
      "line": 14,
      "column": 3
    }
  }
}, {
  "type": "rule",
  "selectors": ["h1"],
  "declarations": [{
    "type": "declaration",
    "property": "width",
    "value": "100%",
    "position": {
      "start": {
        "line": 17,
        "column": 3
      },
      "end": {
        "line": 17,
        "column": 14
      }
    }
  }],
  "position": {
    "start": {
      "line": 16,
      "column": 2
    },
    "end": {
      "line": 18,
      "column": 3
    }
  }
}]
// set style sheet

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

        let $fn = (eval($x.value) instanceof Function) ? eval($x.value) : () => {};

        // console.log($fn)

        if (!($fn instanceof Function)) $x.value = $fn;

        $x.value = $fn({
          get(args) {
            return {
              element: document.querySelector(args),
              rect: document.querySelector(args).getClientRects()
            }
          }
        });

        declarations[x] = $x;

      } catch (err) {
        // console.log(err)
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

      properties += `${$x.property} : ${$x.value.replace(/(\r|\t|\n)/igm,"")};`;

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
  __StyleSheet($style_)
}

// Reciprocal.js (include library by daber)
let sort_int = (args = []) => {
  let restore;
  //bublle short
  for (let i = 0; i < args.length; i++) {
    for (let j = i; j < args.length; j++) {
      if (args[i] > args[j]) {
        restore = args[i];
        args[i] = args[j];
        args[j] = restore;
      }
    }
  }
  // check if has the same value that will delete
  // and push the different value into the result
  let result = [];
  for (let x = 0; x < args.length; x++) {
    if (args[x] === args[x + 1]) {
      delete args[x];
    } else {
      result = [...result, args[x]];
    }
  }
  //redeclarate and make it empty
  args = [];
  return result;
};
// sort function for all type and custom flow
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
    for (let x of args) {
      if (x) {
        result = [...result, x];
      }
    }
    return result;
  }
  if (type === "number") {
    return sort_int(args);
  }
  if (type === "object" && args[0] instanceof Object) {
    let property_of_args = [];
    for (let x of args) {
      for (let y in x) {
        property_of_args.push(y);
        break;
      }
    }
    for (let x = 0; x < args.length; x++) {
      for (let y = x; y < args.length; y++) {
        for (let z of property_of_args) {
          if (args[x].hasOwnProperty(z)) {
            if (args[x][z] === args[y][z] && x !== y) {
              args[x] = {};
            }
          }
        }
      }
    }
    for (let x of args) {
      if (Object.keys(x).length > 0)
        result.push(x);
    }
    return result;
  }
};


// class render yaitu class
// yang akan menerima object hasil parse dari compiler
// dan akan di lakukan perenderan (1)

class draw {

  // daftar property yang akan di gunakan 
  // untuk me-render (1:1)

  property_basic = ["element", "inner", "attribute", "child"];

  // element parent di global member class (option)
  parents = null;

  // daftar propery attribute dari components (1:2)
  // abaikan ini !!! (ternyata attribute nya bisa apapun)
  // property_attribute = ["id","class","name"];


  // membuat properti components dari class (1:3)
  constructor(components_, target) {
    this.components = components_;
    this.target = target;
  }

  // variabel ini akan berfungsi sebagai tempat peletakan
  // element induk (1:7)
  parent = null;

  // fungsi ini bertugas untuk merender (1:4)
  render() {

    // sebelum merender kita harus mengecheck property dari 
    // object components nya (1:5)

    // mengecheck semua property dari components
    for (let $property of this.property_basic) {

      // melakukan pengechekan (1:6)
      if (!(this.components.hasOwnProperty($property))) {

        console.warn(`cannot find the property ${$property}`);

      }

      if ($property === "element") {
        // membuat element dari object components (1:8)
        this.parent = document.createElement(this.components[$property])

      }

      if ($property === "inner") {

        // membuat inner dari object dan memasukan nya ke dalam element
        // (1:9)
        if (this.parent instanceof HTMLElement) this.parent.append(this.components[$property].replace(/\"/igm, ""));

      }

      if ($property === "attribute") {

        // mengecheck apakah attribute nya merupakan array
        // kemudian mengecheck apakah attribute nya berupa object
        // dan melakukan check dari variabel property_attribute (1:10)

        if (this.components[$property] instanceof Array) {

          for (let $child_attr of this.components[$property]) {

            for (let $child_attr_value in $child_attr) {

              this.parent.setAttribute($child_attr_value, $child_attr[$child_attr_value].value);

            }

          }

        }


      }

      if ($property === "child") {

        // mengecheck apakah child nya merupakan array
        // kemudian mengecheck apakah child nya berupa object
        // dan rekrusif fungsi (1:12)

        if (this.components[$property] instanceof Array) {

          for (let $child of this.components[$property]) {

            new draw($child, this.parent).render();

          }

        }

      }

    }

    // // mendaftarkan jika inner berisi bind value (1:15)
    if (/\{.*?\}/igm.test(this.parent.innerHTML)) {

      // variabel binding (1:16)
      let bind = this.parent.innerHTML.match(/\{.*?\}/igm);

      this.binding.push({
        element: this.parent,
        bind,
        inner: this.parent.innerHTML
      });

    }

    // merender element yang telah di buat ke dalam element target
    if (this.parent.nodeName !== "CONFIG") {
      this.target.appendChild(this.parent)
    }

    this.parents = this.parent;


  }

  // variabel berikut ini akan di gunakan untuk Binding (1:14)
  binding = [];


  // membuat reactivity untuk components (1:13)
  reactivity(components_) {

    let parents = this.parents;

    // membuat set handler untuk menentukan reactivity value nya
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
    }

    return (new Proxy(this.components, handler));

  }

}



// fungsi reactivity adalah suatu fungsi yang di gunakan untuk
// membuat agar suatu oject menjadi reactive (0:0)

function Reactivity(obj_, components /*di dalam sini adalah components yang akan di binding*/ , callback /*ini adalah call back function*/ ) {

  // lakukan validasi dan pengecekan bahwa parameter obj_
  // itu adalah object (0:1)

  if (!(obj_ instanceof Object)) console.warn("the reactivity need an object");

  // membuat fungsi yang me register property dari object (0:2)
  function registerProperty(object, key) {

    // variabel ini merupakan variabel yang berfungsi untuk
    // menyimpan value dari property untuk di kembalikan
    // di karenakan setelah di reactive kan maka value dari property akan 
    // hilang (0:3)
    let value = object[key];

    Object.defineProperty(object, key, {

      // fungsi ini akan mengembalikan value property (0:4)
      get() {

        return value;

      },
      set(args /*parameter ini akan berisi nilai yang di input*/ ) {

        // call back function akan di panggil setiap kali
        // element di update
        if (callback instanceof Function) callback();

        // melakukan validasi/testing terhadap variabel yang
        // terdefenisi
        // try di gunakan untuk menghandle error ketika variabel tidak terdefinisi (0:5)
        try {

          // melakukan check apakah terdapat variabel yang memiliki
          // nama yang sama dengan key
          // dan melakukan set ke components (0:6)

          // ini variabel untuk memanipulasi string di inner
          let mirror = null;


          for (let $components_ of components) {

            // check apakah variabel sama dengan attribute
            // memberikan nilai di index -1

            for (let $i = 0; $i < $components_.bind.length; $i++) {

              let data = $components_.bind[$i]?.replace(/{/igm, "").replace(/}/igm, "").trim();

              if (mirror === null) {
                mirror = $components_.inner;
              }

              if (/(\+|\-|\/|\*)/igm.test(data.trim())) {

                let operator = [...data.match(/(\+|\-|\/|\*)/igm)];
                let string = [...data.match(/\w*/igm)];
                string = string.filter((el) => el.length > 0);

                for (let $x in string) {

                  if (string[$x] === key.trim()) {

                    if (typeof args === "number") eval(`${string[$x]} = ${args}`);
                    if (typeof args === "string") eval(`${string[$x]} = "${args}"`);

                  }

                }

              }

              if (!(/(\+|\-|\/|\*)/igm.test(data.trim())) && data === key.trim()) {

                if (typeof args === "number") eval(`${data} = ${args}`);
                if (typeof args === "string") eval(`${data} = "${args}"`);
              }

              mirror = mirror.replace($components_.bind[$i], eval(data));
              $components_.element.innerHTML = mirror;

            }

          }


        } catch (err) {

          // (0:7)
          console.log(err);

        };

      }

    });

  }

  // membuat setiap property yang ada di object menjadi reactive (0:3)
  for (let $prop in obj_) {

    if (obj_.hasOwnProperty($prop)) {


      // me-register
      registerProperty(obj_, $prop)

    }

  }

  return obj_;

}

// custom Reactivity adalah suatu fungsi yang akan
// mengubah suatu object menjadi recative (CUSTOMREACTIVITY)

function CustomReactivity(obj, {
  before,
  after
}) {

  for (let $property in obj) {

    if (obj.hasOwnProperty($property)) {

      let data = obj[$property];

      Object.defineProperty(obj, $property, {
        get() {

          return data;

        },
        set(args) {

          if (before instanceof Function) before({
            key: $property,
            args
          });

          try {

            if (typeof args === "string") eval(`${$property} = "${args}"`);

            if (typeof args === "number") eval(`${$property} = ${args}`);

            if (args instanceof Object) eval(`${$property} = ${JSON.stringify(args)}`);


          } catch (err) {

            console.log(err.message);

          }

          if (after instanceof Function) after({
            key: $property,
            args
          });

        }
      })

    }

  }

  return obj;

} // membuat ecosystem untuk sistem (3:0)
class Ecosystem {

  binding = [];
  onDestroyEvent = null;
  onUpdateEvent = null;
  $element = null;
  component = null;
  position = 0;

  // membuat constructor untuk mengambil object (3:1)
  constructor(object) {

    this.object = object;

  }

  // membuat fungsi create untuk me render element (3:2)
  set create({
    target,
    onCreate = () => {},
    onUpdate = () => {},
    onDestroy = () => {}
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
    this.onUpdateEvent = onUpdate;
    this.binding = component.binding;
    this.$element = this.binding[0]?.element;
    this.component = component;

  }

  // membuat fungsi event untuk mengatur reactivity (3:3)
  ctx = null;
  set bindingContext(variabel) {

    let setContext = [];

    for (let $x in variabel) {
      setContext.push($x);
    }

    let context = Reactivity(variabel, this.binding, this.onUpdateEvent);

    context[setContext[0]] = context[setContext[0]];

  }

  // method ini berfungsi untuk mengembalikan nilai yang reactive (3:5)
  get bindingContext() {

    return this.ctx;

  }

  // fungsi yang akan men destroy object dan menjalankan event (3:4)
  destroy() {

    this.onDestroyEvent({
      element: this.$element
    });

    // mendelete ecosystem ketika component di destroy,
    // dari global component registry
    if (typeof this.position === "number") {
      $_component__.splice(this.position, 1);
      $_context__.splice(this.position, 1);

      for (let $x in $_component__) {

        if ($_component__[$x].position !== 0) $_component__[$x].position--;

      }
    }

    this.$element.remove();

  }

}

let Seleku = ($c) => new Ecosystem($c);

let index = [];

for (let $components_ of seleku_components_index) {
  index.push(Seleku($components_));
}
let add = (...args) => args[0] + args[1];

let __$_position__ = 0;
let __$_fromParentsComponents__ = [];



let nama = "andi";
let x = 100;
let a = 10;
let b = 3;



let count = 0;



for (let $components_final of index) {

  $components_final.create =

    {
      target: document.body /*default from seleku*/ ,
      onCreate(node) {

        // console.log(node);

      }
    }


  $components_final.$element = $components_final.component.parents;
  $components_final.position = __$_position__;
  if ($components_final.$element.nodeName !== "CONFIG") __$_fromParentsComponents__.push($components_final);
  if ($components_final.$element.nodeName !== "CONFIG") $_context__.push($components_final.bindingContext = {
    nama,
    x,
    a,
    b,
  });

  if ($components_final.$element.nodeName !== "CONFIG") __$_position__++;
}

$_component__ = [...$_component__, ...__$_fromParentsComponents__];

// ini adalah lib untuk mengset binding menjadi global context
window.ctx = {
  nama,
  x,
  a,
  b,
};

window.ctx = CustomReactivity(ctx, {
  after({
    args,
    key
  }) {

    for (let $data of $_context__) {
      $data[key] = args;
    }

  }
});