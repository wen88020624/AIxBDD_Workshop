import { setWorldConstructor } from '@cucumber/cucumber';
import { INestApplication } from '@nestjs/common';
import { ScenarioContext } from './scenario.context';

export class CustomWorld {
  private app: INestApplication;
  public scenarioContext: ScenarioContext;

  constructor() {
    this.app = null;
    this.scenarioContext = new ScenarioContext();
  }

  setApp(app: INestApplication) {
    this.app = app;
  }

  getApp(): INestApplication {
    return this.app;
  }
}