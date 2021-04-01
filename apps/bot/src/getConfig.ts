// TODO: eventually add a contract?
// const CONTRACT_NAME = process.env.CONTRACT_NAME ?? 'default'

export default function getConfig(env: string): any {
  const keyPath = process.env.KEY_PATH ?? '.';
  switch (env) {
    // when running on server, use a
    case 'development':
    case 'production':
    case 'testnet':
      return {
        networkId: 'local',
        nodeUrl: 'http://localhost:3030',
        keyPath: keyPath,
        // contractName: CONTRACT_NAME
      };
    default:
      throw Error(
        `Unconfigured environment '${env}'. Can be configured in .env`
      );
  }
}
