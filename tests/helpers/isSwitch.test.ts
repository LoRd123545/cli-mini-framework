import { isSwitch } from '../../src/helpers/isSwitch'


describe('testing various correct cases of using', () => {
  test('should return null after pass correct command line', () => {
    expect(isSwitch("--flag")).toBeTruthy()
  });
  test('should return null after pass correct command line', () => {
    expect(isSwitch("--enable-feature")).toBeTruthy()
  });
  test('should return null after pass correct command line', () => {
    expect(isSwitch('--option="value"')).toBeTruthy()
  });
  test('should return null after pass correct command line', () => {
    expect(isSwitch(`--escaped="Line 1\\nLine 2"`)).toBeTruthy()
  });
  test('should return null after pass correct command line', () => {
    expect(isSwitch(`--long-option_name123`)).toBeTruthy()
  });
})

describe('testing various wrong cases of using', () => {
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`flag`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`option="value"`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`--path=`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`--key 'value'`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`--inv@lid`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`--sp ace`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`--key="unclosed`)).toBeFalsy()
  });
  test('should return false after pass wrong command line', () => {
    expect(isSwitch(`--key=value with spaces`)).toBeFalsy()
  });
})
