import { prisma } from 'mocks/prisma';

import { UserRepository } from '@/features/user/repositories/user-repository';
import { UserMock } from '@/shared/test-helpers/mocks/user.mock';

describe('[Repositories] UserRepository', () => {
  let repository: UserRepository;
  beforeEach(() => {
    repository = new UserRepository();
  });

  describe('create', () => {
    it('should call service with correctly params', async () => {
      const input = {
        email: 'test@test.com',
        name: 'test',
        password: 'password',
        username: 'test',
      };

      await repository.create(input);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: input,
      });
    });
  });

  describe('findById', () => {
    it('return user if found', async () => {
      const user = UserMock.create();

      prisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findById(user.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {
          id: user.id,
        },
      });
      expect(result).toBe(user);
    });

    it('return null if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findById('non_existent_id');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {
          id: 'non_existent_id',
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('return user if found', async () => {
      const user = UserMock.create();

      prisma.user.findUnique.mockResolvedValue(user);

      const result = await repository.findByEmail(user.email);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {
          email: user.email,
        },
      });

      expect(result).toBe(user);
    });

    it('return null if user is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('non_existent_email');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        select: expect.anything(),
        where: {
          email: 'non_existent_email',
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('updateIsActiveStatus', () => {
    it('should call service with correctly params', async () => {
      const user = UserMock.create();

      await repository.updateIsActiveStatus(user.id);

      expect(prisma.user.update).toHaveBeenCalledWith({
        data: {
          isActive: true,
        },
        where: {
          id: user.id,
        },
      });
    });

    it('should throw an error if an error occurs', async () => {
      const user = UserMock.create();

      prisma.user.update.mockImplementationOnce(() => {
        throw new Error('error');
      });

      const response = repository.updateIsActiveStatus(user.id);

      await expect(response).rejects.toThrowError();
    });
  });
});
