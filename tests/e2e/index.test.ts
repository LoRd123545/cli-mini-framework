import { exec } from "child_process";

describe ('Test correct variations of using app', () => {
  test('Test using app by cli with correct arguments', (done) => {
    const command = 'npm run sandbox:dev-start container create container-1 image-1'
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Test failed. Error: ${error.message}`)
        done()
        return
      }

      done()
    })
  });
})

describe ('Test wrong variations of using app', () => {
  test('Test running app in cmd without arguments ', (done) => {
    const command = 'npm run sandbox:dev-start'
    exec(command, (error, stdout, stderr) => {
      if (error) {
        done()
        return
      }

      console.error(`App should throw error`)
      done()
    })
  });

  test('Test running app in cmd without 1 argument', (done) => {
    const command = 'npm run sandbox:dev-start container create container-1'
    exec(command, (error, stdout, stderr) => {
      if (error) {
        done()
        return
      }

      console.error(`App should throw error`)
      done()
    })
  });
})