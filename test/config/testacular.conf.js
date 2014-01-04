basePath = '../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  '../app/components/angular/angular.js',
  '../app/components/angular-mocks/angular-mocks.js',
  '../app/scripts/*.js',
  '../app/modules/**/module.js',
  '../app/modules/**/*.js',
  '../app/modules/core/*.js',
  'unit/**/*.js'
];

singleRun = true;

browsers = ['PhantomJS'];

reporters = ['dots', 'junit'];
junitReporter = {
  outputFile: 'output/unit.xml',
  suite: 'unit'
};
