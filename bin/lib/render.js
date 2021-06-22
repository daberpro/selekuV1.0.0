
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
        }
        else {
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

class draw{

	// daftar property yang akan di gunakan 
	// untuk me-render (1:1)

	property_basic = ["element","inner","attribute","child"];

	// element parent di global member class (option)
	parents = null;

	// daftar propery attribute dari components (1:2)
	// abaikan ini !!! (ternyata attribute nya bisa apapun)
	// property_attribute = ["id","class","name"];


	// membuat properti components dari class (1:3)
	constructor(components_,target){
		this.components = components_;
		this.target = target;
	}

	// variabel ini akan berfungsi sebagai tempat peletakan
	// element induk (1:7)
	parent = null;

	// fungsi ini bertugas untuk merender (1:4)
	render(){

		// sebelum merender kita harus mengecheck property dari 
		// object components nya (1:5)

		// mengecheck semua property dari components
		for(let $property of this.property_basic){

			// melakukan pengechekan (1:6)
			if(!(this.components.hasOwnProperty($property))){

				console.warn(`cannot find the property ${$property}`); 
			
			}

			if($property === "element"){
				// membuat element dari object components (1:8)
			    this.parent = document.createElement(this.components[$property])

			}

			if($property === "inner"){

				// membuat inner dari object dan memasukan nya ke dalam element
				// (1:9)
				if(this.parent instanceof HTMLElement) this.parent.append(this.components[$property].replace(/\"/igm,""));

			}

			if($property === "attribute"){

				// mengecheck apakah attribute nya merupakan array
				// kemudian mengecheck apakah attribute nya berupa object
				// dan melakukan check dari variabel property_attribute (1:10)

				if(this.components[$property] instanceof Array){

					for(let $child_attr of this.components[$property]){

						for(let $child_attr_value in $child_attr){

							this.parent.setAttribute($child_attr_value,$child_attr[$child_attr_value].value);

						}

					}

				}


			}

			if($property === "child"){

				// mengecheck apakah child nya merupakan array
				// kemudian mengecheck apakah child nya berupa object
			    // dan rekrusif fungsi (1:12)

			    if(this.components[$property] instanceof Array){

			    	for(let $child of this.components[$property]){

			    		new draw($child,this.parent).render();

			    	}

			    }

			}

		}

		// // mendaftarkan jika inner berisi bind value (1:15)
		if(/\{.*?\}/igm.test(this.parent.innerHTML)){

			// variabel binding (1:16)
			let bind = this.parent.innerHTML.match(/\{.*?\}/igm);

			this.binding.push({element:this.parent,bind,inner: this.parent.innerHTML});

		}

		// merender element yang telah di buat ke dalam element target
		if(this.parent.nodeName !== "CONFIG"){
            this.target.appendChild(this.parent)
        }

		this.parents = this.parent;


	}

	// variabel berikut ini akan di gunakan untuk Binding (1:14)
	binding = [];


	// membuat reactivity untuk components (1:13)
	reactivity(components_){

		let parents = this.parents;

		// membuat set handler untuk menentukan reactivity value nya
		const handler = {
			set(obj,prop,value){

				if(prop === "inner"){

					parents.textContent = value;
					obj[prop] = value;

				}

			},
			get(target,prop){
				return target[prop];
			}
		}

		return (new Proxy(this.components,handler));

	}

}


 