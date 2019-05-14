# Redux

Redux isn't _that_ complicated but can be a bit much if you try to learn how to make it work with react at the same time. 

In this chapter we will learn Redux as a standalone way of managing state, guided with tests. This way you'll learn the important concepts that Redux facilitates managing state. Once you're comfortable with these concepts integrating them into your react application will be easier

## Setup

Even though we dont need React for this exercise we'll use create-react-app to get ourselves started as it's a simple way to get going

Run `yarn create react-app Redux --typescript`, cd into `Redux` and then do `yarn add Redux`

Remove all the files inside `/src` and then add `Redux.spec.tsx` and add the following

```typescript
test('hello', () => {
    expect("hello").toEqual("hello")
})
```

- Run the test through your IDE or with `yarn test` and you should have a simple passing test

## What to build? 

We're going to build a manuscript tracking system and Redux is going to manage the state for us.  

Users can do the following

- Create a new manuscript. A manuscript has a title and an abstract
- Edit a manuscript
- Publish a manuscript
- Delete a manuscript
- List manuscripts

## Write the test first

First test is to create a manuscript and then try and get it back again

```typescript
import {createStore} from "Redux";

describe('manuscript store', () => {
    test('create manuscripts', () => {
        const store = createStore()
        const action = {
            type: "CREATE_MANUSCRIPT",
            title: "Redux is ok",
            abstract: "You can manage state with Redux"
        }
        store.dispatch(action)

        expect(store.getState().manuscripts[0]).toEqual({
            title: "Redux is ok",
            abstract: "You can manage state with Redux"
        })
    })

})
```

Some explanation

- We are using `createStore` from Redux to create a store. The store has various methods for us to work with it.
- With Redux if you wish to change the state you send an "action" which will typically have a field of `type` to describe the type of the action and a payload of data. 
- We then _dispatch_ the action to the store.
- Finally we make an assertion on the store to see if the first (and only) manuscript in `getState` returns us what we sent in. 

## Try to run the test

The test shouldn't compile and if your editor/IDE is well configured it should've highlighted some problems to you

```
  ● Test suite failed to run

    TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
    src/Redux.spec.tsx:5:23 - error TS2554: Expected 1-3 arguments, but got 0.

    5         const store = createStore()
                            ~~~~~~~~~~~~~
```

## Write the minimal amount of code for the test to run and check the failing test output

When you create a store you can supply a number of things which we'll get into later. 

For now just update it with a bit of a fudge to appease the compiler. We'll send in a _reducer_ which does nothing.

```typescript
const store = createStore(() => {})
```

Try again

```
 FAIL  src/Redux.spec.tsx
  ● Test suite failed to run

    TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
    src/Redux.spec.tsx:14:33 - error TS2339: Property 'manuscripts' does not exist on type 'void & {}'.

    14         expect(store.getState().manuscripts[0]).toEqual({
                                       ~~~~~~~~~~~
```

The problem is our state doesn't have a manuscripts array in its type. Right now the type of our store is `void & {}`.

Let's fix that

```typescript
const initialMSStore = {
    manuscripts: []
}

const MSReducer = (state = initialMSStore, action: any) => state

describe('manuscript store', () => {
    test('create manuscripts', () => {
        const store = createStore(MSReducer, initialMSStore)
        const action = {
            type: "CREATE_MANUSCRIPT",
            title: "Redux is ok",
            abstract: "You can manage state with Redux"
        }
        store.dispatch(action)

        expect(store.getState().manuscripts[0]).toEqual({
            title: "Redux is ok",
            abstract: "You can manage state with Redux"
        })
    })
})
```

- By defining `initialMSStore` with a field `manuscripts` and sending it as our initial state when calling `createStore` it can now infer the type we want when we call `getState`.
- When you call `createStore` and want to pass through an initial state you need to pass through something called a _reducer_. We'll get on to that later but you'll see we created `MSReducer` and you may be able to figure out from its definition what it does.

With these changes the TS compiler completes and the tests fails how we would expect

```
Expected: {"abstract": "You can manage state with Redux", "title": "Redux is ok"}
Received: undefined
```

## Write enough code to make it pass

With Redux _actions_ are sent to a store, just like how our test is doing. In order to manipulate the state Redux applies _reducers_ to create a new state.

We created an empty reducer to make the test compile, now we'll do _just enough code to make it pass_.

```typescript
const MSReducer: Reducer<ManuscriptStore> = (state = initialMSStore, action: any) => ({
    manuscripts: [{title: "Redux is ok", abstract: "You can manage state with Redux"}]
})
```

