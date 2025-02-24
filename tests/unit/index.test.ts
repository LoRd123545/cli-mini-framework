import { Cli } from '../../src/index';

describe('Memory leak test for Cli class', () => {
  it('should not leak memory when creating and resetting instances', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    //                  100 thousands
    for (let i = 0; i < 100000; i++) {
      const app = new Cli(['test', 'command']);
      app
        .scope(['container'])
        .command('create')
        .args([
          {
            name: 'image-name',
            required: true,
          },
          {
            name: 'container-name',
            required: true,
          }
        ])
        .end(() => {});
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDifference = finalMemory - initialMemory;

    // 1024 * 1024 = 1MB
    expect(memoryDifference).toBeLessThan(1024 * 1024);
  });

  it('should not leak memory when creating and resetting instances', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    //                  1 milion
    for (let i = 0; i < 1000000; i++) {
      const app = new Cli(['test', 'command']);
      app
        .scope(['container'])
        .command('create')
        .args([
          {
            name: 'image-name',
            required: true,
          },
          {
            name: 'container-name',
            required: true,
          }
        ])
        .end(() => {});
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDifference = finalMemory - initialMemory;

    // 1024 * 1024 = 1MB
    expect(memoryDifference).toBeLessThan(1024 * 1024);
  });
});
