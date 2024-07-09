import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Comment, CommentProps } from './comment'

type QuestionCommentProps = CommentProps & {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  static create(props: QuestionCommentProps, id?: UniqueEntityId) {
    return new QuestionComment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )
  }

  get questionId() {
    return this.props.questionId
  }
}
