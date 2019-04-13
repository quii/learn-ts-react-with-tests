# Redux

Redux isn't _that_ complicated but can be a bit much if you try to learn how to make it work with react at the same time. 

In this chapter we will learn redux as a standalone way of managing state, guided with tests. This way you'll learn the important concepts that redux facilitates managing state. Once you're comfortable with these concepts integrating them into your react application will be easier

## Setup

- `$ npm init` to create a package.json
- `$ npm i jest @types/jest ts-jest redux typescript -D` install typescript, redux and jest
- Put the following in `jest.config.js`

```javascript
module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
```

- Put the following in `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["es2015"],
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

- Edit `package.json` and edit scripts with

```json
"scripts": {
    "test": "jest"
  },
```

- `$ mkdir src`
- Finally put the following in `src/redux.spec.tsx`

```typescript
test('hello', () => {
    expect("hello").toEqual("hello")
})
```

- Run the test through your IDE or with `npm run test` and you should have a simple passing test

## What to build? 

We're going to build a manuscript tracking system and redux is going to manage the state for us.  

Users can do the following

- Create a new manuscript. A manuscript has a title and an abstract
- Edit a manuscript
- Publish a manuscript
- Delete a manuscript
- List manuscripts
- Get a manuscript by id

## Write the test first

First test is to create a manuscript and then try and get it back again

```typescript
import {createStore} from "redux";

describe('manuscript store', () => {
    test('create manuscripts', () => {
        const store = createStore()
        const action = {
            type: "CREATE_MANUSCRIPT",
            title: "Redux is ok",
            abstract: "You can manage state with redux"
        }
        store.dispatch(action)

        expect(store.getState().manuscripts[0]).toEqual({
            title: "Redux is ok",
            abstract: "You can manage state with redux"
        })
    })

})
```

Some explanation

- We are using `createStore` from redux to create a store.
- With redux if you wish to change the state you send an "action" which will typically have a field of `type` to describe the type of the action and a payload of data.
- We then _dispatch_ the action to the store.
- Finally we make an assertion on the store to see if the first (and only) manuscript in `getState` returns us what we sent in. 

## Try to run the test

The test shouldn't compile and if your editor/IDE is well configured it should've highlighted some problems to you

```
  ● Test suite failed to run

    TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
    src/redux.spec.tsx:5:23 - error TS2554: Expected 1-3 arguments, but got 0.

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
 FAIL  src/redux.spec.tsx
  ● Test suite failed to run

    TypeScript diagnostics (customize using `[jest-config].globals.ts-jest.diagnostics` option):
    src/redux.spec.tsx:14:33 - error TS2339: Property 'manuscripts' does not exist on type 'void & {}'.

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
            abstract: "You can manage state with redux"
        }
        store.dispatch(action)

        expect(store.getState().manuscripts[0]).toEqual({
            title: "Redux is ok",
            abstract: "You can manage state with redux"
        })
    })
})
```

- By defining `initialMSStore` with a field `manuscripts` and sending it as our initial state when calling `createStore` it can now infer the type we want when we call `getState`.
- When you call `createStore` and want to pass through an initial state you need to pass through something called a _reducer_. We'll get on to that later but you'll see we created `MSReducer` and you may be able to figure out from its definition what it does.

With these changes the TS compiler completes and the tests fails how we would expect

```
Expected: {"abstract": "You can manage state with redux", "title": "Redux is ok"}
Received: undefined
```

## Write enough code to make it pass

With redux _actions_ are sent to a store, just like how our test is doing. In order to manipulate the state redux applies _reducers_ to create a new state.

We created an empty reducer to make the test compile, now we'll do _just enough code to make it pass_.

```typescript
const MSReducer: Reducer<ManuscriptStore> = (state = initialMSStore, action: any) => ({
    manuscripts: [{title: "Redux is ok", abstract: "You can manage state with redux"}]
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
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with redux"}

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

Finally let's move the production code in to a separate file if you haven't already 

## Repeat for new requirements
## Wrapping up



