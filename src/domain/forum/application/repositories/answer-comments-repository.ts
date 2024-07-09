import { PaginationParams } from '../../../../core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comments'

export type AnswerCommentsRepository = {
  create(answer: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>
  delete(answer: AnswerComment): Promise<void>
}