We need to give TS a bit more type information so it can be sure we're doing things right. We wouldn't want an incorrectly typed reducer applying state transformations or bad things could happen. So we introduced an interface `ManuscriptStore`

```typescript
interface ManuscriptStore {
    manuscripts: {title: string, abstract: string}[]
}
```

We then hard-code the new state to be what we want from the test. This may seem counter-intuitive but we're _just trying to make the test pass_. We've done some important work in getting our types correct and this will motivate us to write another test to move the code forward.

If you run the test it should pass. 

## Refactor

The "idea" of a manuscript with its fields is repeated a number of times in the code. 

Let's capture that idea to DRY up the code and make it more type-safe.

```typescript
interface Manuscript {
    title: string
    abstract: string
}
```

Now we can refactor our code using this type

```typescript
interface ManuscriptStore {
    manuscripts: Manuscript[]
}
```

```typescript
test('create manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with Redux"}

        const store = createStore(MSReducer, initialMSStore)
        const action = {
            type: "CREATE_MANUSCRIPT",
            ...testManuscript
        }
        store.dispatch(action)

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
})
```

We dried up the test data by creating `testManuscript`. We then used the `...` syntax to include its fields in our `action` and then used it in our assertion.

Finally let's move the production code in to a separate file if you haven't already.

Hopefully you can see that although we hard-coded our reducer to "just" make the test pass it actually gave us space to do some small but important refactoring before introducing new behaviour. 

This mindset is important, being in the state of failing tests should feel dangerous and uncomfortable so design your code and your tests so you can keep making small changes and constantly refactoring. If you refactor whilst your tests are red you can only rely on your brain to know you're doing the right thing. If the tests are _green_ and you're refactoring you know at least that you're not breaking behaviour. 

## Write the test first

Now we have refactored and have our first passing test let's write a new test to force us away from a hardcoded result. We can do that by just copy and pasting our existing test and changing `testManuscript`.

```typescript
test('create a different manuscript', () => {
    const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}

    const store = createStore(MSReducer, initialMSStore)
    const action = {
        type: "CREATE_MANUSCRIPT",
        ...testManuscript
    }
    store.dispatch(action)

    expect(store.getState().manuscripts[0]).toEqual(testManuscript)
})
```

## Try to run the test

It should fail as we expect

```
  Object {
-   "abstract": "But leave around a lot of floof",
-   "title": "Cats are nice",
+   "abstract": "You can manage state with Redux",
+   "title": "Redux is ok",
  }
```

## Write enough code to make it pass

We need to use the data from our `action` that we send through.

```typescript
export const MSReducer: Reducer<ManuscriptStore> = (state = initialMSStore, action: any) => ({
    manuscripts: [{title: action.title, abstract: action.abstract}]
})
```

This should make both our tests pass. You may have noticed this is still not really the final behaviour we want because when we send a create manuscript action it will actually overwrite the old one. 

Again though, be strict and refactor first and then we'll write a new test.

## Refactor

In statically typed languages it's a rule of thumb that you should not write functions that accept `any` unless they truly can accept `any` value. This is because it has no type safety and results in a poor developer experience. As a user of `MSReducer` how do I know what an `action` is and what it should contain?

Let's capture our `action` type. It's a convention for your actions to live inside a separate file or directory, so inside `actions.tsx`

```typescript
import {Manuscript} from "./Redux";

export const CREATE_MANUSCRIPT = "CREATE_MANUSCRIPT"

export interface CreateManuscriptAction {
    type: typeof CREATE_MANUSCRIPT
    payload: Manuscript
}

export const createManuscript = (manuscript: Manuscript) => ({
    type: CREATE_MANUSCRIPT,
    payload: manuscript
})
```

- We're capturing the type of action in a constant to replace our repeated magic string
- `CreateManuscriptAction` is the data type for our action
- Conventionally you should create a convenience function to create actions, which in our case is `createManuscript`

Now we can update our reducer. They should also live in a separate file/folder so create `reducers.tsx`, move the reducer inside it and then update it to use our new action type

```typescript
export const MSReducer: Reducer<ManuscriptStore, CreateManuscriptAction> = (state = initialMSStore, action: CreateManuscriptAction) => {
    switch (action.type) {
        case CREATE_MANUSCRIPT:
            return {manuscripts: [{title: action.payload.title, abstract: action.payload.abstract}]}
    }
}
```

Our reducer now explicitly operates on CreateManuscriptAction. Using the type system this way ensures things hang together and is an excellent thinking tool for deciding how to split apart your state, reducers and actions if your application gets bigger.

Next lets update both our tests so they use our new action helper `createManuscript`.

