const js = import("./rust_wasm_talk");

export function out(s) {
  console.log(s);
}

export function err(s) {
  console.error(s);
}

function main(js) {
  window.loxInterpreter = js.LoxInterpreter.new();
}

js.then(main);
