# Outline

1. Unit Testing
2. Unit Testable code is deterministic/idempotent
3. Single Responsibility Principle
4. Mocking
5. A little bit about Typescript and Jest
6. Jest Config
7. Integration Testing
8. CI/CD
9. Husky Pre Commit

### Not Covering E2E Testing.  No Cypress, No Playwright

## Why

### 1. **Catch Problems/Issues/Bugs Early**
- Unit testing helps identify issues in your codebase as early as possible in the development process. 

### 2. **Promotes Clean, Modular, and Maintainable Code**
- To write unit tests, your code needs to be small, focused, and modular. This naturally aligns with principles like the **Single Responsibility Principle (SRP)** and helps avoid overly complex and tightly coupled code. 

### 3. **Improves Developer Confidence and Saves Time**
- When you have a suite of well-written unit tests, you can refactor code or introduce changes with confidence. Unit tests give immediate feedback on whether the changes introduced any bugs, saving time spent on repeated manual testing and debugging. Very important for refactoring, and adding new features.

### 4. **Acts as Documentation for Your Code**
- Unit tests describe what your code is supposed to do, demonstrating its use cases in an executable way. 

### 5. **Facilitates Continuous Integration and Delivery**
- In modern development pipelines, having automated unit tests integrated with CI/CD systems ensures that every new commit triggers testing, guaranteeing that new changes don’t break existing code. 

