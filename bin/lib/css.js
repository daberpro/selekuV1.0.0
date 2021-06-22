// set style sheet

let all_style = [];

function __StyleSheet(args){

  let{
    type,
    selectors,
    declarations
  } = args;
	
	if(type === "rule" && selectors[0].length > 0){

		for(let x in declarations){

      let $x = declarations[x];

			try{

				let $fn = (eval($x.value) instanceof Function)? eval($x.value) : ()=>{};

        // console.log($fn)

				if(!($fn instanceof Function)) $x.value = $fn;

				$x.value = $fn({
					get(args){
						return {
							element: document.querySelector(args),
							rect: document.querySelector(args).getClientRects()
						}
					} 
				});	

        declarations[x] = $x;

			}catch(err){
        // console.log(err)
			}

		}

    all_style.push(args);

	}


}

function __renderCSS(args){

  let {
    selectors,
    declarations
  } = args;

  let properties = "";

  if(selectors[0].length > 0){

    for(let $x of declarations){

      properties += `${$x.property} : ${$x.value.replace(/(\r|\t|\n)/igm,"")};`;

    }

  }

  return `${selectors[0]} {${properties}}`;

}

function __Update(){

  let result = "";

  for(let $style of all_style){

    result += __renderCSS($style);

  }

  return result;

}

for(let $style_ of @css_cmpnts){
	__StyleSheet($style_)
}
