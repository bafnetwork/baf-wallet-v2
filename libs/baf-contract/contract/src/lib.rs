use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env::keccak256;
use near_sdk::AccountId;
use near_sdk::{collections::UnorderedMap, env, near_bindgen};
use ed25519_dalek::Verifier;
use std::convert::TryInto;

#[global_allocator]
static ALLOC: near_sdk::wee_alloc::WeeAlloc = near_sdk::wee_alloc::WeeAlloc::INIT;

type EdPK = [u8; 64];
type SecpPK = [u8; 65];

#[derive(BorshDeserialize, BorshSerialize)]
pub struct AccountInfo {
    ed_pk: EdPK,
    accountId: AccountId,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct BafContract {
    owner_id: AccountId,
    account_infos: UnorderedMap<SecpPK, AccountInfo>,
}

#[near_bindgen]
impl BafContract {
    pub fn new() -> Self {
        let owner_id = env::predecessor_account_id();
        Self {
            owner_id,
            account_infos: UnorderedMap::new("account-infos-map".as_bytes()),
        }
    }

    pub fn set_account_info(
        &mut self,
        userId: String,
        nonce: String,
        edPK: EdPK,
        secpPK: SecpPK,
        edSig: [u8; 64],
        secpSig: [u8; 64],
        newAccountID: AccountId,
    ) -> Result<(), &str> {
        let msg_prehash = format!("{}:{}", userId, nonce).as_bytes();
        let hash: [u8; 32] = keccak256(msg_prehash).try_into().unwrap();
        if !secp256k1::verify(
            &secp256k1::Message::parse(&hash),
            &secp256k1::Signature::parse(&secpSig),
            // TODO: clean up
            &secp256k1::PublicKey::parse(&secpPK).unwrap(),
        ) {
            return Err("");
        }
        let ed_pk_dalek = ed25519_dalek::PublicKey::from_bytes(&edPK).unwrap();
        // TODO: handle fail
        ed_pk_dalek.verify(&hash, &ed25519_dalek::Signature::new(edSig)).unwrap();

        self.account_infos.insert(&secpPK, &AccountInfo {
            ed_pk: edPK,
            accountId: newAccountID
        });
        Ok(())
    }
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
