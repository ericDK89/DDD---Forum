/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityId } from './unique-entity-id'

export abstract class Entity<T> {
  private _id: UniqueEntityId
  protected props: T

  get id() {
    return this._id
  }

  protected constructor(props: any, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? UniqueEntityId.create()
  }

  equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }

    if (entity.id === this._id) {
      return true
    }

    return false
  }
}
