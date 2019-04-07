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

```typescript
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

```typescript
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

```typescript
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

There's a few ways we could tackle this. The first thing i'd like to do is assert that our `App` component includes some kind of as of yet non-existent `HelloWorld` component. 

We dont want `App` being responsible for our business logic, we just want it to assemble our components ready for the user. This will then let us separately test and create our super useful `HelloWorld` component.

_Shallow rendering_ allows us to assert a component renders other components.

We will need enzyme to let us do this

`yarn add enzyme enzyme-adapter-react-16 react-test-renderer`

To get type help we need to also do

`yarn add @types/enzyme`
`yarn add @types/enzyme-adapter-react-16`

This means the TS compiler can verify we are using enzyme correctly. We should strive to have these kind of dependencies when we are working with other libraries so we can use them safely and get lots of help from our IDE.  

Let's write our test to assert it renders an imaginary HelloWorld component. 

```typescript
it('renders a hello world component inside the app', () => {
  const app = shallow(<App />);
  expect(app.contains(<HelloWorld/>)).toEqual(true);
})
```

## Try to run the test

```
ReferenceError: HelloWorld is not defined
```

It shouldn't compile as `HelloWorld` doesn't exist yet. This may feel weird to you!

### Why do we do this?

- We want to use the compiler to tell us what code we need to write, _driven from our tests_; not from our imagination

## Write the minimal amount of code for the test to run and check the failing test output

Now we can create the minimal component to get started, just put it in the test file for now

```typescript
class HelloWorld extends Component {}
```

If you try again the test should _compile_ not not pass

```
Error: expect(received).toEqual(expected)

Expected value to equal:
  true
Received:
  false
Expected :true
Actual   :false
<Click to see difference>
```

Note: This test output actually sucks, true was not equal to false? What does that mean? It'll have to do for now.

## Write enough code to make it pass

Extract the component into `HelloWorld.tsx` and then use it within `App.tsx`

```typescript
import React, { Component } from 'react';
import './App.css';
import {HelloWorld} from "./HelloWorld";

class App extends Component {
  render() {
    return (
      <HelloWorld />
    );
  }
}

export default App;
```

If you re-run the test it should pass.

## Refactor

Normally we would do some refactoring but there doesn't seem to be a lot to improve at this point. 

We can be happy that our application is correctly wired up and we can now work on our `HelloWorld` component.

## Write the test first

We'll create a new test file for our component `HelloWorld.test.tsx` and then demand it renders a default `Hello, World!` title to the user when the component is first made.

```typescript
it('renders a default hello message on creation', () => {
    const hw = shallow(<HelloWorld />)
    const msg = <h1>Hello, world</h1>;
    expect(hw.contains(msg)).toEqual(true)
})
```

## Try to run the test

`TypeError: this._instance.render is not a function`

We have not got a `render` function on our component to render the `h1`

## Write enough code to make it pass

```typescript
import React, {Component} from "react";

export class HelloWorld extends Component {
    render() {
        return (
            <h1>Hello, world</h1>
        )
    }
}
```

## Write the test first

Next we want to make it so if someone enters a name into a textbox that we greet them.

Whilst enzyme is good for checking that components render other components we want to do more of a deep-dive when testing our component, simulating dom manipulation etc. So we'll add yet another testing library! 

`$ yarn add react-testing-library jest-dom`

And dont forget our TS bindings

`$ yarn add @types/react-test-renderer`

Here's what our new test looks like

```typescript
import {configure, mount, shallow} from "enzyme";
import {HelloWorld} from "./HelloWorld";
import React from 'react'
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

// old test omitted ...

it('greets someone', () => {
    const wrapper = mount(<HelloWorld/>)

    wrapper.find('input')
        .simulate('change', {target: {value: 'Pepper'}})

    expect(wrapper.find('h1').text()).toEqual('Hello, Pepper');
})
```

We are "mounting" our component so that we can test it. We then simulate a dom change to an input box to send the name "Pepper" to it. Afterward we expect a `h1` with the greeting.

## Try to run the test

We have been working with some imaginary markup so the test fails when we run it

`Error: Method “simulate” is meant to be run on 1 node. 0 found instead.`

## Write the minimal amount of code for the test to run and check the failing test output

Let's update the markup to include a text input to make more progress

```typescript
return (
    <>
        <input type="text"/>
        <h1>Hello, world</h1>
    </>
)
```

Run the tests again and you should see a nicer failure

```
Expected value to equal:
  "Hello, Pepper"
