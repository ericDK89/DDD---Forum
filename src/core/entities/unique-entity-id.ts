import { randomUUID } from 'crypto'

export class UniqueEntityId {
  readonly _value: string

  private constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  static create(value?: string) {
    return new UniqueEntityId(value)
  }

  get value() {
    return this._value
  }
}
