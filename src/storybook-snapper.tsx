import * as React from 'react';
import * as Storybook from '@storybook/react';
import { DATA_IGNORE_HOOK, DATA_READY_HOOK } from './hooks';

const { storiesOf } = Storybook;

export declare type RenderFunction = (cb: () => void) => React.ReactNode;
export declare type ChildrenProp = React.ReactNode | RenderFunction;

interface VisualTestProps {
  children: ChildrenProp;
  timeout: number;
  ignore: boolean;
  dataIgnore: string;
  dataReady: string;
}

interface VisualTestState {
  isReady: boolean;
}

interface RunBeforeArgs {
  rootEl: any;
  story: any;
}

type RunBefore = (runBeforeArgs: RunBeforeArgs) => Promise<void>;

interface EyesStorybookOptions {
  ignore?: boolean;
  waitBeforeScreenshot?: string | number;
  runBefore?: RunBefore;
}

function functionUsesArgs(fn: Function) {
  return fn.length > 0;
}

class VisualTest extends React.Component<VisualTestProps, VisualTestState> {
  private _timeoutId: NodeJS.Timeout;

  static defaultProps = {
    children: null,
    timeout: 5000,
    ignore: false,
  };

  state = {
    isReady: !VisualTest.isAsync(this.props),
  };

  static isAsync({ children }: { children: ChildrenProp }) {
    return typeof children === 'function'
      ? functionUsesArgs(children as RenderFunction)
      : false;
  }

  componentDidMount(): void {
    const { isReady } = this.state;

    if (!isReady) {
      this._timeoutId = setTimeout(this._done, this.props.timeout);
    }
  }

  _done = () => {
    clearTimeout(this._timeoutId);
    this.setState({ isReady: true });
  };

  _getContent = () => {
    const { children } = this.props;

    return typeof children === 'function'
      ? (children as RenderFunction)(this._done)
      : children;
  };

  _getDataAttrs() {
    const { isReady } = this.state;
    const { ignore, dataIgnore, dataReady } = this.props;

    return {
      [dataIgnore || DATA_IGNORE_HOOK]: ignore,
      [dataReady || DATA_READY_HOOK]: isReady,
    };
  }

  render() {
    return <div {...this._getDataAttrs()}>{this._getContent()}</div>;
  }
}

interface SnapperConfiguration {
  dataIgnoreAttr?: string;
  dataReadyAttr?: string;
}
const configuration: SnapperConfiguration = {
  dataIgnoreAttr: '',
  dataReadyAttr: '',
};
let currentTest = [];

export function config({
  dataIgnoreAttr,
  dataReadyAttr,
}: SnapperConfiguration) {
  configuration.dataIgnoreAttr = dataIgnoreAttr || configuration.dataIgnoreAttr;
  configuration.dataReadyAttr = dataReadyAttr || configuration.dataReadyAttr;
}

export function visualize(visualName, tests) {
  if (currentTest.length) {
    throw new Error("Previous test didn't end as expected!");
  }

  if (!visualName) {
    throw new Error('Must have a test name');
  }

  currentTest.push(visualName);

  try {
    tests();
  } catch (e) {}

  currentTest = [];
}

export function story(storyName, cb) {
  currentTest.push(storyName);

  try {
    cb();
  } catch (e) {}

  currentTest.pop();
}

function runSnap(
  snapshotName: string,
  cb: ChildrenProp,
  runBefore?: RunBefore,
  ignore?: boolean,
) {
  const eyesStorybookOptions: EyesStorybookOptions = {
    runBefore,
  };
  const fullStoryName = [...currentTest].join('/');

  if (typeof cb === 'function' && functionUsesArgs(cb)) {
    eyesStorybookOptions.waitBeforeScreenshot = `[${DATA_READY_HOOK}="true"]`;
  }

  if (ignore) {
    (eyesStorybookOptions as any).ignore = [
      { selector: `[${configuration.dataIgnoreAttr}="true"]` },
    ];
  }

  storiesOf(fullStoryName, module).add(
    snapshotName,
    () => (
      <VisualTest
        ignore={ignore}
        dataIgnore={configuration.dataIgnoreAttr}
        dataReady={configuration.dataReadyAttr}
      >
        {cb}
      </VisualTest>
    ),
    {
      eyes: eyesStorybookOptions,
    },
  );
}

export function snap(snapshotName: string, cb: ChildrenProp, rb?: RunBefore) {
  runSnap(snapshotName, cb, rb);
}

export function xsnap(snapshotName: string, cb: ChildrenProp, rb?: RunBefore) {
  runSnap(snapshotName, cb, rb, true);
}
