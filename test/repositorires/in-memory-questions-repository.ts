import { QuestionsRepository } from '../../src/domain/forum/application/repositories/question-repository'
import { Question } from '../../src/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private _items: Question[] = []

  async create(question: Question): Promise<void> {
    this._items.push(question)
  }

  get items() {
    return this._items
  }
}
