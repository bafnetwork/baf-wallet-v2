export function createUserVerifyMessage(userId: string, nonce: string) {
    return `${userId}:${nonce}`;
}