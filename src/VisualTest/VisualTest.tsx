import * as React from 'react';
import {
  ChildrenProp,
  RenderFunction,
  VisualTestProps,
  VisualTestState,
} from './VisualTest.types';
import {
  DATA_IGNORE_HOOK,
  DATA_READY_HOOK,
  DEFAULT_TIMEOUT,
} from '../constants';

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
    const { isReady } = this.state;
    const { debug } = this.props;
    const style = isReady && debug ? { outline: '1px solid red', display: 'inline-block' } : {};
    return (
      <div {...this._getDataAttrs()} style={style}>
        {this._getContent()}
      </div>
    );
  }
}
