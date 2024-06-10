import crypto from 'crypto';

// Encrypt data
export function encryptData(
    data: string,
    secret_key: string,
    secret_iv: string,
    encryption_method: string
): string {
    const key = crypto
        .createHash('sha512')
        .update(secret_key)
        .digest('hex')
        .substring(0, 32);
    const encryptionIV = crypto
        .createHash('sha512')
        .update(secret_iv)
        .digest('hex')
        .substring(0, 16);

    const cipher = crypto.createCipheriv(encryption_method, key, encryptionIV);

    return Buffer.from(
        cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    ).toString('base64'); // Encrypts data and converts to hex and base64
}

// Decrypt data
export function decryptData(
    encryptedData: string,
    secret_key: string,
    secret_iv: string,
    encryption_method: string
): string {
    const key = crypto
        .createHash('sha512')
        .update(secret_key)
        .digest('hex')
        .substring(0, 32);
    const encryptionIV = crypto
        .createHash('sha512')
        .update(secret_iv)
        .digest('hex')
        .substring(0, 16);

    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(encryption_method, key, encryptionIV);

    return (
        decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
        decipher.final('utf8')
    ); // Decrypts data and converts to utf8
}
