import { CliApp } from '../../src/index';

describe('Memory leak test for CliApp class', () => {
  it('should not leak memory when creating and resetting instances', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 100000; i++) {
      const app = new CliApp(['test', 'command']);
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
        .end((args) => {
          console.log(args)
          console.log('Container created!')
        });
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDifference = finalMemory - initialMemory;

    console.log(`Memory used: ${memoryDifference} bytes`);

    // 1024 * 1024 = 1MB
    expect(memoryDifference).toBeLessThan(1024 * 1024);
  });

  it('should leak memory when creating and resetting instances', () => {
    const initialMemory = process.memoryUsage().heapUsed;

    for (let i = 0; i < 1000000; i++) {
      const app = new CliApp(['test', 'command']);
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
        .end((args) => {
          console.log(args)
          console.log('Container created!')
        });
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDifference = finalMemory - initialMemory;

    console.log(`Memory used: ${memoryDifference} bytes`);

    // 1024 * 1024 = 1MB
    expect(memoryDifference).toBeGreaterThan(1024 * 1024);
  });
});
