import {Reducer} from "redux";

export const initialMSStore = {
    manuscripts: []
}

interface Manuscript {
    title: string
    abstract: string
}

interface ManuscriptStore {
    manuscripts: Manuscript[]
}

export const MSReducer: Reducer<ManuscriptStore> = (state = initialMSStore, action: any) => ({
    manuscripts: [{title: "Redux is ok", abstract: "You can manage state with redux"}]
})