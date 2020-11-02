import * as React from 'react';

export declare type RenderFunction = (cb: () => void) => React.ReactNode;
export declare type ChildrenProp = React.ReactNode | RenderFunction;

export interface VisualTestProps {
  children: ChildrenProp;
  timeout: number;
  ignore: boolean;
  dataIgnore: string;
  dataReady: string;
  debug?: boolean;
}

export interface VisualTestState {
  isReady: boolean;
}
