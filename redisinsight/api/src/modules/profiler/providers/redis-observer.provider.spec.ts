import { Test, TestingModule } from '@nestjs/testing';
import * as Redis from 'ioredis-mock';
import {
  mockLogFile,
  MockType,
} from 'src/__mocks__';
import { InstancesBusinessService } from 'src/modules/shared/services/instances-business/instances-business.service';
import { RedisObserverProvider } from 'src/modules/profiler/providers/redis-observer.provider';
import { RedisService } from 'src/modules/core/services/redis/redis.service';
import { mockRedisClientInstance } from 'src/modules/shared/services/base/redis-consumer.abstract.service.spec';
import { RedisObserverStatus } from 'src/modules/profiler/constants';

const mockRedisClient = new Redis();

describe('RedisObserverProvider', () => {
  let service: RedisObserverProvider;
  let redisService: MockType<RedisService>;
  let databaseService: MockType<InstancesBusinessService>;

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisObserverProvider,
        {
          provide: RedisService,
          useFactory: () => ({
            getClientInstance: jest.fn(),
            isClientConnected: jest.fn(),
          }),
        },
        {
          provide: InstancesBusinessService,
          useFactory: () => ({
            connectToInstance: jest.fn(),
            getOneById: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = await module.get(RedisObserverProvider);
    redisService = await module.get(RedisService);
    databaseService = await module.get(InstancesBusinessService);

    redisService.getClientInstance.mockReturnValue(mockRedisClientInstance);
    redisService.isClientConnected.mockReturnValue(true);
    databaseService.connectToInstance.mockResolvedValue(mockRedisClient);
  });

  it('getOrCreateObserver new observer get existing redis client', async () => {
    const redisObserver = await service.getOrCreateObserver(
      mockLogFile.instanceId,
    );

    expect(redisObserver['redis']).toEqual(mockRedisClientInstance.client);
    expect(service['redisObservers'].size).toEqual(1);

    expect(await service.getObserver(mockLogFile.instanceId)).toEqual(redisObserver);
    await service.removeObserver(mockLogFile.instanceId);
    expect(service['redisObservers'].size).toEqual(0);
  });

  it('getOrCreateObserver new observer create new redis client ', async () => {
    redisService.isClientConnected.mockReturnValueOnce(false);

    const redisObserver = await service.getOrCreateObserver(
      mockLogFile.instanceId,
    );

    expect(redisObserver['redis']).not.toEqual(mockRedisClientInstance.client);
  });

  it('getOrCreateObserver check statuses', async () => {
    const redisObserver = await service.getOrCreateObserver(
      mockLogFile.instanceId,
    );

    redisObserver['init'] = jest.fn();
    expect(redisObserver['redis']).toEqual(mockRedisClientInstance.client);
    expect(redisObserver['status']).toEqual(RedisObserverStatus.Connected);

    const promise = service.getOrCreateObserver(mockLogFile.instanceId);
    redisObserver.emit('connect');
    const redisObserver2 = await promise;
    expect(redisObserver).toEqual(redisObserver2);

    redisObserver['status'] = RedisObserverStatus.Ready;
    const redisObserver3 = await service.getOrCreateObserver(mockLogFile.instanceId);
    expect(redisObserver).toEqual(redisObserver3);

    redisObserver['status'] = RedisObserverStatus.Error;
    const promise2 = service.getOrCreateObserver(mockLogFile.instanceId);
    redisObserver.emit('connect');
    const redisObserver4 = await promise2;
    expect(redisObserver).toEqual(redisObserver4);

    try {
      redisObserver['status'] = RedisObserverStatus.Empty;
      const promise3 = service.getOrCreateObserver(mockLogFile.instanceId);
      redisObserver.emit('connect_error', new Error('error'));
      await promise3;
      fail();
    } catch (e) {
      expect(e.message).toEqual('error');
    }
  });
});
