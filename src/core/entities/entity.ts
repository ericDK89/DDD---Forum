import { UniqueEntityId } from './unique-entity-id'

export class Entity<T> {
  private _id: UniqueEntityId
  protected props: T

  get id() {
    return this._id
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected constructor(props: any, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? UniqueEntityId.create()
  }
}
