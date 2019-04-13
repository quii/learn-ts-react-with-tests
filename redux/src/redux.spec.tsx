import {createStore} from "redux";
import {initialMSStore} from "./redux";
import {MSReducer} from "./reducers";
import {createManuscript} from "./actions";

describe('manuscript store', () => {

    test('create manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with redux"}

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
