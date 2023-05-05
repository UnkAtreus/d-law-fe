// export interface TCaseFolder {
//     id: string;
//     type: string;
//     title: string;
//     tags: string[];
//     created_at: Date;
//     owner: string;
//     share_with: string[];
//     last_edited: Date;
//     path?: string;
// }

import { TFileTypes } from '@utilities/index';

export interface ResponseData<T> {
    data: T;
}

export interface TCreateFolder {
    caseNumber: string;
    blackCaseNumber: string;
    redCaseNumber: string;
    name: string;
    email: string;
    caseTitle: string;
    caseContent: string;
}

export interface TCreateSubFolder {
    name: string;
}

export interface TChangeDocumentName {
    name: string;
}

export interface TCreatePermission {
    userId: string;
    permission: string;
}

export interface TPermission {
    ID: string;
    CreatedAt: string | Date | null;
    UpdatedAt: string | Date | null;
    DeletedAt: string | Date | null;
    Name: string;
    CasePermissions: any;
    PermissionLogs: any;
}

export interface TMoveFile {
    targetFolderId: string;
}

export interface TAuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    token: string;
}

export interface TUserPermissions extends TAuthUser {
    permission: string
}

export interface TCaseFolder {
    id: 'fcea6122-f9ad-4162-8ac6-391d8f3adbbb' | '';
    name: 'นายประสิทธิ์ ทองแดง';
    tags: [];
    owner: {
        id: 'e33897ee-6a1b-47c0-98a6-50879a3c30d3';
        email: 'test@test.com';
        firstName: 'Choolerk';
        lastName: 'Taebanpakul';
    };
    shareWith: [
        {
            id: 'e33897ee-6a1b-47c0-98a6-50879a3c30d3';
            email: 'test@test.com';
            firstName: 'Choolerk';
            lastName: 'Taebanpakul';
        },
        {
            id: '67e3e0d2-3a7f-4f47-8a45-cf6fd6178b5a';
            email: 'test2@test.com';
            firstName: 'Eiei';
            lastName: 'Taebanpakul';
        }
    ];
    createdAt: '2023-04-17T19:04:14.078892Z';
    updatedAt: '2023-04-24T05:56:48.945376Z';
    folderId: '9208dc1d-9bc9-49a5-aa79-9a379ea8bec3';
}

export interface TMyCaseFolder {
    id: '9208dc1d-9bc9-49a5-aa79-9a379ea8bec3';
    name: 'นายประสิทธิ์ ทองแดง';
    subFolders: [
        {
            id: '055bda2f-3b2e-4a56-b7f7-f0eff04e899a';
            name: 'แก้ไขชื่อโฟลเดอร์';
            subFolders: null;
            files: [];
            createdAt: '2023-04-17 19:46:01.695818 +0000 UTC';
            updatedAt: '2023-04-21 10:05:41.512279 +0000 UTC';
            tags: [];
            caseId: 'fcea6122-f9ad-4162-8ac6-391d8f3adbbb';
        }
    ];
    files: {
        id: 'f61a5c99-40c4-4948-91b0-0758b6ad76e9';
        name: 'pexels-photo-2775196.jpeg';
        url: '';
        previewUrl: '';
        tags: [
            {
                id: 'e5d69e56-4c78-4bf6-b424-dc80d0e58e32';
                name: 'image';
            }
        ];
        createdAt: '2023-04-23 19:27:56.872032 +0000 UTC';
        updatedAt: '2023-04-23 19:27:56.872032 +0000 UTC';
    }[];

    createdAt: '2023-04-17 19:04:14.151498 +0000 UTC';
    updatedAt: '2023-04-24 05:56:48.926099 +0000 UTC';
    tags: [
        {
            id: '0d1fbf50-a2d0-4165-883a-af65630b23e9';
            name: 'pdf';
        },
        {
            id: 'e5d69e56-4c78-4bf6-b424-dc80d0e58e32';
            name: 'image';
        }
    ];
    caseId: 'fcea6122-f9ad-4162-8ac6-391d8f3adbbb';
}

interface TTags {
    id: string;
    name: TFileTypes;
}

export interface TDocument {
    id: string;
    name: string;
    url?: string;
    previewUrl?: string;
    tags: TTags[];
    subFolders?: null;
    files?: TDocument[];
    caseId?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface TFolder {
    id: string;
    name: string;
    subFolders: null;
    files: TDocument[];
    createdAt: Date | string;
    updatedAt: Date | string;
    tags: TTags[];
    caseId: string;
}

export interface TRootFolder {
    id: string;
    name: string;
}

export interface TMenuFolder {
    id: string;
    name: TFileTypes | string;
    count: number;
}

export interface TFreqCaseFolder {
    id: string;
    name: string;
    folderId: string;
}

export interface TUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface TFile {
    id: string;
    name: string;
    url: string;
    previewUrl: string;
    tags: TTags[];
    createdAt: Date | string;
    updatedAt: Date | string;
    type: TFileTypes;
}
