export const lineraProjectTreeTemplate = `
.
└── project_name
    ├── Cargo.toml
    ├── rust-toolchain.toml
    ├── README.md
    ├── src
    │   ├── contract.rs
    │   ├── lib.rs
    │   ├── service.rs
    │   └── state.rs
    ├── tests
    │   └── single_chain.rs
    └── web-frontend
        ├── package.json
        ├── public
        │   ├── favicon.ico
        │   └── index.html
        ├── README.md
        ├── src
        │   ├── App.css
        │   ├── App.js
        │   ├── GraphQLProvider.js
        │   ├── index.css
        │   └── index.js
        └── tailwind.config.js
`
