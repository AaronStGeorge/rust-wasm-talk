#![feature(proc_macro)]

extern crate wasm_bindgen;

extern crate catlox;

use wasm_bindgen::prelude::*;

use catlox::lexer::*;

// Strings can both be passed in and received
#[wasm_bindgen]
#[no_mangle]
pub extern "C" fn lexer(a: &str) -> String {
    Lexer::new(a).fold("".to_string(), |mut i, j| {
        i.push_str(&format!("{:?}\n", j));
        i
    })
}
