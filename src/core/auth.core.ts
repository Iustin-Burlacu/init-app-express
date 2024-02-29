import type * as express from 'express'
/*
* method used by TSOA to require authentication for methods implementing the Security Decorator
*/
export async function expressAuthentication (
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<string> {
    const token: string | undefined = request.header('Authorization')

    return await new Promise((resolve, reject) => {
        if (securityName === 'BearerAuth') {
            if (token) {
                resolve(token); return
            } else {
                reject(new Error('Token not present'))
            }
        }
        reject(new Error('Missing auth'))
    })
}
