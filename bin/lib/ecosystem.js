// membuat ecosystem untuk sistem (3:0)
class Ecosystem{

	binding = [];
	onDestroyEvent = null;
	onUpdateEvent = null;
	$element = null;
	component = null;
	position = 0;

	// membuat constructor untuk mengambil object (3:1)
	constructor(object){

		this.object = object;

	}

	// membuat fungsi create untuk me render element (3:2)
	set create({target,onCreate = ()=>{},onUpdate = ()=>{},onDestroy = ()=>{}}){

		let component = new draw(this.object,target);
		component.render();

		if(document.head.querySelector("style") instanceof HTMLStyleElement){

			document.head.querySelector("style").textContent = __Update();

		}
		else{

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
	set bindingContext(variabel){

		let setContext = [];

		for(let $x in variabel){
			setContext.push($x);
		}

		let context = Reactivity(variabel,this.binding,this.onUpdateEvent);

		context[setContext[0]] = context[setContext[0]];

	}

	// method ini berfungsi untuk mengembalikan nilai yang reactive (3:5)
	get bindingContext(){

	   return this.ctx;

	}

	// fungsi yang akan men destroy object dan menjalankan event (3:4)
	destroy(){

		this.onDestroyEvent({element: this.$element});

		// mendelete ecosystem ketika component di destroy,
		// dari global component registry
		if(typeof this.position === "number"){
			$_component__.splice(this.position,1);
			$_context__.splice(this.position,1);

			for(let $x in $_component__){

				if($_component__[$x].position !== 0)$_component__[$x].position--;

			}			
		}

		this.$element.remove();

	}

}

let Seleku = ($c)=> new Ecosystem($c);

let @fileName = [];

for(let $components_ of @componentName){
	@fileName.push(Seleku($components_));
}
