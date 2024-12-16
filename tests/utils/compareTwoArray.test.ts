import { shallowCompareTwoArrays } from '../../src/utils/shallowCompareTwoArrays';

describe ('testing various correct cases of using function', () => {
  test ('tests comparing length functions', () => {
    expect(shallowCompareTwoArrays([], [''])).toBeFalsy()
  })

  test ('tests comparing various arrays', () => {
    expect(shallowCompareTwoArrays([1,2,3], ['1', '2', '3'])).toBeFalsy()
  })

  test ('tests comparing same arrays', () => {
    expect(shallowCompareTwoArrays([1,2,3], [1,2,3])).toBeTruthy()
  })
})

describe ('testing various wrong cases of using function', () => {
  test ('passing various nested array', () => {
    expect(shallowCompareTwoArrays([[[[[1,2,3]]]]], [[[1,2,3]]])).toBeFalsy()
  })

  test ('passing same nested array', () => {
    expect(shallowCompareTwoArrays([[[[[1,2,3]]]]], [[[[[1,2,3]]]]])).toBeTruthy()
  })
})