import { Either, success } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

type CreateQuestionUseCaseRequest = {
  authorId: string
  title: string
  content: string
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  private questionsRepository: QuestionsRepository

  constructor(questionsRepository: QuestionsRepository) {
    this.questionsRepository = questionsRepository
  }

  async execute({
    authorId,
    title,
    content,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: UniqueEntityId.create(authorId),
      title,
      content,
    })

    await this.questionsRepository.create(question)

    return success({ question })
  }
}
