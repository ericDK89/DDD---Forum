import { randomUUID } from 'crypto'

export class UniqueEntityId {
  private _value: string

  private constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  static create(value?: string) {
    return new UniqueEntityId(value)
  }

  get value() {
    return this._value
  }

  equals(id: UniqueEntityId) {
    return id.value === this.value
  }
}
