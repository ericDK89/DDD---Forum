import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Comment, CommentProps } from './comment'

type AnswerCommentProps = CommentProps & {
  answerId: UniqueEntityId
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  static create(props: AnswerCommentProps, id?: UniqueEntityId) {
    return new AnswerComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
  }

  get answerId() {
    return this.props.answerId
  }
}
