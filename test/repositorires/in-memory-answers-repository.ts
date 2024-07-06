import { AnswersRepository } from '../../src/domain/forum/application/repositories/answers-repository'
import { Answer } from '../../src/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  private _items: Answer[] = []

  async create(answer: Answer): Promise<void> {
    this._items.push(answer)
  }

  get items() {
    return this._items
  }
}
