
// fungsi reactivity adalah suatu fungsi yang di gunakan untuk
// membuat agar suatu oject menjadi reactive (0:0)

function Reactivity(obj_,components/*di dalam sini adalah components yang akan di binding*/,callback /*ini adalah call back function*/){

	// lakukan validasi dan pengecekan bahwa parameter obj_
	// itu adalah object (0:1)

	if(!(obj_ instanceof Object)) console.warn("the reactivity need an object");

	// membuat fungsi yang me register property dari object (0:2)
	function registerProperty(object,key){

		// variabel ini merupakan variabel yang berfungsi untuk
		// menyimpan value dari property untuk di kembalikan
		// di karenakan setelah di reactive kan maka value dari property akan 
		// hilang (0:3)
		let value = object[key];

		Object.defineProperty(object,key,{

			// fungsi ini akan mengembalikan value property (0:4)
			get(){

				return value;

			},
			set(args /*parameter ini akan berisi nilai yang di input*/){

				// call back function akan di panggil setiap kali
				// element di update
				if(callback instanceof Function) callback();

				// melakukan validasi/testing terhadap variabel yang
				// terdefenisi
				// try di gunakan untuk menghandle error ketika variabel tidak terdefinisi (0:5)
				try{

					// melakukan check apakah terdapat variabel yang memiliki
					// nama yang sama dengan key
					// dan melakukan set ke components (0:6)

					// ini variabel untuk memanipulasi string di inner
					let mirror = null;


					for(let $components_ of components){

						// check apakah variabel sama dengan attribute
						// memberikan nilai di index -1

						for(let $i = 0; $i < $components_.bind.length; $i++){

							let data = $components_.bind[$i]?.replace(/{/igm,"").replace(/}/igm,"").trim();

							if(mirror === null){
								mirror = $components_.inner;
							}

							if(/(\+|\-|\/|\*)/igm.test(data.trim())){

								let operator = [...data.match(/(\+|\-|\/|\*)/igm)];
								let string = [...data.match(/\w*/igm)];
								string = string.filter((el)=> el.length > 0);

								for(let $x in string){

									if( string[$x] === key.trim()){

										if(typeof args === "number") eval(`${string[$x]} = ${args}`);
										if(typeof args === "string") eval(`${string[$x]} = "${args}"`);

									}

								}

							}

							if( !(/(\+|\-|\/|\*)/igm.test(data.trim())) && data === key.trim()){

								if(typeof args === "number") eval(`${data} = ${args}`);
								if(typeof args === "string") eval(`${data} = "${args}"`);
							}

							mirror = mirror.replace($components_.bind[$i],eval(data));
							$components_.element.innerHTML = mirror;

						}

					}


				}catch(err){

					// (0:7)
					console.log(err);

				};

			}

		});

	}

	// membuat setiap property yang ada di object menjadi reactive (0:3)
	for(let $prop in obj_){

		if(obj_.hasOwnProperty($prop)){


			// me-register
			registerProperty(obj_,$prop)

		}

	}

	return obj_;

 }

// custom Reactivity adalah suatu fungsi yang akan
// mengubah suatu object menjadi recative (CUSTOMREACTIVITY)

function CustomReactivity(obj,{before,after}){

	for(let $property in obj){

		if(obj.hasOwnProperty($property)){

			let data = obj[$property];

			Object.defineProperty(obj,$property,{
				get(){

					return data;

				},
				set(args){

					if(before instanceof Function) before({key: $property,args});

					try{

						if(typeof args === "string") eval(`${$property} = "${args}"`);

						if(typeof args === "number") eval(`${$property} = ${args}`);

						if(args instanceof Object) eval(`${$property} = ${JSON.stringify(args)}`);


					}catch(err){

						console.log(err.message);

					}

					if(after instanceof Function) after({key: $property,args});

				}
			})

		}

	}

	return obj;

}