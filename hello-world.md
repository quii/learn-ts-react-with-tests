# Hello, world

It's traditional to start any learning endeavour in software development with "Hello, world"

## Getting started

TODO: Explain this more

You'll need the node world with nvm, node, yarn, etc etc installed and sorted out. 

Run `yarn create react-app hello-world --typescript`

This will use [create-react-app](https://facebook.github.io/create-react-app) which is sets us up with a myriad of tooling to explore the React world with TypeScript. It's fantastic for learning and prototyping. 

You should have a folder called `hello-world`, `cd` into it and run `yarn test`. You should get some options as to what tests you want to run, quitting the program etc, press `a` to run all the tests as directed.

Open up a new tab in your terminal and run `yarn start`. This should open up a tab in your browser and show a simple page inviting you to edit `src/App.tsx`.

Let's remove the crufty code it has given us to get to a more barebones state

```jsx
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <p>Hello, world</p>
    );
  }
}

export default App;
```

When you use react you create _components_ which you combine together to create web applications. `create-react-app`'s convention is you need an `App` component which is used to render the web page.

When you save the file the browser should automatically update itself and your tests should re-run. This is a very fast and pleasant feedback loop. Go to `App.css` and delete all the contents, we're not interested in making things pretty right now. 

We saw that `create-react-app` created some kind of test for us so let's open `App.test.tsx` and take a look.

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

This kind of test is described as a [smoke test](https://en.wikipedia.org/wiki/Smoke_testing_(software)). In software these are tests which are typically very low on detail, are simple to write and quick to run; they're just there to make sure nothing is on fire. In this particular case we're just checking our `App` component renders. 

It would be good to see this test fail to illustrate that, so go back to `App.tsx` and make our `App` component throw an error when `render` is called.

```tsx
class App extends Component {
  render() {
    throw new Error("oh dear");
    return (
      <p>Hello, world</p>
    );
  }
}
```

When you save the file your web browser will show a stack trace starting from the error we threw and our test should fail.

Remove the error and everything should be quickly back to passing tests and a working web page, right before your eyes.

Now that we're a bit comfortable with this we can now TDD some new functionality. We'd like to make a form where you can type the name of the person you want to greet and it'll send it back to you. 

## Write the test first

There's a few ways we could tackle this. The first thing i'd like to do is assert that our `App` component includes some kind of as of yet non-existent `HelloWorld` component. We dont want `App` being responsible for our business logic, we just want it to assemble our components ready for the user. This will then let us separately test and create our super useful `HelloWorld` component. 


```tsx
class HelloWorld extends Component {
  render() {
    return (
      <p>Hello, world</p>
    )
  }
}
```