```typescript
describe('manuscript store', () => {

    test('create manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with Redux"}

        const store = createStore(MSReducer, initialMSStore)
        store.dispatch(createManuscript(testManuscript))

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
    })

    test('create a different manuscript', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}

        const store = createStore(MSReducer, initialMSStore)
        store.dispatch(createManuscript(testManuscript))

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
    })

})
```

One final refactor I'd like to do is make it so there is a convienience function to create a new, empty manuscript store.

```typescript
const newManuscriptStore = () => createStore(MSReducer, initialMSStore)
```

Finally update the tests to use this function and make sure it's still working.

I hope you'd agree that our test reads a lot better now. If your tests are easy to write and read, chances are the code they are testing are easy to work with and integrate with the rest of your system too. 

Our next iterative improvement is to handle storing multiple manuscripts. 

## Write the test first

```typescript
test('create multiple manuscripts', () => {
    const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}
    const testManuscript2 = {title: "Dogs are ok", abstract: "They can be gud fren"}

    const store = newManuscriptStore()
    store.dispatch(createManuscript(testManuscript))
    store.dispatch(createManuscript(testManuscript2))

    expect(store.getState().manuscripts).toHaveLength(2)
})
```

## Try to run the test

```
  ● manuscript store › create multiple manuscripts

    expect(received).toHaveLength(expected)

    Expected length: 2
    Received length: 1
    Received array:  [{"abstract": "They can be gud fren", "title": "Dogs are ok"}]
```

## Write enough code to make it pass

Our reducer is passed the _previous state_ of the store so we just need to copy the old state's manuscripts and add the new one.

```typescript
export const MSReducer: Reducer<ManuscriptStore, CreateManuscriptAction> = (state = initialMSStore, action: CreateManuscriptAction) => {
    switch (action.type) {
        case ManuscriptAction.CREATE_MANUSCRIPT:
            return {
                manuscripts: [
                    ...state.manuscripts,
                    {title: action.payload.title, abstract: action.payload.abstract}
                ]
            }
    }
}
```

The important line is `...state.manuscripts` which is the spread operator so we can create a new array with the new manuscript defined afterward

Now that we're happy with creating manuscripts we can move on to editing them. We dont have an ID as such to identify which manuscript to edit but for the sake of simplicity we'll just use the array index; this is not best practice for a real application!


## Write the test first

```typescript
test('can edit manuscripts', () => {
    const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}
    const testManuscriptV2 = {title: "Cats are the best", abstract: "no downsides whatsoever"}
    const store = newManuscriptStore()

    store.dispatch(createManuscript(testManuscript))
    store.dispatch(editManuscript(0, testManuscriptV2))

    expect(store.getState().manuscripts[0]).toEqual(testManuscriptV2)
})
```

With TDD we get to imagine what we want our API to be through our test. We want to have a new action to dispatch called `editManuscript` where I can send a new version of the manuscript.
 
## Try to run the test

The TS compiler should complain that `editManuscript` does not exist.

## Write the minimal amount of code for the test to run and check the failing test output

Define an empty reducer function so the compiler can help us write more code. If you're using a fancy IDE like me it can try and generate the function for you

```typescript
function editManuscript(index: number, changes: { title: string, abstract: string }) {
    return {};
}
```

Re-run the compiler again and we get a different error

```typescript
src/Redux.spec.tsx:49:24 - error TS2345: Argument of type '{}' is not assignable to parameter of type 'CreateManuscriptAction'.
  Type '{}' is missing the following properties from type 'CreateManuscriptAction': type, payload
```

The fact that `CreateManuscriptAction` is being mentioned should make us feel a bit uneasy because we're doing a new action yet but we shouldn't be tempted to dive down the rabbit hole of defining new action types and such. 

When we're not compiling we must do whatever it takes to get ourselves back to "green" again. We can worry about this sort of thing when we have _working software backed by tests_.

So for now, just do what the compiler asks.

```typescript
function editManuscript(index: number, changes: { title: string }) {
    return {type: ManuscriptAction.CREATE_MANUSCRIPT, payload: {title: "blah", abstract: "lol"}};
}
```

Now the code should compile and the test should fail. 

## Write enough code to make it pass

We need to add a new action type

```typescript
export const EDIT_MANUSCRIPT = "EDIT_MANUSCRIPT"
export const CREATE_MANUSCRIPT = "CREATE_MANUSCRIPT"
```

Create an interface for our new action

```typescript
export interface EditManuscriptAction {
    type: typeof EDIT_MANUSCRIPT
    id: number
    payload: Manuscript
}
```

