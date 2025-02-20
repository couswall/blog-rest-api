import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "@/config/jwt.adapter";
import { CustomError } from "@/domain/errors/custom.error";
import { validateJWT } from "@/presentation/middlewares/validate-jwt";

jest.mock("@/config/jwt.adapter", () => ({
    JwtAdapter: {
        verifyJWT: jest.fn(),
    }
}));

describe('validate-jwt middleware tests', () => { 

    const mockRequest: Partial<Request> = { header: jest.fn() };
    const mockResponse: Partial<Response> = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
    };
    const mockNextFn: NextFunction = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    })

    test('should call next() if token is valid', async () => { 
        (mockRequest.header as jest.Mock).mockReturnValue('valid_token');
        (JwtAdapter.verifyJWT as jest.Mock).mockResolvedValue({id: 1, username: 'testing'});

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(JwtAdapter.verifyJWT).toHaveBeenCalledWith('valid_token');
        expect(mockNextFn).toHaveBeenCalled();
    });

    test('should return 401 if token is not provided',async () => { 
        (mockRequest.header as jest.Mock).mockReturnValue(undefined);

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: 'No token sent'}
        });
        expect(mockNextFn).not.toHaveBeenCalled();
    });
    
    test('should return 401 if token is invalid', async () => { 
        (mockRequest.header as jest.Mock).mockReturnValue('invalid_token');
        (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(new CustomError('Invalid or expired token', 401));

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockResponse.status).toHaveBeenCalledWith(401);   
        expect(mockResponse.json).toHaveBeenCalledWith({
            success: false,
            error: {message: 'Invalid or expired token'}
        });
    });

    test('should return 500 for unexpected errors', async () => { 
        (mockRequest.header as jest.Mock).mockReturnValue('invalid_token');
        (JwtAdapter.verifyJWT as jest.Mock).mockRejectedValue(new Error('Some internal error'));

        await validateJWT(mockRequest as Request, mockResponse as Response, mockNextFn);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
});