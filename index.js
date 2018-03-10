const js = import("./rust_wasm_talk");

function main(js) {
  window.lex = (input) => {
    console.log(js.lexer(input));
  }
}

js.then(main);
