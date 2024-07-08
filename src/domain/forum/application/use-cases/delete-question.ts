import { QuestionsRepository } from '../repositories/questions-repository'

type DeleteQuestionUseCaseRequest = {
  authorId: string
  questionId: string
}

export class DeleteQuestionUseCase {
  private questionsRepository: QuestionsRepository

  constructor(questionsRepository: QuestionsRepository) {
    this.questionsRepository = questionsRepository
  }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (authorId !== question.authorId.value) {
      throw new Error('Not allowed')
    }

    await this.questionsRepository.delete(question)
  }
}
