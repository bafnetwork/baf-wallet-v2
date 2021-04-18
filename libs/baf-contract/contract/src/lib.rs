use near_sdk::env::keccak256;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::AccountId;
use near_sdk::{collections::UnorderedMap, env, near_bindgen};

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

type PK = Vec<u8>;
type EdPK = PK;
type SecpPK = PK;

#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct AccountInfo {
    edPK: EdPK,
    accountId: AccountId
}

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct BafContract {
    owner_id: AccountId,
    account_infos: UnorderedMap<SecpPK, AccountInfo>
}

#[near_bindgen]
impl BafContract {
    pub fn new() -> Self {
        let owner_id = env::predecessor_account_id();
        Self { owner_id }
    }

    pub fn set_account_info(&mut self, message: String) {
        // keccak256(value)
        // secp256k1::verify(
        //     message: &Message, 
        //     signature: &Signature, 
        //     pubkey: &PublicKey
        // ) -> bool
        // https://docs.rs/ed25519-dalek/1.0.1/ed25519_dalek/struct.PublicKey.html
    }
    // edPK: PublicKey,
    // edSig: string,
    // secpPK: PublicKey,
    // secpSig: string,
    // newAccountID: string,
    // msg: string

}

#[cfg(not(target_arch = "wasm32"))]
#[cfg(test)]
mod tests {
    use near_sdk::AccountId;
    use std::{thread, time::Duration};

    use near_sdk::MockedBlockchain;
    use near_sdk::{testing_env, VMContext};

    use super::*;

    fn alice() -> AccountId {
        "alice.near".to_string()
    }
    fn bob() -> AccountId {
        "bob.near".to_string()
    }
    fn carol() -> AccountId {
        "carol.near".to_string()
    }
    fn get_context(predecessor_account_id: AccountId) -> VMContext {
        VMContext {
            current_account_id: alice(),
            signer_account_id: bob(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id,
            input: vec![],
            block_index: 0,
            block_timestamp: 0,
            account_balance: 1_000_000_000_000_000_000_000_000_000u128,
            account_locked_balance: 0,
            storage_usage: 10u64.pow(6),
            attached_deposit: 0,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view: false,
            output_data_receivers: vec![],
            epoch_height: 0,
        }
    }

    #[test]
    fn test_update_artist_profile() {
        let context = get_context(carol());
        testing_env!(context);
        let mut contract = BafContract::new();
    }
}
