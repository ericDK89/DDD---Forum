import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

type DeleteAnswerCommentUseCaseRequest = {
  authorId: string
  answerCommentId: string
}

export class DeleteAnswerCommentUseCase {
  private answerCommentsRepository: AnswerCommentsRepository

  constructor(answerCommentsRepository: AnswerCommentsRepository) {
    this.answerCommentsRepository = answerCommentsRepository
  }

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<void> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      throw new Error('Not found')
    }

    if (answerComment.authorId.value !== authorId) {
      throw new Error('Not allowed')
    }

    await this.answerCommentsRepository.delete(answerComment)
  }
}
