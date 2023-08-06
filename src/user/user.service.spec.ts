import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CreateUserDTO } from 'src/shared/models/dtos/user/createuser.dto';
import { EventlogService } from 'src/eventlog/eventlog.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EventlogService,
          useValue: {
            saveLog: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('dbMethods', () => {
    it('should create a new user', async () => {
      const mockedUser = 'test user';
      const user: CreateUserDTO = {
        firebaseUid: 'test',
        name: 'test',
        fbregistered: false,
        lastName: 'test lastName',
      };
      const result = await service.createDbUser(user, mockedUser);
      expect(result).toEqual(mockedUser);
      expect(service.createDbUser).toBeDefined();
    });
  });
});
