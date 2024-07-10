import { Either, error, success } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type CommentOnQuestionUseCaseRequest = {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  private questionsRepository: QuestionsRepository
  private questionCommentsRepository: QuestionCommentsRepository

  constructor(
    questionsRepository: QuestionsRepository,
    questionCommentsRepository: QuestionCommentsRepository,
  ) {
    this.questionsRepository = questionsRepository
    this.questionCommentsRepository = questionCommentsRepository
  }

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return error(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: UniqueEntityId.create(authorId),
      questionId: UniqueEntityId.create(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return success({ questionComment })
  }
}
