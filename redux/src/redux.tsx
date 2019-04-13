export const initialMSStore = {
    manuscripts: []
}

export interface Manuscript {
    title: string
    abstract: string
}

export interface ManuscriptStore {
    manuscripts: Manuscript[]
}

