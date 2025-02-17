import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'

type InstructorProps = {
  name: string
}

export class Instructor extends Entity<InstructorProps> {
  static create(props: InstructorProps, id?: UniqueEntityId) {
    return new Instructor(props, id)
  }
}
