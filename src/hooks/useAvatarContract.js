import { useContract } from "./useContract";
import AvatarArenaAbi from "../contracts/AvatarArena.json";
import AvatarArenaContractAddress from "../contracts/AvatarArena-address.json";

export const useArenaContract = () =>
  useContract(AvatarArenaAbi.abi, AvatarArenaContractAddress.AvatarArena);
