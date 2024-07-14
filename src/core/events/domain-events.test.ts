import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events test', () => {
  it('Should be able to dispatch and listen to events', () => {
    const callback = jest.fn()
    DomainEvents.register(callback, CustomAggregateCreated.name)

    const aggregate = CustomAggregate.create()

    expect(aggregate.domainEvents).toHaveLength(1)

    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    expect(callback).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
