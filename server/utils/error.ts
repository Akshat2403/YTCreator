class CustomError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
    }
}

const createError = (status_code: number, msg: string) => {
    const err = new CustomError(msg, status_code);
    return err;
};
export default createError;
