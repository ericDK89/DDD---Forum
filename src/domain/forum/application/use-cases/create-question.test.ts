import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'

let repository: InMemoryQuestionsRepository
let useCase: CreateQuestionUseCase

describe('Questions Tests', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    useCase = new CreateQuestionUseCase(repository)
  })

  it('Should be able to create an question', async () => {
    const { question } = await useCase.execute({
      content: 'New question',
      authorId: '1',
      title: 'Question',
    })

    expect(question).not.toBeNull()
    expect(question.content).toEqual('New question')
    expect(question.authorId).toBeInstanceOf(UniqueEntityId)
    expect(question.slug).not.toBeNull()
    expect(repository.items.length).toBe(1)
    expect(repository.items[0].id).toEqual(question.id)
  })
})
