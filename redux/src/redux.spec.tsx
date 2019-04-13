import {createStore, Reducer} from "redux";

const initialMSStore = {
    manuscripts: []
}

interface ManuscriptStore {
    manuscripts: {title: string, abstract: string}[]
}

const MSReducer: Reducer<ManuscriptStore> = (state = initialMSStore, action: any) => ({
    manuscripts: [{title: "Redux is ok", abstract: "You can manage state with redux"}]
})

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
