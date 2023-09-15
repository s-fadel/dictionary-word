declare module "global" {
    namespace NodeJS {
      interface Global {
        fetch: jest.Mock;
      }
    }
  }
  