import { error, success } from './either'

const doSomething = (shouldSuccess: boolean) => {
  if (shouldSuccess) {
    return success(10)
  } else {
    return error('error')
  }
}

describe('Either test suit', () => {
  it('success result', () => {
    const result = doSomething(true)

    expect(result.isError()).toBeFalsy()
    expect(result.isSuccess()).toBeTruthy()
  })

  it('error reason', () => {
    const reason = doSomething(false)

    expect(reason.isError()).toBeTruthy()
    expect(reason.isSuccess()).toBeFalsy()
  })
})
