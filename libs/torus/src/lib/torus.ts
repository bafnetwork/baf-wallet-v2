import * as FetchNodeDetails from '@toruslabs/fetch-node-details';
import * as TorusUtils from '@toruslabs/torus.js';

// TODO:!!!!
const fetchNodeDetails = new FetchNodeDetails({
  network: 'testnet'
});
const torus = new TorusUtils();

async function getDiscordPublicAddress() {
  const verifier = 'google';
  const verifierId = 'hello@tor.us';
  const {
    torusNodeEndpoints,
    torusNodePub,
    torusIndexes,
  } = await fetchNodeDetails.getNodeDetails();
  const publicAddress = await torus.getPublicAddress(
    torusNodeEndpoints,
    torusNodePub,
    { verifier, verifierId },
    false
  );

}
