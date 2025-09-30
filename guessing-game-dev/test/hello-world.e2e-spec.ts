import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HelloWorld End-to-End Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should greet with name parameter', () => {
    // Given my name is "Johnny"
    const name = 'Johnny';

    // When someone is greeting me
    return request(app.getHttpServer())
      .get('/api/hello')
      .query({ name })
      // Then he says "Hello world 'Johnny'!" to me
      .expect(200)
      .expect(`Hello world '${name}'!`);
  });

  afterAll(async () => {
    await app.close();
  });
});
