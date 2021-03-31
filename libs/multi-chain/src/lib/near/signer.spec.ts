import { NearSigner } from './signer';
describe('near signer class', () => {
  it('create an implicit key successfully', () => {
    const pk58 = 'ed25519:BGCCDDHfysuuVnaNVtEhhqeT4k9Muyem3Kpgq2U1m9HX';
    const ret = NearSigner.getImplicitAccountId(pk58);
    expect(ret).toEqual(
      '98793cd91a3f870fb126f66285808c7e094afcfc4eda8a970f6648cdf0dbd6de'
    );
  });
});
