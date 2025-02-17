import { Either, success } from '../../../../core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

type FetchRecentQuestionsUseCaseRequest = {
  page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  private questionsRepository: QuestionsRepository

  constructor(questionsRepository: QuestionsRepository) {
    this.questionsRepository = questionsRepository
  }

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return success({ questions })
  }
}
