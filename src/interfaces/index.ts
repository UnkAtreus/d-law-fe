export interface TCaseFolder {
    id: string;
    type: string;
    title: string;
    tags: string[];
    created_at: Date;
    owner: string;
    share_with: string[];
    last_edited: Date;
    path?: string;
}

export interface TCreateFolder {
    name: string;
    caseNumber: string;
    email?: string;
    title?: string;
    discription?: string;
}

export interface TCreateSubFolder {
    name: string;
}

export interface TChangeDocumentName {
    name: string;
}
