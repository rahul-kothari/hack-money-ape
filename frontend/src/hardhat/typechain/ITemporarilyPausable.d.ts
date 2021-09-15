/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface ITemporarilyPausableInterface extends ethers.utils.Interface {
  functions: {
    "getPausedState()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getPausedState",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "getPausedState",
    data: BytesLike
  ): Result;

  events: {
    "PausedStateChanged(bool)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "PausedStateChanged"): EventFragment;
}

export type PausedStateChangedEvent = TypedEvent<
  [boolean] & { paused: boolean }
>;

export class ITemporarilyPausable extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: ITemporarilyPausableInterface;

  functions: {
    getPausedState(
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        paused: boolean;
        pauseWindowEndTime: BigNumber;
        bufferPeriodEndTime: BigNumber;
      }
    >;
  };

  getPausedState(
    overrides?: CallOverrides
  ): Promise<
    [boolean, BigNumber, BigNumber] & {
      paused: boolean;
      pauseWindowEndTime: BigNumber;
      bufferPeriodEndTime: BigNumber;
    }
  >;

  callStatic: {
    getPausedState(
      overrides?: CallOverrides
    ): Promise<
      [boolean, BigNumber, BigNumber] & {
        paused: boolean;
        pauseWindowEndTime: BigNumber;
        bufferPeriodEndTime: BigNumber;
      }
    >;
  };

  filters: {
    "PausedStateChanged(bool)"(
      paused?: null
    ): TypedEventFilter<[boolean], { paused: boolean }>;

    PausedStateChanged(
      paused?: null
    ): TypedEventFilter<[boolean], { paused: boolean }>;
  };

  estimateGas: {
    getPausedState(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getPausedState(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
