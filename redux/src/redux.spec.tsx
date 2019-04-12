import {createStore} from "redux";

describe('manuscript store', () => {
    test('create manuscripts', () => {
        const store = createStore(() => {}, {manuscripts: string[] = []})
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
