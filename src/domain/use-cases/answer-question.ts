import { UniqueEntityId } from '../../core/entities/unique-entity-id'
import { Answer } from '../entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

type AnswerQuestionUseCaseRequest = {
  instructorId: UniqueEntityId
  questionId: UniqueEntityId
  content: string
}

export class AnswerQuestionUseCase {
  private answerRepository: AnswersRepository

  constructor(answerRepository: AnswersRepository) {
    this.answerRepository = answerRepository
  }

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest) {
    const answer = Answer.create({
      content,
      authorId: instructorId,
      questionId,
    })

    this.answerRepository.create(answer)

    return answer
  }
}
