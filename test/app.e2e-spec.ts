import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

const initializeApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
};

class AppTestHelper {
  static app: INestApplication;

  static async startApp() {
    if (!this.app) {
      this.app = await initializeApp();
    }
  }

  static async getRequestStatus(endpoint: string, expectedStatus: number) {
    const response = await request(this.app.getHttpServer()).get(endpoint);
    expect(response.status).toBe(expectedStatus);
  }

  static async closeApp() {
    if (this.app) {
      await this.app.close();
    }
  }
}

describe('AppController (e2e)', () => {

  beforeAll(async () => {
    await AppTestHelper.startApp();
  });

  it('should return 404 on GET /', async () => {
    await AppTestHelper.getRequestStatus('/', 404);
  });

  afterAll(async () => {
    await AppTestHelper.closeApp();
  });
});
