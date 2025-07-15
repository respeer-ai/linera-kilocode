export const lineraCargoTemplate = `[package]
name = "counter"
version = "0.1.0"
edition = "2021"

[dependencies]
async-graphql = { version = "=7.0.16", default-features = false }
futures = "0.3.24"
linera-sdk = { version = "0.14.1" }
linera-views = { version = "0.14.1", default-features = false }
serde_json = "1.0.93"

[target.'cfg(not(target_arch = "wasm32"))'.dev-dependencies]
linera-sdk = { version = "0.14.1", features = ["test", "wasmer"] }
tokio = { version = "1.25.0", features = ["rt", "sync"] }

[dev-dependencies]
assert_matches = "1.5.0"
linera-sdk = { version = "0.14.1", features = ["test"] }

[[bin]]
name = "counter_contract"
path = "src/contract.rs"

[[bin]]
name = "counter_service"
path = "src/service.rs"`
