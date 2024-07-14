import { Either, error, success } from '../../../../core/either'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

type DeleteQuestionCommentUseCaseRequest = {
  authorId: string
  questionCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteQuestionCommentUseCase {
  private questionCommentsRepository: QuestionCommentsRepository

  constructor(questionCommentsRepository: QuestionCommentsRepository) {
    this.questionCommentsRepository = questionCommentsRepository
  }

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return error(new ResourceNotFoundError())
    }

    if (questionComment.authorId.value !== authorId) {
      return error(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return success({})
  }
}
