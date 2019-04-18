import {createStore} from "redux";
import {initialMSStore} from "./redux";
import {MSReducer} from "./reducers";
import {createManuscript, editManuscript} from "./actions";

describe('manuscript store', () => {

    const newManuscriptStore = () => createStore(MSReducer, initialMSStore)

    test('create manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with redux"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
    })

    test('create a different manuscript', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
    })

    test('create multiple manuscripts', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}
        const testManuscript2 = {title: "Dogs are ok", abstract: "They can be gud fren"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))
        store.dispatch(createManuscript(testManuscript2))

        expect(store.getState().manuscripts).toHaveLength(2)
    })

    test('can edit manuscript title', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}
        const testManuscriptV2 = {title: "Cats are the best", abstract: "no downsides whatsoever"}
        const store = newManuscriptStore()

        store.dispatch(createManuscript(testManuscript))

        store.dispatch(editManuscript(0, testManuscriptV2))

        expect(store.getState().manuscripts[0]).toEqual(testManuscriptV2)
    })

})
