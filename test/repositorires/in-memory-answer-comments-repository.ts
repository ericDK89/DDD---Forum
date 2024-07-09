import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '../../src/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '../../src/domain/forum/enterprise/entities/answer-comments'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  private _items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this._items.push(answerComment)
  }

  async findById(id: string) {
    return this._items.find((item) => item.id.value === id) ?? null
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemToDeleteIndex = this._items.indexOf(answerComment)
    this._items.splice(itemToDeleteIndex)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    return this._items
      .filter((item) => item.answerId.value === answerId)
      .slice((page - 1) * 20, page * 20)
  }

  get items() {
    return this._items
  }
}
