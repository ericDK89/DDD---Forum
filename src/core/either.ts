// ! Error
class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isSuccess(): this is Right<L, R> {
    return false
  }

  isError(): this is Left<L, R> {
    return true
  }
}

// * Success
class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isSuccess(): this is Right<L, R> {
    return true
  }

  isError(): this is Left<L, R> {
    return false
  }
}

export type Either<L, R> = Left<L, R> | Right<L, R>

export const error = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

export const success = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
