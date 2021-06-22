
// ini adalah lib untuk mengset binding menjadi global context
window.ctx = @binding;

window.ctx = CustomReactivity(ctx,{
	after({args,key}){

		for(let $data of $_context__){
			$data[key] = args;
		}

	}
});
