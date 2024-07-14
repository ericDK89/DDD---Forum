import { Either, error, success } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { AnswerComment } from '../../enterprise/entities/answer-comments'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

type CommentOnAnswerUseCaseRequest = {
  authorId: string
  answerId: string
  content: string
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  private answersRepository: AnswersRepository
  private answerCommentsRepository: AnswerCommentsRepository

  constructor(
    answersRepository: AnswersRepository,
    answerCommentsRepository: AnswerCommentsRepository,
  ) {
    this.answersRepository = answersRepository
    this.answerCommentsRepository = answerCommentsRepository
  }

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return error(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: UniqueEntityId.create(authorId),
      answerId: UniqueEntityId.create(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return success({ answerComment })
  }
}
