export type AppError = Error & {
  statusCode: number;
  isOperational: boolean;
  details?: any;
};

export function createAppError(
  message: string,
  statusCode: number,
  details?: any,
  isOperational = true
): AppError {
  const error = new Error(message) as AppError;

  error.statusCode = statusCode;
  error.details = details;
  error.isOperational = isOperational;

  Error.captureStackTrace(error, createAppError);

  return error;
}

export function isAppError(error: unknown): error is AppError {
  return (
    error instanceof Error &&
    typeof (error as AppError).statusCode === "number" &&
    typeof (error as AppError).isOperational === "boolean"
  );
}

export const notFoundError = (message = "Resource not found") =>
  createAppError(message, 404);

export const validationError = (
  message = "Invalid request data",
  details?: unknown
) => createAppError(message, 400, details);

export const authError = (message = "Unauthorized") =>
  createAppError(message, 401);

export const forbiddenError = (message = "Forbidden access") =>
  createAppError(message, 403);
