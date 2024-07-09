import { PaginationParams } from '../../../../core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comments'

export type QuestionCommentsRepository = {
  create(question: QuestionComment): Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]>
  findById(id: string): Promise<QuestionComment | null>
  delete(question: QuestionComment): Promise<void>
}
