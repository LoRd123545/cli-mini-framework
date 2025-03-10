import { Cli } from '../../src/index';
import fs from 'fs';

it('log memory usage', () => {
  const initialMemory = process.memoryUsage().heapUsed;
  const instancesNumber = 100000
  //                      100 thousands
  let memoryUsageData = `iteration used`
  for (let i = 0; i < instancesNumber; i++) {
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

    if (i % 1000 === 0) {  // Log memory every 1000 instances
      const used = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed();  // Convert from bytes to MB
      memoryUsageData = `${memoryUsageData} \n${i} ${used}`
    }
  }

  fs.writeFileSync('./tests/unit/index.memory-usage-log.log.txt', memoryUsageData)
});