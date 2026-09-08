import { UsersService } from './users.service.js';
import { User } from './user.entity.js';
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


//----------------- setup tests ------------------------------------

//no hash in the test
//jest.mock('bcrypt');

describe('UsersService', () => {
    let service: UsersService;
    let repo: jest.Mock<Repository<User>>;

    beforeEach(async () => {
	const module = await Test.createTestingModule({
	    providers: [
		UsersService,
		{
		    provide: getRepositoryToken(User),
		    useValue: {
			find: jest.fn(),
			findOne: jest.fn(),
			findOneBy: jest.fn(),
			create: jest.fn(),
			save: jest.fn(),
			merge: jest.fn(),
			remove: jest.fn(),
			query: jest.fn(),
		    }
		}
	    ]
	}).compile();
        repo = module.get<jest.Mock<Repository<User>>>(
	    getRepositoryToken(User),
	);
        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });


//----------------- findAllAdmin -----------------------------------

    describe('test scope', () => {
	it('a test', async () => {
	    repo.find.mockResolvedValue([]);
	});//a test
    });//test scope

/*
    describe('findAllAdmin Unit Spec', () => {
        it('queries with no filters when nothing is provided', async () => {
            repo.find.mockResolvedValue([]);

            await service.findAllAdmin();

            expect(repo.find).toHaveBeenCalledWith(
                expect.objectContaining({ where: {} }),
            );
        });

        it('builds an OR condition across name/email when search is provided', async () => {
            repo.find.mockResolvedValue([]);

            await service.findAllAdmin('john', 'active', 'true');

            const callArg = repo.find.mock.calls[0][0];
            expect(callArg.where).toHaveLength(2);
            expect(callArg.where[0]).toMatchObject({ status: 'active', isVerified: true });
            expect(callArg.where[1]).toMatchObject({ status: 'active', isVerified: true });
        });

        it('builds a single condition object when only status/isVerified are provided', async () => {
            repo.find.mockResolvedValue([]);

            await service.findAllAdmin(undefined, 'suspended', 'false');

            const callArg = repo.find.mock.calls[0][0];
            expect(callArg.where).toEqual({ status: 'suspended', isVerified: false });
        });

        it('returns whatever the repository resolves', async () => {
            const users = [{ id: 1 }] as User[];
            repo.find.mockResolvedValue(users);

            const result = await service.findAllAdmin();

            expect(result).toEqual(users);
        });
    });

    // ---------------------------------------------------------------------
    // findAll / findOne / findByEmail / findByStatus
    // ---------------------------------------------------------------------
    describe('findAll', () => {
        it('delegates to repository.find with no args', () => {
            service.findAll();
            expect(repo.find).toHaveBeenCalledWith();
        });
    });

    describe('findOne', () => {
        it('looks up a user by id', async () => {
            const user = { id: 5 } as User;
            repo.findOne.mockResolvedValue(user);

            const result = await service.findOne(5);

            expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
            expect(result).toEqual(user);
        });

        it('returns null when no user is found', async () => {
            repo.findOne.mockResolvedValue(null);

            const result = await service.findOne(999);

            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('looks up a user by email', async () => {
            const user = { id: 1, email: 'a@b.com' } as User;
            repo.findOneBy.mockResolvedValue(user);

            const result = await service.findByEmail('a@b.com');

            expect(repo.findOneBy).toHaveBeenCalledWith({ email: 'a@b.com' });
            expect(result).toEqual(user);
        });
    });

    describe('findByStatus', () => {
        it('looks up users by status', async () => {
            const users = [{ id: 1, status: 'active' }] as User[];
            repo.find.mockResolvedValue(users);

            const result = await service.findByStatus('active');

            expect(repo.find).toHaveBeenCalledWith({ where: { status: 'active' } });
            expect(result).toEqual(users);
        });
    });

    // ---------------------------------------------------------------------
    // create
    // ---------------------------------------------------------------------
    describe('create', () => {
        const dto = {
            name: ' John Doe ',
            email: ' john@example.com ',
            password: 'plaintext',
            firstname: ' John ',
            status: 'active',
            siren_entreprise: '123456789',
        };

        it('throws BadRequestException when name is missing', async () => {
            await expect(
                service.create({ ...dto, name: '' } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws BadRequestException when email is missing', async () => {
            await expect(
                service.create({ ...dto, email: '' } as any),
            ).rejects.toThrow(BadRequestException);
        });

        it('throws ConflictException when the email is already used', async () => {
            repo.findOneBy.mockResolvedValue({ id: 1, email: 'john@example.com' });

            await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
        });

        it('hashes the password and trims fields before saving', async () => {
            repo.findOneBy.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            repo.create.mockImplementation((data: any) => data);
            repo.save.mockImplementation((data: any) => Promise.resolve({ id: 1, ...data }));

            const result = await service.create(dto as any);

            expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 10);
            expect(repo.create).toHaveBeenCalledWith({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashed-password',
                firstname: 'John',
                status: 'active',
                siren_entreprise: '123456789',
            });
            expect(repo.save).toHaveBeenCalled();
            expect(result).toMatchObject({ id: 1, name: 'John Doe' });
        });

        it('defaults firstname to name and status to active when omitted', async () => {
            repo.findOneBy.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
            repo.create.mockImplementation((data: any) => data);
            repo.save.mockImplementation((data: any) => Promise.resolve(data));

            await service.create({
                name: 'Jane',
                email: 'jane@example.com',
                password: 'x',
            } as any);

            expect(repo.create).toHaveBeenCalledWith(
                expect.objectContaining({ firstname: 'Jane', status: 'active' }),
            );
        });

        it('stores an empty password string when no password is provided', async () => {
            repo.findOneBy.mockResolvedValue(null);
            repo.create.mockImplementation((data: any) => data);
            repo.save.mockImplementation((data: any) => Promise.resolve(data));

            await service.create({
                name: 'Jane',
                email: 'jane@example.com',
            } as any);

            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(repo.create).toHaveBeenCalledWith(
                expect.objectContaining({ password: '' }),
            );
        });
    });

    // ---------------------------------------------------------------------
    // update
    // ---------------------------------------------------------------------
    describe('update', () => {
        it('throws NotFoundException when the user does not exist', async () => {
            repo.findOneBy.mockResolvedValue(null);

            await expect(service.update(1, { name: 'New' } as any)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('merges and saves the updated user', async () => {
            const existing = { id: 1, name: 'Old' } as User;
            const merged = { id: 1, name: 'New' } as User;
            repo.findOneBy.mockResolvedValue(existing);
            repo.merge.mockReturnValue(merged);
            repo.save.mockResolvedValue(merged);

            const result = await service.update(1, { name: 'New' } as any);

            expect(repo.merge).toHaveBeenCalledWith(existing, { name: 'New' });
            expect(repo.save).toHaveBeenCalledWith(merged);
            expect(result).toEqual(merged);
        });
    });

    // ---------------------------------------------------------------------
    // getProfileInfo
    // ---------------------------------------------------------------------
    describe('getProfileInfo', () => {
        it('throws NotFoundException when user is not found', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(service.getProfileInfo(1)).rejects.toThrow(NotFoundException);
        });

        it('returns the selected profile fields', async () => {
            const profile = { name: 'John', firstname: 'J', email: 'j@x.com', status: 'active' };
            repo.findOne.mockResolvedValue(profile);

            const result = await service.getProfileInfo(1);

            expect(repo.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 1 } }),
            );
            expect(result).toEqual(profile);
        });
    });

    // ---------------------------------------------------------------------
    // getProfileInfoByID
    // ---------------------------------------------------------------------
    describe('getProfileInfoByID', () => {
        it('throws NotFoundException for a non-numeric id', async () => {
            await expect(service.getProfileInfoByID('abc')).rejects.toThrow(NotFoundException);
            expect(repo.findOne).not.toHaveBeenCalled();
        });

        it('throws NotFoundException when the user does not exist', async () => {
            repo.findOne.mockResolvedValue(null);

            await expect(service.getProfileInfoByID('42')).rejects.toThrow(NotFoundException);
        });

        it('returns the user when found', async () => {
            const user = { id: 42, name: 'John' } as User;
            repo.findOne.mockResolvedValue(user);

            const result = await service.getProfileInfoByID('42');

            expect(repo.findOne).toHaveBeenCalledWith(
                expect.objectContaining({ where: { id: 42 } }),
            );
            expect(result).toEqual(user);
        });
    });

    // ---------------------------------------------------------------------
    // validateUser / suspendUser
    // ---------------------------------------------------------------------
    describe('validateUser', () => {
        it('throws NotFoundException when the user does not exist', async () => {
            repo.findOneBy.mockResolvedValue(null);

            await expect(service.validateUser(1)).rejects.toThrow(NotFoundException);
        });

        it('sets isVerified to true and saves', async () => {
            const user = { id: 1, isVerified: false } as User;
            repo.findOneBy.mockResolvedValue(user);
            repo.save.mockImplementation((u: any) => Promise.resolve(u));

            const result = await service.validateUser(1);

            expect(result.isVerified).toBe(true);
            expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ isVerified: true }));
        });
    });

    describe('suspendUser', () => {
        it('throws NotFoundException when the user does not exist', async () => {
            repo.findOneBy.mockResolvedValue(null);

            await expect(service.suspendUser(1)).rejects.toThrow(NotFoundException);
        });

        it('sets isVerified to false and saves', async () => {
            const user = { id: 1, isVerified: true } as User;
            repo.findOneBy.mockResolvedValue(user);
            repo.save.mockImplementation((u: any) => Promise.resolve(u));

            const result = await service.suspendUser(1);

            expect(result.isVerified).toBe(false);
            expect(repo.save).toHaveBeenCalledWith(expect.objectContaining({ isVerified: false }));
        });
    });

    // ---------------------------------------------------------------------
    // removeUser
    // ---------------------------------------------------------------------
    describe('removeUser', () => {
        it('throws NotFoundException when the user does not exist', async () => {
            repo.findOneBy.mockResolvedValue(null);

            await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
            expect(repo.query).not.toHaveBeenCalled();
        });

        it('throws BadRequestException when the user has transaction history', async () => {
            repo.findOneBy.mockResolvedValue({ id: 1 } as User);
            repo.query.mockResolvedValue([{ cnt: '3' }]);

            await expect(service.removeUser(1)).rejects.toThrow(BadRequestException);
            expect(repo.remove).not.toHaveBeenCalled();
        });

        it('removes the user when there is no transaction history', async () => {
            const user = { id: 1 } as User;
            repo.findOneBy.mockResolvedValue(user);
            repo.query.mockResolvedValue([{ cnt: '0' }]);
            repo.remove.mockResolvedValue(user);

            await service.removeUser(1);

            expect(repo.query).toHaveBeenCalledWith(expect.any(String), [1, 1]);
            expect(repo.remove).toHaveBeenCalledWith(user);
        });
    });*/
});

