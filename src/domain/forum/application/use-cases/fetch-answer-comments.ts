import { Either, success } from '../../../../core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comments'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

type FetchAnswerCommentsUseCaseRequest = {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  private answerCommentsRepository: AnswerCommentsRepository

  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    this.answerCommentsRepository = answerCommentsRepository
  }

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return success({ answerComments })
  }
}
