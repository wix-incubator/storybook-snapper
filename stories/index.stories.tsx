import React from 'react';
import { visualize, story, snap } from '../src';

interface ExampleComponentProps {
  onDone?(): void;
}

interface ExampleComponentState {
  isReady: boolean;
  counter: number;
}

class ExampleComponent extends React.Component<
  ExampleComponentProps,
  ExampleComponentState
> {
  private _timeoutId: NodeJS.Timeout;

  state = {
    isReady: typeof this.props.onDone !== 'function',
    counter: 0,
  };

  componentDidMount(): void {
    const { isReady } = this.state;

    if (!isReady) {
      this._timeoutId = setInterval(() => {
        this.setState({ counter: this.state.counter + 1 });
      }, 1000);
    }
  }

  componentDidUpdate(): void {
    const { counter, isReady } = this.state;
    const { onDone } = this.props;

    if (!isReady && counter === 5) {
      clearInterval(this._timeoutId);
      this.setState({ isReady: true }, onDone);
    }
  }

  componentWillUnmount(): void {
    clearInterval(this._timeoutId);
  }

  _getStyle() {
    const { isReady } = this.state;
    const style: any = {
      width: 60,
      height: 60,
      fontSize: 24,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderStyle: 'solid',
      borderRadius: 5,
      borderColor: '#29bf29',
    };

    if (!isReady) {
      style.borderColor = 'red';
    }

    return style;
  }

  render() {
    const { isReady, counter } = this.state;

    return (
      <div style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
        <h3>Story is {isReady ? 'Ready' : 'Waiting'}</h3>
        <div style={this._getStyle()}>👍</div>
        {!isReady ? <p>Ready in {5 - counter}s</p> : null}
      </div>
    );
  }
}

visualize('storybook-snapper', () => {
  story('Basic', () => {
    snap('sync example', () => <ExampleComponent />);
    snap('async example', done => <ExampleComponent onDone={done} />);
  });
});
