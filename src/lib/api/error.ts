import { AxiosError } from 'axios';

interface IApiError {
    link: string;
    error: string;
    error_code: string;
}

export class ApiError extends Error {

    constructor(public message: string, public code = 'Unknown', public link = 'unknown') {
        super(message);
    }

    public static fromAxiosError(error: AxiosError<IApiError | string>): ApiError {
        const data = error.response?.data;

        if (typeof data === 'string') {
            return new ApiError(data);
        }

        if (data && 'error' in data) {
            return new ApiError(data.error, data.error_code, data.link);
        }

        return new ApiError(error.message);

    }

}