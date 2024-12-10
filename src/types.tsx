export type Ip = {
  netId: string;
  firstHost: string;
  lastHost: string;
  gateway: string;
  broadcast: string;
  subnetMask: string;
  bits?: number;
};