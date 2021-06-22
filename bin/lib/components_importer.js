// importer seleku (4:0)

// fungsi yang akan mengembalikan hasil dari import (4:1)
let @aliasImportName = ({target})=>{

	@prop

	@components

	let index = [];
	let prop = [];
	let component_life = []
	let position = 0;

	for (let $components_ of @componentName) {
	  index.push(Seleku($components_));
	}


	for (let $components_final of index) {

	  $components_final.create = @system;

	  $components_final.$element = $components_final.component.parents;

	  $components_final.position = position;

	  component_life.push($components_final);

	  prop.push($components_final.bindingContext = @binding)

	  position++;

	}

	$_component__ = [...$_component__,...component_life];
	$_context__ = [...$_context__,...prop];

	return prop;

};