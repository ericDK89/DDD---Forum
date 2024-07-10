import { Either, error, success } from '../../../../core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from './errors/not-allowed-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type DeleteQuestionUseCaseRequest = {
  authorId: string
  questionId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class DeleteQuestionUseCase {
  private questionsRepository: QuestionsRepository

  constructor(questionsRepository: QuestionsRepository) {
    this.questionsRepository = questionsRepository
  }

  async execute({
    questionId,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return error(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return error(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return success({})
  }
}
