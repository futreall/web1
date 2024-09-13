export const ARBITRUM_RETRYABLE_TX_ABI = [
  { inputs: [], name: 'NoTicketWithID', type: 'error' },
  { inputs: [], name: 'NotCallable', type: 'error' },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'Canceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'ticketId', type: 'bytes32' },
      { indexed: false, internalType: 'uint256', name: 'newTimeout', type: 'uint256' },
    ],
    name: 'LifetimeExtended',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'ticketId', type: 'bytes32' },
      { indexed: true, internalType: 'bytes32', name: 'retryTxHash', type: 'bytes32' },
      { indexed: true, internalType: 'uint64', name: 'sequenceNum', type: 'uint64' },
      { indexed: false, internalType: 'uint64', name: 'donatedGas', type: 'uint64' },
      { indexed: false, internalType: 'address', name: 'gasDonor', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'maxRefund', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'submissionFeeRefund', type: 'uint256' },
    ],
    name: 'RedeemScheduled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'bytes32', name: 'userTxHash', type: 'bytes32' }],
    name: 'Redeemed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'TicketCreated',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'getBeneficiary',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentRedeemer',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLifetime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'getTimeout',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'keepalive',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ticketId', type: 'bytes32' }],
    name: 'redeem',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'requestId', type: 'bytes32' },
      { internalType: 'uint256', name: 'l1BaseFee', type: 'uint256' },
      { internalType: 'uint256', name: 'deposit', type: 'uint256' },
      { internalType: 'uint256', name: 'callvalue', type: 'uint256' },
      { internalType: 'uint256', name: 'gasFeeCap', type: 'uint256' },
      { internalType: 'uint64', name: 'gasLimit', type: 'uint64' },
      { internalType: 'uint256', name: 'maxSubmissionFee', type: 'uint256' },
      { internalType: 'address', name: 'feeRefundAddress', type: 'address' },
      { internalType: 'address', name: 'beneficiary', type: 'address' },
      { internalType: 'address', name: 'retryTo', type: 'address' },
      { internalType: 'bytes', name: 'retryData', type: 'bytes' },
    ],
    name: 'submitRetryable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
