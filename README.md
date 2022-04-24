# **Avatar Arena**

## **Description**

This is a simple NFT-based game Dapp. It's features include:

- Mint NFTs to use as battle avatars.
- Allow users list all NFT avatars on the Dapp.
- Allow users list all NFTs avatar they owns on the Dapp.
- Battle avatars you control against other users' NFT avatars. Avatars have equal probability of winning, it's a game of chance.

## **Live Demo**

[Avatar Arena Dapp](https://rinwaowuogba.github.io/avatar-arena)

## **Usage**

### **Requirements**

1. Install the [CeloExtensionWallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh?hl=en) from the Google Chrome Store.
2. Create a wallet and create two accounts in it.
3. Go to [https://celo.org/developers/faucet](https://celo.org/developers/faucet) and get tokens for the alfajores testnet.
4. Switch to the alfajores testnet in the CeloExtensionWallet.

## **Project Setup**

### Install

```
cd avatar-arena
npm install
```

### Start

```
cd avatar-arena
npm start
```

### Build

```
npm run build
```

### **Test**

#### **Automated Contract Tests**

```
cd avatar-arena
npx hardhat test
```

#### **Manual Testing**

1. Open different browser tabs.
2. Mint NFTs with the different accounts on the Celo blockchain (in the Alfajores testnet) in the different tabs.
3. Click the battle button on any NFT you own in the first tab.
4. Click the start battle button on the new page you'll be redirected to.
5. Once the battle has been started successfully on the first tab, repeat steps 3 and 4 on the second tab (with the second account).
6. The battle result is displayed on the second tab and the win count on the NFT avatars change accordingly.
7. To see the result on the first tab, the user has to manually navigate to the battle result page.

## **Some Possible Improvements**

- A way to make influence the winning chances of an avatar by their battle history e.g total previous wins, etc.
- A list of previous battle results could be shown. Currently the Dapp only returns the last battle result.
