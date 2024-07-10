import { Either, error, success } from '../../../../core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type DeleteAnswerCommentUseCaseRequest = {
  authorId: string
  answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswerCommentUseCase {
  private answerCommentsRepository: AnswerCommentsRepository

  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    this.answerCommentsRepository = answerCommentsRepository
  }

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return error(new ResourceNotFoundError())
    }

    if (answerComment.authorId.value !== authorId) {
      return error(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return success({})
  }
}
