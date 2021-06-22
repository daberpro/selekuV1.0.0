"use strict";
let path = require("path");
// (COMPILER CLASS)
class Compiler {
    constructor({ path, config }) {
        this.path = path;
        this.config = config;
    }
    // method ini yang akan bekerja untuk mengcompile
    compile() {
        const CREATE_UUID = () => {
            let dt = new Date().getTime();
            const uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (dt + Math.random() * 16) % 16 | 0;
                dt = Math.floor(dt / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        let { alias, name, type, lib, content, componentName, globalprop } = this.config;
        let componentConfig = "";
        let bindingVariabel = "";
        let componentscript = "";
        let allPath = "";
        if (alias) {
            allPath = alias + this.path;
        }
        else {
            allPath = this.path;
        }
        if (!(name?.length > 0) || name === void 0) {
            name = path.basename(this.path).replace(/\.\w*/igm, "");
        }
        // Reciprocal.js (include library by daber)
        const sort_int = (args = []) => {
            let restore;
            // bublle short
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
            // redeclarate and make it empty
            args = [];
            return result;
        };
        // sort function for all type and custom flow
        const clear_paste = (args = [], type = '') => {
            let result = [];
            if (type === 'string') {
                for (let i = 0; i < args.length; i++) {
                    for (let j = i; j < args.length; j++) {
                        if (args[i] === args[j] && i !== j) {
                            delete args[i];
                        }
                    }
                }
                for (const x of args) {
                    if (x) {
                        result = [...result, x];
                    }
                }
                return result;
            }
            if (type === 'number') {
                return sort_int(args);
            }
            if (type === 'object' && args[0] instanceof Object) {
                const property_of_args = [];
                for (const x of args) {
                    for (const y in x) {
                        property_of_args.push(y);
                        break;
                    }
                }
                for (let x = 0; x < args.length; x++) {
                    for (let y = x; y < args.length; y++) {
                        for (const z of property_of_args) {
                            if (args[x].hasOwnProperty(z)) {
                                if (args[x][z] === args[y][z] && x !== y) {
                                    args[x] = {};
                                }
                            }
                        }
                    }
                }
                for (const x of args) {
                    if (Object.keys(x).length > 0) {
                        result.push(x);
                    }
                }
                return result;
            }
        };
        function convertToText(obj) {
            // create an array that will later be joined into a string.
            const string = [];
            // is object
            //    Both arrays and objects seem to return "object"
            //    when typeof(obj) is applied to them. So instead
            //    I am checking to see if they have the property
            //    join, which normal objects don't have but
            //    arrays do.
            if (typeof (obj) == 'object' && (obj.join == undefined)) {
                string.push('{');
                for (const prop in obj) {
                    string.push(prop, ': ', convertToText(obj[prop]), ',');
                }
                string.push('}');
                // is array
            }
            else if (typeof (obj) == 'object' && !(obj.join == undefined)) {
                string.push('[');
                for (const prop in obj) {
                    string.push(convertToText(obj[prop]), ',');
                }
                string.push(']');
                // is function
            }
            else if (typeof (obj) == 'function') {
                string.push(obj.toString());
                // all other values can be done with JSON.stringify
            }
            else {
                string.push(JSON.stringify(obj));
            }
            return string.join('');
        }
        // =============================================================
        // ==================== compiler component =====================
        // =============================================================
        // kita membuat parser untuk html
        // untuk parser yang di gunakan adalah htmlparser2
        // parser ini di ambil dari https://www.npmjs.com/package/htmlparser2
        const fs = require('fs');
        const HTMLParser = require('node-html-parser');
        const htmlparser2 = require('htmlparser2');
        const beautify = require('js-beautify').js;
        const error = require('./Error');
        const Include = require('./libseleku');
        let StyleHandle = require("./StyleComponent.js");
        // variabel yang menyimpan hasil compile (2:11)
        let result_compile = [];
        // membuat array yang berisi kumpulan components (2:1)
        const components = [];
        // memparse tag yang ada di file .seleku (2:2)
        // (getFileText)
        const all_components = [...HTMLParser.parse((content) ? content : fs.readFileSync(allPath).toString()).childNodes];
        // membuat fungsi yang menghandle hasil parse (2:3)
        function getObjectFromParser(parser_tokens) {
            if (all_components.length === 0)
                console.log('the file is empty');
            // variabel yang menyimpan attribute dari element (2:5)
            let attribute = [];
            // membuat perulangan untuk mengisi array attribute (2:4)
            for (const $query of parser_tokens) {
                if ($query && $query.rawTagName !== null) {
                    // mengambil attributes dan membuat menjadi object
                    const array_of_attr = $query.rawAttrs?.match(/\w*=".*?\"/igm) || [];
                    let object_attribute = {};
                    for (const data of array_of_attr) {
                        const split_of_attr = data.split('=');
                        // console.log(split_of_attr)
                        object_attribute = { ...object_attribute, [split_of_attr[0]]: {
                                value: split_of_attr[1].replace(/\'/igm, '').replace(/\"/igm, ''),
                            },
                        };
                    }
                    attribute.push(object_attribute);
                }
            }
            // memfilter attribute agar tidak berisi attribute kosong (2:6)
            attribute = attribute.filter((attr_) => {
                for (const x in attr_) {
                    if (x) {
                        return attr_;
                    }
                }
            });
            // variabel ini akan berisi komponent anak (2:8)
            let child = [];
            // mengisi variabel anak (2:7)
            for (const $query of parser_tokens) {
                if ($query && $query.rawTagName !== null && $query.childNodes?.length > 0) {
                    for (let _anony = 0; _anony < $query.childNodes.length; _anony++) {
                        child.push(getObjectFromParser([$query.childNodes[_anony]]));
                    }
                }
            }
            // memfilter variabel anak agar tidak ada undefined (2:9)
            child = child.filter((obj, index) => obj);
            for (const $query of parser_tokens) {
                if ($query && $query.rawTagName !== null && $query.childNodes?.length > 0) {
                    return {
                        element: $query.rawTagName,
                        inner: ($query.rawTagName === 'config') ? '' : $query.rawText.replace(/(\n|\r|\t)*/igm, ''),
                        attribute,
                        child,
                    };
                }
            }
        }
        // mengisi hasil parser ke variabel result dan di filter
        // agar style dan script tidak di include (2:10)
        for (const $query of all_components) {
            if ($query.rawTagName !== 'style' && $query.rawTagName !== 'script' && $query)
                result_compile.push(getObjectFromParser([$query]));
        }
        // memfilter agar tidak ada yang undefined di array result (2:11)
        result_compile = result_compile.filter((data) => data);
        // variabel yang akan menyimpan alias dari preprocessing (2:23)
        let Alias = [];
        // variabel ini di gunakan untuk membuat configurasi ketika mengcompile
        // (2:25)
        const config = [];
        // variabel ini akan menyimpan nilai index dari error handling preprocess
        // (2:27)
        let same = '';
        // mengset agar config di set satu kali (2:31)
        let setConfig = 0, setJS = 0, CSS_FROM_COMPONENTS = [];
        // fungsi ini berfungsi untuk membuat inner yang benar
        // dan memindahkan ke variabel result (2:12)
        function getValue(object_, $stringToError) {
            let Name = '';
            let css = "";
            const fix = {};
            const parser = new htmlparser2.Parser({
                onopentag(name, attributes) {
                    // di sini untuk mencari tau apakah tag pertama nya
                    if (name !== 'style' && name !== 'script') {
                        Name = name;
                        // console.log(name)
                    }
                    else {
                        if (name === 'script' && attributes['seleku:ecosystem']?.replace(/\{/igm, '').replace(/\}/igm, '') === 'true') {
                            config.push({ name, 'seleku:ecosystem': attributes['seleku:ecosystem']?.replace(/\{/igm, '').replace(/\}/igm, '') });
                        }
                        // javascript include (JSinclude)
                        if (name === "script" && !(attributes['seleku:ecosystem']) && !(attributes['seleku:ignore'])) {
                            config.push({ name, 'JS': "true" });
                        }
                        if (name === "style" && !(attributes['seleku:ecosystem'] || attributes['seleku:ignore'])) {
                            css = "style";
                        }
                    }
                },
                ontext(text) {
                    // di sini untuk inner dari tag
                    // console.log({text,Name});
                    // console.log(fix)
                    if (css === "style") {
                        CSS_FROM_COMPONENTS.push(text);
                        css = "";
                    }
                    // membuat preprocessing (2:22)
                    if (/\#define.*/igm.test(text)) {
                        let typed = text.split('\n');
                        typed = typed.filter((el, index) => /\#define.*/igm.test(el));
                        typed = typed.map((el, index) => {
                            return el.split(' ');
                        });
                        for (const x_ of typed) {
                            if (x_.length === 3) {
                                Alias.push({ alias: x_[1], value: x_[2].replace(/(\r|\t|\n)/igm, '') });
                            }
                            else {
                                // membuat error handling untuk preprocess (2:28)
                                const indexOfError = () => {
                                    const position = [];
                                    const all_ = $stringToError.split('\n');
                                    const text = [];
                                    // console.log(all_)
                                    for (let x = 0; x < all_.length; x++) {
                                        if (eval(`(all_[x].match(/\\#define.*/igm) && all_[x].match(/\\${x_[1].trim()}.*/igm))`)) {
                                            position.push(x);
                                            text.push(all_[x]);
                                        }
                                    }
                                    ;
                                    return { position, text };
                                };
                                for (const loc in indexOfError().position) {
                                    if (same.indexOf((indexOfError().position[loc] + 1).toString()) === -1) {
                                        error({ config: { name: 'syntax', type: 'preprocess' }, message: indexOfError().text[loc].trim(), info: '\ttidak dapat mendifinisikan preProcess variabel', line: indexOfError().position[loc] + 1 });
                                        same += ` ${indexOfError().position[loc] + 1}`;
                                        break;
                                    }
                                }
                            }
                        }
                        // Alias.push({alias: typed[1],value: typed[2].replace(/(\r|\t|\n)/igm,"")})
                    }
                    for (const $config_ of config) {
                        if (setConfig !== 1 && $config_.name === 'script' && $config_['seleku:ecosystem'] === 'true') {
                            let Text = { text };
                            componentConfig += Text.text.replace(/return/igm, "");
                            $config_['seleku:ecosystem'] = "false";
                            setConfig = 1;
                        }
                        if (setJS !== 1 && $config_.name === "script" && $config_["JS"] === "true") {
                            componentscript = text.replace(/\export/igm, "");
                            let props = text.match(/export.*/igm);
                            let prop = props?.map((text, index) => {
                                if (text.indexOf("export") !== -1 && (text.indexOf("let") !== -1 || text.indexOf("var") !== -1) && text.split(" ").length >= 3) {
                                    return text.split(" ");
                                }
                            });
                            let objectBinding = "";
                            for (let $x of prop) {
                                objectBinding += $x[2] + ",";
                            }
                            bindingVariabel = `{${objectBinding}}`;
                            $config_["JS"] = "false";
                            setJS = 1;
                        }
                    }
                    if (object_.inner.match(text.replace(/(\n|\t|\r)/igm, '')) && text.length > 0 && object_.element === Name && !(/\@css*/igm.test(text)) && !(/\@js*/igm.test(text)) && text.replace(/(\n|\t|\r)/igm, '').length > 0) {
                        object_.inner = text.replace(/(\n|\t|\r)/igm, '');
                        if (object_.child.length > 0) {
                            for (const $x of object_.child) {
                                // (getFileText)
                                getValue($x, (content) ? content : fs.readFileSync(allPath).toString());
                            }
                        }
                        // console.log(object_);
                    }
                },
                onclosetag(tagname) {
                },
            });
            // (getFileText)
            parser.write((content) ? content : fs.readFileSync(allPath).toString());
            parser.end();
            // console.log(config)
        }
        // console.log(result_compile);
        // mengset setiap nilai (2:13)
        for (const $components_ of result_compile) {
            // (getFileText)
            getValue($components_, (content) ? content : fs.readFileSync(allPath).toString());
        }
        // melakukan filter ke css dari komponents (2:32)
        CSS_FROM_COMPONENTS = clear_paste(CSS_FROM_COMPONENTS, "string");
        // melakukan filter terhadap array hasil aliases (2:24)
        // define property (DefineItem)
        clear_paste(Alias, typeof Alias);
        Alias = Alias.filter((el, index) => {
            for (const $x in el) {
                return el.hasOwnProperty($x);
            }
        });
        // console.log(Alias)
        // membuat fungsi untuk me-replace pre variabel (2:26)
        function preProcess(object_, alias) {
            for (const $text of alias) {
                if (object_.inner.match($text.alias)) {
                    object_.inner = eval(`object_.inner.replace(/\\${$text.alias}/igm,"${$text.value}")`);
                }
                if (object_.child.length > 0) {
                    for (const $child of object_.child) {
                        preProcess($child, alias);
                    }
                }
            }
        }
        // melakukan pe replace an (2:27)
        for (const $components_ of result_compile) {
            preProcess($components_, Alias);
        }
        // ini hasil compile element (writeFile)
        // (getFileText)
        // fs.writeFileSync(__dirname+'/../src/result.js', beautify(convertToText(result_compile), {indent_size: 2, space_in_empty_paren: true}));
        // fungsi ini merupakan fungsi yang akan menghandle untuk
        // mengimport components (2:14)
        function getImport(object) {
            // variabel ini akan menyimpan string dari file .seleku (2:15)
            const all_token = object.split(' ');
            // variabel ini akan berisi lokasi dan string yang akan di import (2:16)
            const location = [];
            // melakukan pengisian (2:17)
            all_token.forEach(($x, index_) => {
                if (/\@import/igm.test($x)) {
                    location.push({ index: index_, token: $x.match(/\@import/igm)[0] });
                }
                if (/\{/igm.test($x) && location.length > 0 && /\@import/igm.test(all_token[index_ - 1])) {
                    location.push({ index: index_, token: $x.match(/\{/igm)[0] });
                }
                if (/\}/igm.test($x) && /\{/igm.test(location[location.length - 1]?.token)) {
                    location.push({ index: index_, token: $x.match(/\}/igm)[0] });
                }
            });
            // variabel ini akan berisi token yang sudah di olah (2:18)
            let result = all_token.slice(location[0]?.index, location[location?.length - 1]?.index + 1)?.join(' ').replace(/\<.*/igm, '').replace(/\#.*/igm, '');
            // membuat token menjadi array (2:19)
            result = result.replace(/\}/igm, '').replace(/(\n|\t|\r)/igm, '').replace(/\,/igm, '{').split('{');
            // variabel ini akan menyimpan hasil akhir (2:20)
            const final_import = [];
            // forEach di bawah ini berfungsi untuk membuat
            // agar bisa mendapatkan error dari sintax (2:21)
            result.forEach((el, index) => {
                if (/\@import/igm.test(el.trim())) {
                    final_import.push(el.match(/\@import.*/)[0]);
                }
                const token = el.split(' ');
                if (token.length === 3 && token[1] === 'as') {
                    final_import.push({
                        alias: token[0],
                        path: token[token.length - 1],
                    });
                }
                else if (!(/\@import/igm.test(el))) {
                    const indexOfError = () => {
                        let position = 0;
                        const all_ = object.split('\n');
                        // console.log(all_)
                        for (let x = 0; x < all_.length; x++) {
                            if (all_[x].match(el)?.length > 0) {
                                position = x;
                                break;
                            }
                        }
                        ;
                        return position;
                    };
                    error({ config: { name: 'syntax', type: 'import' }, message: el, line: indexOfError() + 1, info: `\ttidak dapat mengimport module` });
                }
            });
            return final_import;
        }
        // ini hasil import file (importFile)
        // (getFileText)
        const data = getImport((content) ? content : fs.readFileSync(allPath).toString().replace(/\@import*\{/igm, '@import {'));
        // (2:33)
        let ChildComponent = "";
        // proses pengambilan import component
        for (let $child of data.slice(1, data.length)) {
            if (data[0]?.trim() === "@import") {
                try {
                    const GetImport = new Include({
                        name: $child.alias,
                        path: alias + $child.path.replace(/\"/igm, ""),
                    });
                    let child = new Compiler({ path: "", config: {
                            type: "component",
                            content: GetImport.getSyntax,
                            componentName: $child.alias,
                            lib: [
                                "all",
                            ],
                            // ini ari di ubah (NOTE)
                            globalprop: true
                        } }).compile();
                    ChildComponent += child.js;
                    if (child.globalProps)
                        componentscript += child.globalProps;
                }
                catch (err) {
                    console.log(err.message);
                }
            }
        }
        // membuat lib include (2:29)
        function includeLib() {
            let library = "";
            if (lib instanceof Array) {
                for (let $syntax of lib) {
                    if ($syntax === "all") {
                        for (let $data of ["css.js", "render.js", "react.js", "ecosystem.js"]) {
                            library += fs.readFileSync(__dirname + "/lib/" + $data).toString().replace(/\@binding/igm, (bindingVariabel?.length > 0) ? bindingVariabel : "{}");
                        }
                    }
                    else {
                        library += fs.readFileSync(__dirname + "/lib/" + $syntax).toString();
                    }
                }
            }
            library = library.replace(/\@fileName/igm, name).replace(/\@componentName/igm, `seleku_components_${name}`);
            return library;
        }
        // membuat importer untuk komponent yang di import (2:30)
        if (type === "component")
            return {
                js: beautify(fs.readFileSync(__dirname + "/lib/components_importer.js").toString().
                    replace(/\@prop/igm, (!(globalprop)) ? componentscript : "").
                    replace(/\@aliasImportName/igm, componentName).
                    replace(/\@components/igm, `let seleku_components_${name} = ${convertToText(result_compile)}`).
                    replace(/\@componentName/igm, `seleku_components_${name}`).
                    replace(/\@system/igm, (componentConfig?.length > 0) ? componentConfig : "{target}").
                    replace(/\@binding/igm, (bindingVariabel?.length > 0) ? bindingVariabel : "{}"), { indent_size: 2, space_in_empty_paren: true }),
                globalProps: (globalprop) ? componentscript : ""
            };
        // (2:23)
        let css = StyleHandle(CSS_FROM_COMPONENTS.join("\n"));
        return {
            js: beautify(`let $_context__ = [];$_component__ = [];${ChildComponent} let seleku_components_${name} = ${convertToText(result_compile)}
            let seleku_components_style_${name} = ${JSON.stringify(css)}
            ${includeLib().replace(/\@css_cmpnts/igm, `seleku_components_style_${name}`)}

            let __$_position__ = 0;
            let __$_fromParentsComponents__ = [];

            ${componentscript}

            for(let $components_final of ${name}){

              $components_final.create = ${componentConfig}
              $components_final.$element = $components_final.component.parents;
              $components_final.position = __$_position__;
              if($components_final.$element.nodeName !== "CONFIG") __$_fromParentsComponents__.push($components_final);
              if($components_final.$element.nodeName !== "CONFIG") $_context__.push($components_final.bindingContext = ${bindingVariabel});
            
              if($components_final.$element.nodeName !== "CONFIG") __$_position__++;
            }

            $_component__ = [...$_component__,...__$_fromParentsComponents__];
            ${fs.readFileSync(__dirname + "/lib/context.js").toString().replace(/\@binding/igm, (bindingVariabel?.length > 0) ? bindingVariabel : "{}")}
            `, { indent_size: 2, space_in_empty_paren: true }),
            css: CSS_FROM_COMPONENTS.join(" ")
        };
        // =============================================================
        // ==================== compiler component =====================
        // =============================================================
    }
}
require("fs").writeFileSync(__dirname + "/../src/result.js", new Compiler({ path: "/src/index.seleku", config: {
        alias: __dirname + "/../",
        name: "",
        type: "",
        componentName: "card",
        lib: [
            "all",
            "plus.js"
        ]
    } }).compile().js);
// console.log(data);
// const Include = require('./libseleku');
// const GetImport = new Include({
//   name: 'card',
//   id: '2039rrur23ruhwe',
//   option: {},
//   path: __dirname+'/../src/card.seleku',
// });
// console.log(new Compiler({path: "",config: {
//     type: "component",
//     content:GetImport.getSyntax,
//     componentName: "card",
//     lib: [
//         "all",
//     ],
//     globalprop: false
// }}).compile().js);
