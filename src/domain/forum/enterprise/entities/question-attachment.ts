import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'

type QuestionAttachmentProps = {
  quetionsId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
    return new QuestionAttachment(props, id)
  }

  get questionId() {
    return this.props.quetionsId
  }

  get attachmentId() {
    return this.props.attachmentId
  }
}
