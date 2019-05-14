import {createStore} from "redux";
import {initialMSStore} from "./redux";
import {MSReducer} from "./reducers";
import {createManuscript, deleteManuscript, editManuscript} from "./actions";

describe('manuscript store', () => {

    const newManuscriptStore = () => createStore(MSReducer, initialMSStore)

    it('creates manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with redux"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
    })

    it('creates a different manuscript', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))

        expect(store.getState().manuscripts[0]).toEqual(testManuscript)
    })

    it('creates multiple manuscripts', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}
        const testManuscript2 = {title: "Dogs are ok", abstract: "They can be gud fren"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))
        store.dispatch(createManuscript(testManuscript2))

        expect(store.getState().manuscripts).toHaveLength(2)
    })

    it('can edit manuscripts', () => {
        const testManuscript = {title: "Cats are nice", abstract: "But leave around a lot of floof"}
        const testManuscriptV2 = {title: "Cats are the best", abstract: "no downsides whatsoever"}
        const store = newManuscriptStore()

        store.dispatch(createManuscript(testManuscript))
        store.dispatch(editManuscript(0, testManuscriptV2))

        expect(store.getState().manuscripts[0]).toEqual(testManuscriptV2)
    })

    it('can delete manuscripts', () => {
        const testManuscript = {title: "Redux is ok", abstract: "You can manage state with redux"}

        const store = newManuscriptStore()
        store.dispatch(createManuscript(testManuscript))
        store.dispatch(deleteManuscript(0))

        expect(store.getState().manuscripts).toHaveLength(0)
    })

})
