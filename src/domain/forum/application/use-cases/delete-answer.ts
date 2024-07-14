import { Either, error, success } from '../../../../core/either'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { AnswersRepository } from '../repositories/answers-repository'

type DeleteAnswerUseCaseRequest = {
  authorId: string
  answerId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteAnswerUseCase {
  private answersRepository: AnswersRepository

  constructor(answersRepository: AnswersRepository) {
    this.answersRepository = answersRepository
  }

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return error(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.value) {
      return error(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return success({})
  }
}
