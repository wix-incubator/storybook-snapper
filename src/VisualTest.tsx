import * as React from 'react';
import { DATA_IGNORE_HOOK, DATA_READY_HOOK } from './hooks';
import {
  ChildrenProp,
  RenderFunction,
  VisualTestProps,
  VisualTestState,
} from './types';

export const DEFAULT_TIMEOUT = 25000;

export class VisualTest extends React.Component<
  VisualTestProps,
  VisualTestState
> {
  private _timeoutId: NodeJS.Timeout;

  static defaultProps = {
    children: null,
    timeout: DEFAULT_TIMEOUT,
    ignore: false,
  };

  state = {
    isReady: !VisualTest.isAsync(this.props),
  };

  static isAsync({ children }: { children: ChildrenProp }) {
    return typeof children === 'function'
      ? (children as RenderFunction).length > 0
      : false;
  }

  componentDidMount(): void {
    const { isReady } = this.state;
    const { timeout } = this.props;

    if (!isReady) {
      this._timeoutId = setTimeout(this._warnAndDone, timeout);
    }
  }

  _warnAndDone = () => {
    const { testName, timeout } = this.props;
    console.warn(`[storybook-snapper]: Visual test ${testName} has reached its maximum timeout of ${timeout}ms
    You probably need to call the \`done\` function to end the test.
    If you don't need an async test, then you should probably remove the \'done\' argument from the \`snap\` callback`);
    this._done();
  };

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
