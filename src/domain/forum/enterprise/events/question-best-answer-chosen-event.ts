import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { DomainEvent } from '../../../../core/events/domain-event'
import { Question } from '../entities/question'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  ocurredAt: Date
  question: Question
  bestAnswerid: UniqueEntityId

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question
    this.bestAnswerid = bestAnswerId
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id
  }
}
