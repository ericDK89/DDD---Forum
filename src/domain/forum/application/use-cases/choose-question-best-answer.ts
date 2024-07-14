import { Either, error, success } from '../../../../core/either'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

type ChooseQuestionBestAnswerQuestionUseCaseRequest = {
  answerId: string
  authorId: string
}

type ChooseQuestionBestAnswerQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    question: Question
  }
>

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
      return error(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.value,
    )

    if (!question) {
      return error(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return error(new NotAllowedError())
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return success({ question })
  }
}
