#![feature(proc_macro)]

extern crate wasm_bindgen;

extern crate catlox;

use wasm_bindgen::prelude::*;

use catlox::lexer::*;
use catlox::parser::*;
use catlox::interpreter::*;
use catlox::resolver::*;

#[wasm_bindgen(module = "./index")] // what ES6 module to import from
extern "C" {
    fn out(s: &str);
    fn err(s: &str);
}

#[wasm_bindgen]
pub struct LoxInterpreter {
    interpreter: Interpreter,
}

#[wasm_bindgen]
impl LoxInterpreter {
    pub fn new() -> LoxInterpreter {
        LoxInterpreter {
            interpreter: Interpreter::new(Box::new(|s| out(s))),
        }
    }

    pub fn run(&mut self, s: &str) {
        let tokens: Vec<Token> = Lexer::new(s).collect();

        match Parser::new(&tokens).parse() {
            Ok(statements) => match resolve(&statements, &mut self.interpreter) {
                Ok(()) => self.interpreter.interpret(&statements),
                Err(error) => err(&format!("Resolver Error: {}", error)),
            },
            Err(error) => err(&format!("Parse Error: {}", error)),
        }
    }
}
