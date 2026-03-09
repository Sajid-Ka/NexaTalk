export interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export const successResponse = <T>(data: T, message?: string): SuccessResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  code: string,
  message: string,
  details?: unknown
): ErrorResponse => ({
  success: false,
  error: {
    code, 
    message,
    details, 
  },
});
