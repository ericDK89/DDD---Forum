import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

type ChooseQuestionBestAnswerQuestionUseCaseRequest = {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerQuestionUseCaseResponse = {
  question: Question
}

export class ChooseQuestionBestAnswerQuestionUseCase {
  private questionsRepository: QuestionsRepository
  private answersRepository: AnswersRepository

  constructor(
    questionsRepository: QuestionsRepository,
    answersRepository: AnswersRepository,
  ) {
    this.questionsRepository = questionsRepository
    this.answersRepository = answersRepository
  }

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerQuestionUseCaseRequest): Promise<ChooseQuestionBestAnswerQuestionUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Not found')
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.value,
    )

    if (!question) {
      throw new Error('Not found')
    }

    if (authorId !== question.authorId.value) {
      throw new Error('Not allowed')
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
