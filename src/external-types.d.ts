import * as React from 'react';

declare type RenderFunction = (cb: () => void) => React.ReactNode;
declare type ChildrenProp = React.ReactNode | RenderFunction;
