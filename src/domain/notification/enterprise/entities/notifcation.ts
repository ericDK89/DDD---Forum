import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'

type NotificationProps = {
  recipientId: UniqueEntityId
  title: string
  content: string
  createdAt?: Date
  readAt?: Date
}

export class Notification extends Entity<NotificationProps> {
  static create(props: NotificationProps, id?: UniqueEntityId) {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }

  read() {
    this.props.readAt = new Date()
  }

  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get readAt() {
    return this.props.readAt
  }
}