Received:
  "Hello, world"
Expected :Hello, Pepper
Actual   :Hello, world
```

## Write enough code to make it pass

```typescript
export class HelloWorld extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {name: "world"}
    }

    render() {
        return (
            <>
                <input
                    type="text"
                    onChange={data => {
                        return this.setState({name: data.target.value});
                    }}
                />
                <h1>Hello, {this.state.name}</h1>
            </>
        )
    }
}
```

Oof, a lot to unpack.

### `constructor`, `props`, and `state`

Our component has _state_ because it needs to keep track of who to greet. In order to set the state we override the constructor so when the component is first made we set the `name` to equal `world` (so "Hello, world")

React components have the concept of `props`. Props are properties that are passed down to the component from the parent component. So hypothetically you could do 

`<HelloWorld name="Clive" />`

As we are introducing a constructor we have to make sure we call the `super` function of the class we are extending (`React.Component`) so we need to pass `props` through

### `onChange` and the greeting

We add an event handler to our `input` so that as keys are pressed we call `setState`, setting `state.name` with the value of the keys pressed. Calling `setState` on a React component will cause it to call `render` again if the state has changed.

Our `h1` will always print the value of `state.name`, so as `setState` is called it will update itself to match whatever is in the state.

The test should now pass.

## Refactor

This is _ok_, but it's not very typesafe. If you have a well configured editor/IDE you may have some errors or warnings appearing even though the tests are passing.

![Compilation problems](https://i.imgur.com/lvGnMwZ.png)

The problem we have is our state doesn't have a well defined type. We _know_ it only ever holds a `name` field but it's not documented in our code. Someone can hypothetically make a typo typing `name` and introduce bugs. Plus our autocomplete does not work. 

What we can do is more strictly define the type of our shape when we define our component

```typescript
export class HelloWorld extends React.Component<any, {name: string}>
```

The angled brackets mean that `React.Component` uses _generics_ so that we can optionally define the type of the component more narrowly. The first type `any` is for the "props" that we mentioned earlier. Our component doesn't use props so we dont care about it. The second syntax `{name: string}` is us defining our _interface_ for our state to have one field called name of type `string`.

## Refactor II

Having to override the constructor just to set a default state doesn't feel right, although it was interesting to look at props. What we should do is change the way we model our component state to model the idea that the name is nullable. We can then just check if it's null and set it to world when neccessary

```typescript
export class HelloWorld extends React.Component<any, { name?: string }> {

    render() {
        const name = this.state != null ? this.state.name : "world";
        return (
            <>
                <input
                    type="text"
                    onChange={data => {
                        return this.setState({name: data.target.value});
                    }}
                />
                <h1>Hello, {name}</h1>
            </>
        )
    }
}
```

The syntax for declaring a nullable type is shown in the declaration, you put a `?` on the field name. We then use the ternary operator at the start of render to calculate the `name` to greet.

## Refactor III

We hate nulls! It's the billion dollar mistake! There must be a more elegant way of modelling this and thankfully there is

```typescript
const initialHelloState = {name: "world"}
type HelloState = Readonly<typeof initialHelloState>

export class HelloWorld extends React.Component<any, HelloState> {

    readonly state: HelloState = initialHelloState;

    render() {
        return (
            <>
                <input
                    type="text"
                    onChange={data => {
                        return this.setState({name: data.target.value});
                    }}
                />
                <h1>Hello, {this.state.name}</h1>
            </>
        )
    }
}
```

- `initialHelloState` describes how we want our initial default state to be. It's not hidden in a ternary operator inside the `render` method. This alone is an improvement from before!
- An interesting feature of Typescript is you can derive types from data structures rather than always having to define them upfront. So `type HelloState = Readonly<typeof initialHelloState>` defines our type for our state which we then use when we define our `HelloWorld` component.
- The `state` field in a React component is read-only for very good reasons. You should only try to change state via `setState` which will then kick off the component cycle for you (such as `render`). What we are doing with `readonly state: HelloState = initialHelloState;` is making sure from our TS code's perspective that state is readonly and that it's initial value is the one we want.
- Now in `render` we can reliably read `this.state.name` and not have our code cluttered with null checks.
