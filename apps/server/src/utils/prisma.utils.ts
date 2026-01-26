import { Prisma } from '@aura/database';
import { AppError } from './error.utils.js';

export async function dbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002': // Unique constraint failed
          throw new AppError(
            `A record with this data already exists.`,
            409,
            'CONFLICT_ERROR',
          );
        case 'P2025': // Record not found
          throw new AppError(
            'The requested record was not found.',
            404,
            'NOT_FOUND',
          );
        default:
          throw new AppError(
            `Database error: ${error.message}`,
            400,
            'BAD_REQUEST',
          );
      }
    }
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new AppError(
        'Invalid data format provided to the database.',
        400,
        'VALIDATION_ERROR',
      );
    }
    if (error instanceof AppError) throw error;
    throw new AppError(
      'An unexpected database error occurred.',
      500,
      'INTERNAL_SERVER_ERROR',
      error,
    );
  }
}
