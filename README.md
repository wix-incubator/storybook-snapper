# storybook-snapshot

A utility library originally created as an accompanying tool for [`eyes-storybook`](https://github.com/applitools/eyes-storybook).

The idea is to write snapshot tests as `describe/it` test suites like in familiar testing frameworks. Each test suite creates a `storybook` story, which `eyes-storybook`, in turn, takes a snapshot of.  

This library relies on some of `eyes-storybook`'s methods, however, it does not depend on `eyes-storybook`, which means it can be used just for generating stories.

## Usage
Install with
```bash
npm install --save-dev storybook-snapper
```
or
```bash
yarn add --dev storybook-snapper
```

In your visual/story file:
```jsx harmony
import React from 'react';
import { visualize, story, snap, xsnap } from 'storybook-snapper';
import { MyComponent } from 'path/to/MyComponent';

visualize('MyComponent', () => {
    story('basic story', () => {
        snap('simple render', <MyComponent/>);
        snap('as a function', () => <MyComponent/>);     
    });
    
    story('another story', () => {
        class AsyncStoryWrapper extends React.Component {
            componentDidMount() {
                setTimeout(() => {
                    this.props.onDone();
                }, 3000);
            }
    
            render() {
                return <MyComponent/>;
            }       
        }
        
        snap('async story', done => <AsyncStoryWrapper onDone={done}/>);
    });

    snap('only one level of nesting', <MyComponent/>);

    // when used with eyes-storybook, a snapshot can be ignored with xsnap
    xsnap('ignore this test', <MyComponent/>);
});
```
