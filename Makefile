build:
	cargo +nightly build --target wasm32-unknown-unknown --release
	wasm-gc target/wasm32-unknown-unknown/release/rust_wasm_talk.wasm
	wasm-bindgen target/wasm32-unknown-unknown/release/rust_wasm_talk.wasm --out-dir .

serve:
	npm run serve
