interface Wallet {
  id?: number;
  name: string;
  description?: string;
  amount: number;
}
interface WalletStat {
  id: number;
  name: string;
  percentage: number;
}

export { Wallet, WalletStat };
