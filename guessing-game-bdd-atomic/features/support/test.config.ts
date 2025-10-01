import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

export class TestConfig {
  private static app: INestApplication;

  static async initializeApp(): Promise<INestApplication> {
    if (!this.app) {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      this.app = moduleFixture.createNestApplication();
      await this.app.init();
    }
    return this.app;
  }

  static async closeApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
      this.app = null;
    }
  }

  static getApp(): INestApplication {
    return this.app;
  }
}
