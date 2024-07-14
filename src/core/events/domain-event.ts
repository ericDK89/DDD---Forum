import { UniqueEntityId } from '../entities/unique-entity-id'

export type DomainEvent = {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
