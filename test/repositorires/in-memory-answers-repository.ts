import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { AnswersRepository } from '../../src/domain/forum/application/repositories/answers-repository'
import { Answer } from '../../src/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  private _items: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this._items.push(answer)
  }

  async findById(id: string): Promise<Answer | null> {
    return this._items.find((item) => item.id.value === id) ?? null
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    return this._items
      .filter((item) => item.questionId.value === questionId)
      .slice((page - 1) * 20, page * 20)
  }

  async save(answer: Answer): Promise<void> {
    const itemToUpdateIndex = this._items.indexOf(answer)
    this._items[itemToUpdateIndex] = answer
  }

  async delete(answer: Answer): Promise<void> {
    const itemToDeleteIndex = this._items.indexOf(answer)
    this._items.splice(itemToDeleteIndex)
  }

  get items() {
    return this._items
  }
}
