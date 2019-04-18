import {Manuscript} from "./redux";

export enum ManuscriptAction {
    CREATE_MANUSCRIPT
}

export interface CreateManuscriptAction {
    type: typeof ManuscriptAction.CREATE_MANUSCRIPT
    payload: Manuscript
}

export const createManuscript = (manuscript: Manuscript) => ({
    type: ManuscriptAction.CREATE_MANUSCRIPT,
    payload: manuscript
})
