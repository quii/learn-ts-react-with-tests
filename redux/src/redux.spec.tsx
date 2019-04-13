import {createStore} from "redux";
import {initialMSStore, MSReducer} from "./redux";

describe('manuscript store', () => {

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

})
