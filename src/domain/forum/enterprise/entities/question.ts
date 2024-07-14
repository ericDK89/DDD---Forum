import dayjs from 'dayjs'
import { AggregateRoot } from '../../../../core/entities/aggregate-root'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'
import { QuestionAttachmentList } from './question-attachment-list'
import { Slug } from './value-objects/slug'

type QuestionProps = {
  authorId: UniqueEntityId
  title: string
  bestAnswerId?: UniqueEntityId
  attatchments?: QuestionAttachmentList
  slug?: Slug
  content: string
  createdAt?: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: QuestionProps, id?: UniqueEntityId) {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attatchments: props.attatchments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get isNew() {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get authorId() {
    return this.props.authorId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.update()
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
    if (bestAnswerId === undefined) {
      return
    }

    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.update()
  }

  get slug() {
    return this.props.slug?.value
  }

  get attachments() {
    return this.props.attatchments
  }

  set attachments(attachements: QuestionAttachmentList | undefined) {
    this.props.attatchments = attachements ?? new QuestionAttachmentList()
    this.update()
  }

  get content() {
    return this.props.content
  }

  set content(content: string) {
    this.props.content = content
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
