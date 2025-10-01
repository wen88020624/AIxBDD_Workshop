import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { TestConfig } from './test.config';

BeforeAll(async function() {
  await TestConfig.initializeApp();
});

AfterAll(async function() {
  await TestConfig.closeApp();
});

Before(async function(this: CustomWorld) {
  this.setApp(TestConfig.getApp());
  this.scenarioContext.reset();
});

After(async function(this: CustomWorld) {
  // Clean up any scenario-specific resources
  this.scenarioContext.reset();
});