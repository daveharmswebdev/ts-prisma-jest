# So What?!?

In my 8 - 9 years or doing this, very few projects took unit testing seriously.  One project stands out.  And that was an app wher you could pay your taxes electronically.  In other words it was regulated by the IRS and it involved the customers money.

Most projects that I have been on did require unit testing.  If it did it did not demand coverage and even if it did demand unit testing.  Unit testing was not part of the CI/CD pipeline.  

## But if it did...

## Coverage

```text
-------------------------------------|---------|----------|---------|---------|-------------------
File                                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------------------------|---------|----------|---------|---------|-------------------
All files                            |   77.63 |    88.13 |      60 |   77.63 |                   
 src                                 |       0 |        0 |       0 |       0 |                   
  app.ts                             |       0 |        0 |       0 |       0 | 1-15              
  server.ts                          |       0 |        0 |       0 |       0 | 1-10              
 src/controllers                     |      70 |    92.85 |   57.14 |      70 |                   
  actor.controller.ts                |   71.42 |      100 |      60 |   71.42 | 59-71,74-84       
  film.controller.ts                 |   65.38 |       75 |      50 |   65.38 | 18-26             
 src/controllers/helpers             |     100 |      100 |     100 |     100 |                   
  createResponse.ts                  |     100 |      100 |     100 |     100 |                   
 src/libs                            |     100 |      100 |     100 |     100 |                   
  prisma.ts                          |     100 |      100 |     100 |     100 |                   
 src/middleWares                     |       0 |        0 |       0 |       0 |                   
  errorHandler.ts                    |       0 |        0 |       0 |       0 | 1-20              
  validate-request.ts                |       0 |        0 |       0 |       0 | 1-17              
 src/models                          |       0 |        0 |       0 |       0 |                   
  IResponse.ts                       |       0 |        0 |       0 |       0 | 1-5               
 src/services                        |   97.67 |    93.75 |      60 |   97.67 |                   
  actor.service.ts                   |     100 |    93.75 |     100 |     100 | 75                
  film.service.ts                    |      75 |      100 |       0 |      75 | 5,8               
 src/services/helpers/actors         |     100 |      100 |     100 |     100 |                   
  actor.mappers.ts                   |     100 |      100 |     100 |     100 |                   
  fetchAllActorsWithFilmCountArgs.ts |     100 |      100 |     100 |     100 |                   
  getActorFindManyArgs.ts            |     100 |      100 |     100 |     100 |                   
  getActorFindUniqueArgs.ts          |     100 |      100 |     100 |     100 |                   
 src/services/helpers/films          |     100 |      100 |     100 |     100 |                   
  getFilmFindManyArgs.ts             |     100 |      100 |     100 |     100 |                   
  getFilmFindUniqueArgs.ts           |     100 |      100 |     100 |     100 |                   
 src/validators                      |     100 |      100 |     100 |     100 |                   
  actor.validator.ts                 |     100 |      100 |     100 |     100 |                   
-------------------------------------|---------|----------|---------|---------|-------------------

```

The flag we add is `--coverage`.  Documentation can be found [here](https://jestjs.io/docs/cli#--coverageboolean).

This demo project is placing those options in the jest config file.

```js
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    
    
    // start coverage config here
    
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: [
        'src/**/*.ts', // Collects coverage from all source files
        '!src/routes/**',
        '!src/tests/**', // Excludes test files from coverage
        '!**/*.d.ts', // Excludes TypeScript declaration files
    ],
    
    // end coverage config
    
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: 'tsconfig.tests.json', // Use the test-specific config
            },
        ],
    },
    testMatch: ['<rootDir>/tests/unit/**/*.unit.spec.ts'],
    rootDir: './',
    moduleDirectories: [
        'node_modules',
        '<rootDir>/src', // Allows imports from the src directory without relative paths
    ],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/'}),
};
```

In the coverage directory you will find a browsable report.

## Some files don't have coverage.  So what?

