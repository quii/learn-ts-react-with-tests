import {Reducer} from "redux";
import {CreateManuscriptAction, ManuscriptAction} from "./actions";
import {initialMSStore, ManuscriptStore} from "./redux";

export const MSReducer: Reducer<ManuscriptStore, CreateManuscriptAction> = (state = initialMSStore, action: CreateManuscriptAction) => {
    switch (action.type) {
        case ManuscriptAction.CREATE_MANUSCRIPT:
            return {manuscripts: [{title: action.payload.title, abstract: action.payload.abstract}]}
    }
}