Move our new function out of the test code (if you haven't already) and make it consistent with the other action

```typescript
export const editManuscript = (index: number, changes: Manuscript) => ({
    type: EDIT_MANUSCRIPT,
    payload: {title: "blah", abstract: "lol"}
})
```

Next, our reducer currently only works against create manuscript actions

```typescript
export const MSReducer: Reducer<ManuscriptStore, CreateManuscriptAction> = (state = initialMSStore, action: CreateManuscriptAction) => {
```

We need to update the signature of our reducer to accommodate this, so in the actions file add a new type to encode what actions we support.

```typescript
export type ManuscriptActionTypes = CreateManuscriptAction | EditManuscriptAction
```

This describes a _union_ type, of our actions. We can then use that type in the signature of our reducer.

```typescript
export const MSReducer: Reducer<ManuscriptStore, ManuscriptActionTypes> = (state = initialMSStore, action: ManuscriptActionTypes) => {
    switch (action.type) {
        case CREATE_MANUSCRIPT:
            return {
                manuscripts: [
                    ...state.manuscripts,
                    {title: action.payload.title, abstract: action.payload.abstract}
                ]
            }
        case EDIT_MANUSCRIPT:
            return state
    }
}
```

We made a lot of changes so we're just returning the existing state so we can re-run the tests to make sure it still compiles.

Check the test still runs and now we should update our `createEditAction` so that it correctly creates the edit action.

````typescript
export const editManuscript = (index: number, changes: Manuscript): ManuscriptActionTypes => ({
    type: EDIT_MANUSCRIPT,
    id: index,
    payload: changes
})
````

Now we can update our reducer to act on the action by adding a new `case` to the `switch`

```typescript
case EDIT_MANUSCRIPT:
    const editAction: EditManuscriptAction = action

    const newState = Object.assign({}, state)
    newState.manuscripts[editAction.id] = editAction.payload
    return newState
```

- We need to _cast_ the `action: ManuscriptActionTypes` into an `EditManuscriptAction` so we have access to the action data
- Create a copy of the state for us to return
- Update the manuscript at the correct index

The test should now pass! 

Now we want to work on **deleting manuscripts**


## Write the test first

Just to re-emphasise, by writing a test first it lets us
- Imagine how we want the API to be
- Experience what failure looks like in case of regressions. We make sure that our failing tests clearly illustrate _what is wrong_
- Get feedback on whether our code change enacts the behaviour we want

```typescript
    it('can delete manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with redux"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))
        store.dispatch(deleteManuscript(0))

        expect(store.getState().manuscripts).toHaveLength(0)
    })
```

## Try to run the test

```
ReferenceError: deleteManuscript is not defined

  53 |         const store = newManuscriptStore()
  54 |         store.dispatch(createManuscript(testManuscript))
> 55 |         store.dispatch(deleteManuscript(0))
     |               ^
  56 | 
  57 |         expect(store.getState().manuscripts[0]).toEqual(testManuscript)
  58 |     })

```

## Write the minimal amount of code for the test to run and check the failing test output

We have not yet defined `deleteManuscript` so in the same file as `createManuscript` let's write _just enough code to make the test pass_. 

Describe our new action in an interface.

```typescript
interface DeleteManuscriptAction {
    type: typeof DELETE_MANUSCRIPT
    id: number
}
```

Update our `ManuscriptActionTypes` to include our new action.

```typescript
export type ManuscriptActionTypes = CreateManuscriptAction | EditManuscriptAction | DeleteManuscriptAction
```

Finally create our `deleteManuscript` function which creates an instance of our action.

```typescript
export const deleteManuscript = (id: number): ManuscriptActionTypes => ({
    type: DELETE_MANUSCRIPT,
    id,
})
```

This is enough to make the test compile and run but you'll get a strange error. 

```
TypeError: Cannot read property 'manuscripts' of undefined

  55 |         store.dispatch(deleteManuscript(0))
  56 | 
> 57 |         expect(store.getState().manuscripts).toHaveLength(0)
     |                ^
  58 |     })
  59 | 
  60 | })
```

This is because our code doesn't handle the new type of action so therefore it returns undefined. 

Let's give a default implementation for our new action type to get a better error message

```typescript
export const MSReducer: Reducer<ManuscriptStore, ManuscriptActionTypes> = (state = initialMSStore, action: ManuscriptActionTypes) => {
    switch (action.type) {
        case CREATE_MANUSCRIPT:
            //etc
        case EDIT_MANUSCRIPT:
            //etc
        case DELETE_MANUSCRIPT:
            return state
    }
}
```

This way we're "handling" the new action by just returning the current state, it makes no changes. Now the test should be failing as we'd hope.

```
expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
```

## Write enough code to make it pass

We can use the `filter` method on collections to filter by index

```typescript
case DELETE_MANUSCRIPT:
            return {
                manuscripts: state.manuscripts.filter((element, index) => index != action.id)
            }
```

## Using Redux with React

We've now created our **actions** and **reducers** which allow us to manage the state of a simple manuscript store and hopefully have a grasp of the basics around Redux. Now what we want to try and do is wire our code up to a web application with React which should demonstrate how with a little boilerplate Redux allows us to nicely separate our concerns from the presentation logic.

For the sake of brevity we wont test drive the React part as we have other chapters for this, we'll just see how to snap Redux and React together.

### Some plumbing 

You'll need to install `react-redux` as a dependency. This package lets us stick these two things together!

`yarn add react-redux @types/react-redux`

Next, add an `index.tsx` with the following inside

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
``` 

And then create an `App.tsx`

```typescript
import React, { Component } from 'react';

class App extends Component {
  render() {
    return <>
      <h1>Manuscript tracking system</h1>
    </>;
  }
}

export default App;
```

If you then run `yarn start` and visit [http://localhost:3000](localhost:3000) you should see our heading. 

In order for the components in our application gain access to our store we need to wrap it in a `Provider`. Change `index.tsx` to the following.

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createStore} from "redux";
import {MSReducer} from "./reducers";
import {initialMSStore} from "./redux";
import {createManuscript} from "./actions";
import { Provider } from 'react-redux'

const store = createStore(MSReducer, initialMSStore)
store.dispatch(createManuscript({title: "This is just a test manuscript", abstract: "Wow great content"}))

ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider>,
    document.getElementById('root')
);
```

- We've imported the code we've written to create our store with our reducer and our initial state
- For the sake of setting up the data we've manually dispatched an action to the store to adfd some test data.
- We wrap our `App` component in a `Provider` which will give access to our store. 

### A manuscipt list component

Let's create a new file called `list-manuscripts.tsx` and create a simple react component to render manuscripts.

```typescript
import {Manuscript} from "./redux";

interface ListManuscriptProps {
    manuscripts: Manuscript[]
}

export const ListManuscripts = (props: ListManuscriptProps) => {
    return <>
        <table>
            <thead>
                <th>Title</th>
                <th>Abstract</th>
            </thead>
            <tbody>
            {props.manuscripts.map(m => <tr><td>{m.title}</td><td>{m.abstract}</td><tr/>)}
            </tbody>
        </table>
    </>
}

ListManuscripts.defaultProps = {manuscripts: []}
```

- Define our props for the interface in terms of simple data types
- Create a table and just a `tr` for each manuscript

Now we need add it into our `App`.

```typescript
class App extends Component {
  render() {
    return <>
      <h1>Manuscript tracking system</h1>
      <ListManuscripts />
    </>;
  }
}
```

If you check the web page it should show the table headings but no data. So how do we get data from our store into the `props` of our component?

This is where `react-redux` comes in again. What we need to do is _map our state to props_

We have to tell the framework how to do this, with a simple function. We then _connect_ that function to our component. 

This may all feel a bit abstract but should become clear with some code, so here is the updated `list-manuscripts.tsx`

```typescript
import React, {FC, useState} from "react";
import {Manuscript, ManuscriptStore} from "./redux";
import {connect} from "react-redux";

interface ListManuscriptProps {
    manuscripts: Manuscript[]
}

const ListManuscripts = (props: ListManuscriptProps) => {
    return <>
        <table>
            <thead>
                <th>Title</th>
                <th>Abstract</th>
            </thead>
            <tbody>
            {props.manuscripts.map(m => <><td>{m.title}</td><td>{m.abstract}</td></>)}
            </tbody>
        </table>
    </>
}

ListManuscripts.defaultProps = {manuscripts: []}

const mapStateToProps = (state: ManuscriptStore) => ({
    manuscripts: state.manuscripts
})

export default connect(mapStateToProps)(ListManuscripts)
```

- We've defined a `mapStateToProps` function which is responsible for taking our store's state and converting it to the datatype that our props are for our component. 
    - This lets us decouple the data model of our state from the way we want data to be sent to our component
    - This lets us test our component completely isolated from _how_ the data gets to it
- We use the `connect` function which allows us to connect this function with our component and we export that for our `App` to use.
    - In a real system, you'd probably still want to export the unconnected React component so that you can test it.
    
After making these changes you should see the table now has the item we've added. 


