#!/bin/sh
near dev-deploy target/wasm32-unknown-unknown/release/baf_wallet_pk_helper.wasm
near call dev-1619398846158-6592600 new --accountId=levtester.testnet
