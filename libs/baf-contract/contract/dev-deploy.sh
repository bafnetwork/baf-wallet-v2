#!/bin/sh
near dev-deploy target/wasm32-unknown-unknown/release/baf_contract.wasm
near call dev-1618865804202-6966963 new --accountId=levtester.testnet