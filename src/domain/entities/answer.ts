import { Entity } from '../../core/entities/entity'
import { UniqueEntityId } from '../../core/entities/unique-entity-id'

type AnswerProps = {
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export class Answer extends Entity<AnswerProps> {
  static create(props: AnswerProps, id?: UniqueEntityId) {
    return new Answer({ ...props, createdAt: new Date() }, id)
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
    this.update()
  }

  get questionId() {
    return this.props.questionId
  }

  get authorId() {
    return this.props.authorId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private update() {
    this.props.updatedAt = new Date()
  }
}
