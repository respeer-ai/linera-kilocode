export const lineraStateTemplate = `use linera_sdk::views::{linera_views, RegisterView, RootView, ViewStorageContext};

#[derive(RootView)]
#[view(context = ViewStorageContext)]
pub struct CounterState {
    pub value: RegisterView<u64>,
}`
