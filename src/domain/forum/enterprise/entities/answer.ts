import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { AnswerCreatedEvent } from '../events/answer-created-events'
import { AnswerAttachmentList } from './answer-attachment-list'

type AnswerProps = {
  questionId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  createdAt?: Date
  updatedAt?: Date
  attatchments?: AnswerAttachmentList
}

export class Answer extends AggregateRoot<AnswerProps> {
  static create(props: AnswerProps, id?: UniqueEntityId) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attatchments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    // * If it is a new Answer (has no id)
    if (!id) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
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

  get attachments() {
    return this.props.attatchments
  }

  set attachments(attachements: AnswerAttachmentList | undefined) {
    this.props.attatchments = attachements ?? new AnswerAttachmentList()
    this.update()
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
