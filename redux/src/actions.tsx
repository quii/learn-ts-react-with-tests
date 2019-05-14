import {Manuscript} from "./redux";

export const EDIT_MANUSCRIPT = "EDIT_MANUSCRIPT"
export const CREATE_MANUSCRIPT = "CREATE_MANUSCRIPT"
export const DELETE_MANUSCRIPT = "DELETE_MANUSCRIPT"

interface CreateManuscriptAction {
    type: typeof CREATE_MANUSCRIPT
    payload: Manuscript
}

export interface EditManuscriptAction {
    type: typeof EDIT_MANUSCRIPT
    id: number
    payload: Manuscript
}

interface DeleteManuscriptAction {
    type: typeof DELETE_MANUSCRIPT
    id: number
}

export const createManuscript = (manuscript: Manuscript): ManuscriptActionTypes => ({
    type: CREATE_MANUSCRIPT,
    payload: manuscript
})

export const deleteManuscript = (id: number): ManuscriptActionTypes => ({
    type: DELETE_MANUSCRIPT,
    id,
})

export const editManuscript = (index: number, changes: Manuscript): ManuscriptActionTypes => ({
    type: EDIT_MANUSCRIPT,
    id: index,
    payload: changes
})

export type ManuscriptActionTypes = CreateManuscriptAction | EditManuscriptAction | DeleteManuscriptAction
