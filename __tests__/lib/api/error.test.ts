import { AxiosError, AxiosResponse } from 'axios';


import { ApiError } from '../../../src/lib/api/error';

describe('ApiError', () => {

    test('Should create an ApiError', () => {

        const error = new ApiError('my message', 'my-code', 'any-link');
        expect(error).toBeDefined();

    });

    test('Should format ApiError from Axios erros with common message', () => {

        const axiosError = new AxiosError<string>(AxiosError.ERR_BAD_REQUEST);
        const error = ApiError.fromAxiosError(axiosError);

        expect(error.code).toEqual('Unknown');
        expect(error.link).toEqual('unknown');
        expect(error.message).toEqual(AxiosError.ERR_BAD_REQUEST);

    });

    test('Should format ApiError from Axios erros with any server string response', () => {

        const axiosError = new AxiosError<string>(AxiosError.ERR_NETWORK, undefined, undefined, undefined, {
            data: 'any response',
        } as AxiosResponse);

        const error = ApiError.fromAxiosError(axiosError);

        expect(error.code).toEqual('Unknown');
        expect(error.link).toEqual('unknown');
        expect(error.message).toEqual(axiosError.response?.data);

    });

    test('Should format ApiError from Axios erros with Atlas Data API response', () => {

        const mockAtlasResponse = {
            error: 'no authentication methods were specified',
            error_code: 'InvalidParameter',
            link: 'string'
        };

        const axiosError = new AxiosError<string>(AxiosError.ERR_BAD_REQUEST, undefined, undefined, undefined, {
            data: mockAtlasResponse,
        } as AxiosResponse);

        const error = ApiError.fromAxiosError(axiosError);

        expect(error.code).toEqual(mockAtlasResponse.error_code);
        expect(error.link).toEqual(mockAtlasResponse.link);
        expect(error.message).toEqual(mockAtlasResponse.error);

    });

});