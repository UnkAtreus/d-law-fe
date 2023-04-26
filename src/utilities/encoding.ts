export const decodeBase64 = (string: string) => {
    const body = Buffer.from(string, 'base64').toString('utf8');
    return JSON.parse(body);
};

export const encodeBase64 = (obj: {}) => {
    const str = JSON.stringify(obj);
    return Buffer.from(str).toString('base64');
};
