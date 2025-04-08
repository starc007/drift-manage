"use client";

import { useAppStore } from "@/store";
import {
  BulkAccountLoader,
  DriftClient,
  DriftClientConfig,
  getMarketsAndOraclesForSubscription,
  IWallet,
  DRIFT_PROGRAM_ID,
  DriftEnv,
} from "@drift-labs/sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

class DriftService {
  private CLUSTER: DriftEnv = "mainnet-beta";

  initialize(connection: Connection, walletPubKey?: string): DriftClient {
    const dummyWallet = this.createThrowawayIWallet(
      walletPubKey ? new PublicKey(walletPubKey) : undefined
    );
    const accountLoader = new BulkAccountLoader(connection, "finalized", 0); // we don't want to poll for updates

    const { oracleInfos, perpMarketIndexes, spotMarketIndexes } =
      getMarketsAndOraclesForSubscription(this.CLUSTER);
    const driftClientConfig: DriftClientConfig = {
      connection: connection,
      wallet: dummyWallet,
      programID: new PublicKey(DRIFT_PROGRAM_ID),
      env: this.CLUSTER,
      txVersion: 0,
      userStats: false,
      perpMarketIndexes: perpMarketIndexes,
      spotMarketIndexes: spotMarketIndexes,
      oracleInfos: oracleInfos,
      accountSubscription: {
        type: "polling",
        accountLoader: accountLoader,
      },
    };

    const driftClient = new DriftClient(driftClientConfig);
    return driftClient;
  }

  createThrowawayIWallet(walletPubKey?: PublicKey) {
    const newKeypair = walletPubKey
      ? new Keypair({
          publicKey: walletPubKey.toBytes(),
          secretKey: new Keypair().publicKey.toBytes(),
        })
      : new Keypair();

    const newWallet: IWallet = {
      publicKey: newKeypair.publicKey,
      //@ts-ignore
      signTransaction: () => {
        return Promise.resolve();
      },
      //@ts-ignore
      signAllTransactions: () => {
        return Promise.resolve();
      },
    };

    return newWallet;
  }
}

const driftService = new DriftService();
export { driftService };
