import { PaginationParams } from '../../src/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '../../src/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '../../src/domain/forum/application/repositories/questions-repository'
import { Question } from '../../src/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  private _items: Question[] = []
  private questionAttachmentsRepository: QuestionAttachmentsRepository

  constructor(questionAttachmentsRepository: QuestionAttachmentsRepository) {
    this.questionAttachmentsRepository = questionAttachmentsRepository
  }

  async create(question: Question) {
    this._items.push(question)
  }

  async findBySlug(slug: string) {
    return this._items.find((item) => item.slug === slug) ?? null
  }

  async findById(questionId: string) {
    return this._items.find((item) => item.id.value === questionId) ?? null
  }

  async save(question: Question): Promise<void> {
    const itemToUpdateIndex = this._items.indexOf(question)
    this._items[itemToUpdateIndex] = question
  }

  async findManyRecent({ page }: PaginationParams) {
    return this._items
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())
      .slice((page - 1) * 20, page * 20)
  }

  async delete(question: Question) {
    const itemToDeleteIndex = this._items.indexOf(question)
    this._items.splice(itemToDeleteIndex, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.value)
  }

  get items() {
    return this._items
  }
}
