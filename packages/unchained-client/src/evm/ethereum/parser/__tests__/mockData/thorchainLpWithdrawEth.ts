import type { Tx } from '../../../index'

const tx: Tx = {
  txid: '0x0a57839f87a8abc586542c9a7f7e7e4d7d50a8bd1c680ae0c2963f6dc8185c52',
  blockHash: '0x96b503a8e6e1a0efb66af68aff122b2d1cbb01cbeab17b334cee023f4afa70be',
  blockHeight: 19073390,
  timestamp: 1706061683,
  status: 1,
  from: '0xAA07f696a5Eb1C3195B353625be29737419931aD',
  to: '0xD37BbE5744D730a1d98d8DC97c42F0Ca46aD7146',
  confirmations: 6053,
  value: '10000000000',
  fee: '399840572408478',
  gasLimit: '64746',
  gasUsed: '38197',
  gasPrice: '10467852774',
  inputData:
    '0x44bc937b00000000000000000000000064fc77c58122a7fb66659dc4d54d8cbb35eaff3b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002540be40000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000065b072de000000000000000000000000000000000000000000000000000000000000000f2d3a4554482e4554483a31303030300000000000000000000000000000000000',
  internalTxs: [
    {
      from: '0xD37BbE5744D730a1d98d8DC97c42F0Ca46aD7146',
      to: '0x64Fc77C58122a7fb66659Dc4D54d8CBb35EafF3b',
      value: '10000000000',
    },
  ],
}

export default { tx }