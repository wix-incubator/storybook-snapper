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

For testing, use the `applitoolsConfig` method in your `applitools.config.js` file, in order to generate a preconfigured configuration.
This configuration is necessary for async tests to work.

In you `applitools.config.js` file:
```js
const applitoolsConfig = require('storybook-snapper/config/applitools.config');

// optional local configuration file for overrides
let config;

try {
  // for local testing you can add the `apiKey` to your private configuration file
  config = require('./applitools.private.config.js');
} catch (e) {}

// Note that the `appName` property is required
module.exports = applitoolsConfig({config});
```

In your visual/story file:
```jsx
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

    /**
    * when used with eyes-storybook,
    * a snapshot can be ignored with xsnap
    */
    snap.skip('ignore this test', <MyComponent/>);

    /**
    * alias for "snap.skip"
    */
    xsnap('ignore this test', <MyComponent/>);

    /**
    * adds a red outline when a snapshot is taken
    * helpful for debugging async stories
    */
    snap.debug('debug story', done => <AsyncStoryWrapper onDone={done}/>)
});
```
