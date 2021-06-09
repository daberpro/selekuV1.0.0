// membuat ecosystem untuk sistem (3:0)
class Ecosystem{

	// membuat constructor untuk mengambil object (3:1)
	constructor(object){

		this.object = object;
		this.binding = [];
		this.onDestroyEvent = null;
		this.$element = null;

	}

	// membuat fungsi create untuk me render element (3:2)
	set create({target,onCreate = ()=>{},onUpdate = ()=>{},onDestroy = ()=>{}}){

		let component = new draw(this.object,target);
		component.render();

		onCreate(component);

		this.onDestroyEvent = onDestroy;
		this.binding = component.binding;
		this.$element = this.binding[0].element;

	}

	// membuat fungsi event untuk mengatur reactivity (3:3)
	ctx = null;
	set bindingContext(variabel){

		let setContext = [];

		for(let $x in variabel){
			setContext.push($x);
		}

		let context = Reactivity(variabel,this.binding);

		context[setContext[0]] = context[setContext[0]];

	}

	// method ini berfungsi untuk mengembalikan nilai yang reactive (3:5)
	get bindingContext(){

	   return this.ctx;

	}

	// fungsi yang akan men destroy object dan menjalankan event (3:4)
	destroy(){

		this.$element.remove();
		this.onDestroyEvent();

	}

}

let Seleku = ($c)=> new Ecosystem($c);

let @fileName = Seleku(@componentName);
