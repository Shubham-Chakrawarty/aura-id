import { AppError } from '@/utils/error.utils.js';
import { prisma, Prisma, toSafeUser } from '@aura/database'; // Import your new mapper
import { hashString, RegisterRequest } from '@aura/shared';

export class RegisterService {
  async execute(data: RegisterRequest) {
    const {
      password,
      email,
      firstName,
      lastName,
      clientId,
      metadata,
      avatarUrl,
    } = data;

    const hashedPassword = await hashString(password);

    // Prepare metadata scoped to the specific application
    const userMetadata: Prisma.InputJsonValue = {
      [clientId]: metadata || {},
    };

    try {
      const newUser = await prisma.$transaction(async (tx) => {
        // 1. Verify Application Exists
        const application = await tx.application.findUnique({
          where: { clientId: clientId },
        });

        if (!application) {
          throw new AppError(
            `Application with clientId "${clientId}" not found.`,
            400,
            'INVALID_APPLICATION',
          );
        }
        // 2. Create the User
        const user = await tx.user.create({
          data: {
            email: email.toLowerCase(), // Always normalize emails!
            firstName,
            lastName,
            passwordHash: hashedPassword,
            metadata: userMetadata,
            avatarUrl: avatarUrl || null,
          },
        });

        // 3. Create the Application-Specific "Visa" (Membership)
        await tx.applicationMembership.create({
          data: {
            userId: user.id,
            applicationId: application.id,
            role: 'USER',
          },
        });

        return user;
      });

      // 4. Transform to SafeUser before leaving the Service layer
      return {
        user: toSafeUser(newUser, clientId),
      };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new AppError(
          'A user with this email address already exists.',
          409,
          'USER_ALREADY_EXISTS',
        );
      }
      if (error.code === 'P2003') {
        throw new AppError(
          'The application you are trying to join does not exist.',
          400,
          'INVALID_APPLICATION',
        );
      }
    }
    throw error; // Let global error middleware handle 500s
  }
}
