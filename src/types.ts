import * as React from 'react';

export declare type RenderFunction = (cb: () => void) => React.ReactNode;
export declare type ChildrenProp = React.ReactNode | RenderFunction;

export interface EyesStorybookOptions {
  ignore?: boolean;
  waitBeforeScreenshot?: string | number;
}

export interface SnapperConfiguration {
  dataIgnoreAttr?: string;
  dataReadyAttr?: string;
}

export interface VisualTestProps {
  children: ChildrenProp;
  timeout?: number;
  ignore?: boolean;
  dataIgnore?: string;
  dataReady?: string;
  testName: string;
}

export interface VisualTestState {
  isReady: boolean;
}
