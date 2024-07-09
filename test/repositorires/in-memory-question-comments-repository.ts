import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '../../src/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '../../src/domain/forum/enterprise/entities/question-comments'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  private _items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this._items.push(questionComment)
  }

  get items() {
    return this._items
  }

  async findById(id: string) {
    return this._items.find((item) => item.id.value === id) ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this._items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemToDeleteIndex = this._items.indexOf(questionComment)
    this._items.splice(itemToDeleteIndex)
  }
}
