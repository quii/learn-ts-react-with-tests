import {Reducer} from "redux";
import {initialMSStore, ManuscriptStore} from "./redux";
import {
    CREATE_MANUSCRIPT,
    DELETE_MANUSCRIPT,
    EDIT_MANUSCRIPT,
    EditManuscriptAction,
    ManuscriptActionTypes
} from "./actions";

export const MSReducer: Reducer<ManuscriptStore, ManuscriptActionTypes> = (state = initialMSStore, action: ManuscriptActionTypes) => {
    switch (action.type) {
        case CREATE_MANUSCRIPT:
            return {
                manuscripts: [...state.manuscripts, {...action.payload}]
            }
        case EDIT_MANUSCRIPT:
            const editAction: EditManuscriptAction = action

            const newState = Object.assign({}, state)
            newState.manuscripts[editAction.id] = editAction.payload
            return newState
        case DELETE_MANUSCRIPT:
            return {
                manuscripts: state.manuscripts.filter((element, index) => index != action.id)
            }
    }

}
