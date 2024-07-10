import { Either, success } from '../../../../core/either'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

type FetchQuestionCommentsUseCaseRequest = {
  page: number
  questionId: string
}

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  private questionCommentsRepository: QuestionCommentsRepository

  constructor(questionCommentsRepository: QuestionCommentsRepository) {
    this.questionCommentsRepository = questionCommentsRepository
  }

  async execute({
    page,
    questionId,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      })

    return success({ questionComments })
  }
}
