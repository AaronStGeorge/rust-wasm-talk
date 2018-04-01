#![feature(proc_macro)]

extern crate wasm_bindgen;

extern crate catlox;

use wasm_bindgen::prelude::*;

use catlox::interpreter::*;
use catlox::lexer::*;
use catlox::parser::*;
use catlox::resolver::*;

#[wasm_bindgen(module = "./index")] // what ES6 module to import from
extern "C" {
    fn out(s: &str);
    fn err(s: &str);
}

#[wasm_bindgen]
pub struct LoxInterpreter {
    interpreter: Interpreter,
    parse_seed: usize,
}

#[wasm_bindgen]
impl LoxInterpreter {
    pub fn new() -> LoxInterpreter {
        LoxInterpreter {
            interpreter: Interpreter::new(Box::new(|s| out(s))),
            parse_seed: 0,
        }
    }

    pub fn run(&mut self, s: &str) {
        let tokens: Vec<Token> = Lexer::new(s).collect();

        match Parser::new(&tokens, self.parse_seed).parse() {
            Ok((new_parse_seed, statements)) => match resolve(&statements, &mut self.interpreter) {
                Ok(()) => match self.interpreter.interpret(&statements) {
                    Ok(()) => {
                        self.parse_seed = new_parse_seed;
                    }
                    Err(error) => err(&format!("Interpreter Error: {}", error)),
                },
                Err(error) => err(&format!("Resolver Error: {}", error)),
            },
            Err(error) => err(&format!("Parse Error: {}", error)),
        }
    }
}
