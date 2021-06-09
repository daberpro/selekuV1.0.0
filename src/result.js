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
  }, {
    element: "style",
    inner: ".box{font-family: santuy;width: ;}",
    attribute: [{
      type: {
        value: "text/css",
      },
      ignore: {
        value: "true",
      },
    }, ],
    child: [],
  }, ],
}, {
  element: "h1",
  inner: "hello {nama}",
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
}, ]

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
        this.parent = document.createElement(this.components[$property]);

      }

      if ($property === "inner") {

        // membuat inner dari object dan memasukan nya ke dalam element
        // (1:9)
        if (this.parent instanceof HTMLElement) this.parent.append(this.components[$property]);

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
    this.target.appendChild(this.parent);

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


// ini fungsi untuk me replace string berdasarkan index (optional)
function replaceUsingIndex(data, from_, to, replaceMent) {
  if (from_ >= data.length) return data;

  return data.substring(0, from_) + replaceMent + data.substring(to)
}

// fungsi reactivity adalah suatu fungsi yang di gunakan untuk
// membuat agar suatu oject menjadi reactive (0:0)

function Reactivity(obj_, components /*di dalam sini adalah components yang akan di binding*/ ) {

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

        console.log("haha")

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

              if (data === key.trim()) {

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

// membuat ecosystem untuk sistem (3:0)
class Ecosystem {

  // membuat constructor untuk mengambil object (3:1)
  constructor(object) {

    this.object = object;
    this.binding = [];
    this.onDestroyEvent = null;
    this.$element = null;

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

    onCreate(component);

    this.onDestroyEvent = onDestroy;
    this.binding = component.binding;
    this.$element = this.binding[0].element;

  }

  // membuat fungsi event untuk mengatur reactivity (3:3)
  ctx = null;
  set bindingContext(variabel) {

    let setContext = [];

    for (let $x in variabel) {
      setContext.push($x);
    }

    let context = Reactivity(variabel, this.binding);

    context[setContext[0]] = context[setContext[0]];

  }

  // method ini berfungsi untuk mengembalikan nilai yang reactive (3:5)
  get bindingContext() {

    return this.ctx;

  }

  // fungsi yang akan men destroy object dan menjalankan event (3:4)
  destroy() {

    this.$element.remove();
    this.onDestroyEvent();

  }

}

let Seleku = ($c) => new Ecosystem($c);

let index = Seleku(seleku_components_index);