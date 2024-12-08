import { compareTwoArrays } from '../../src/utils/compareTwoArrays';

describe ('testing various correct cases of using function', () => {
  test ('tests comparing length functions', () => {
    expect(compareTwoArrays([], [''])).toBeFalsy()
  })

  test ('tests comparing various arrays', () => {
    expect(compareTwoArrays([1,2,3], ['1', '2', '3'])).toBeFalsy()
  })

  test ('tests comparing same arrays', () => {
    expect(compareTwoArrays([1,2,3], [1,2,3])).toBeTruthy()
  })
})

describe ('testing various wrong cases of using function', () => {
  test ('passing various nested array', () => {
    expect(compareTwoArrays([[[[[1,2,3]]]]], [[[1,2,3]]])).toBeFalsy()
  })

  test ('passing same nested array', () => {
    expect(compareTwoArrays([[[[[1,2,3]]]]], [[[[[1,2,3]]]]])).toBeTruthy()
  })
})