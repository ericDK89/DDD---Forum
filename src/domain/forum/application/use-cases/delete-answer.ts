import { AnswersRepository } from '../repositories/answers-repository'

type DeleteAnswerUseCaseRequest = {
  authorId: string
  answerId: string
}

export class DeleteAnswerUseCase {
  private answersRepository: AnswersRepository

  constructor(answersRepository: AnswersRepository) {
    this.answersRepository = answersRepository
  }

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (authorId !== answer.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.answersRepository.delete(answer)
  }
}
