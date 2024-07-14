import { Either, error, success } from '../../../../core/either'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

type GetQuestionBySlugUseCaseRequest = {
  slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  { question: Question }
>

export class GetQuestionBySlugUseCase {
  private questionsRepository: QuestionsRepository

  constructor(questionsRepository: QuestionsRepository) {
    this.questionsRepository = questionsRepository
  }

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return error(new ResourceNotFoundError())
    }

    return success({ question })
  }
}
