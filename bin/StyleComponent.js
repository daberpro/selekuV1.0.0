"use strict";
// ini merupakan method yang akan membuat
// handle untuk css yang di ambil dari component
// kita menggunakan css parse untuk membuat handle
let CSS_FROM_SELEKU_TO_RENDER = [];
let CSS_FROM_SELEK = [];
let jess = (style, obj, parents, index, all, length) => {
    if (index !== length - 1)
        return;
    try {
        parents[index].value = style.replace(/(\r|\t|\n)/igm, "");
        CSS_FROM_SELEKU_TO_RENDER.push(all);
    }
    catch (err) {
        // console.log(err.message);
    }
};
let StyleHandle = (style) => {
    const css = require("css");
    const beautify = require('js-beautify').js;
    let { parse, stringify } = css;
    try {
        // require("fs").writeFileSync(__dirname+"/style.json",beautify(JSON.stringify(parse(style)),{indent_size: 2, space_in_empty_paren: true}));
        // mengambil semua data hasil parse
        let { rules } = parse(style)["stylesheet"];
        for (let x = 0; x < rules.length; x++) {
            if (rules[x].type === "rule" && rules[x].selectors[0].length > 0) {
                for (let d = 0; d < rules[x].declarations.length; d++) {
                    let $d = rules[x].declarations[d];
                    jess($d?.value?.replace(/end/igm, "}").replace(/then/igm, "{"), $d, rules[x].declarations, d, rules[x], rules[x].declarations.length);
                }
            }
            if (rules[x].type === "media" && rules[x].media) {
            }
        }
    }
    catch (err) {
        console.log(err.message);
    }
    // console.log(CSS_FROM_SELEKU_TO_RENDER)
    return CSS_FROM_SELEKU_TO_RENDER;
};
// module.exports.StyleHandle(`
// 	b{
// 		height: ((args)=> then
// 			return 2/3+"px"
// 		end);
// 	}
// 	p.box #id{
// 		width: 100px;
// 	}
// 	@keyframes animasi{
// 		0%{
// 			color: red;
// 		}
// 		100%{
// 			color: blue;
// 		}
// 	}
// 	@media screen{
// 		body{
// 			color: red
// 		}
// 	}
// `)
// console.log(CSS_FROM_SELEKU_TO_RENDER)
module.exports = StyleHandle;
