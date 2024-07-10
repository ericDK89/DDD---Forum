import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'

let repository: InMemoryQuestionsRepository
let useCase: CreateQuestionUseCase

describe('Create Questions Tests', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    useCase = new CreateQuestionUseCase(repository)
  })

  it('Should be able to create an question', async () => {
    const result = await useCase.execute({
      content: 'New question',
      authorId: '1',
      title: 'Question',
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result).not.toBeNull()
    expect(result.value?.question.content).toEqual('New question')
    expect(result.value?.question.authorId).toBeInstanceOf(UniqueEntityId)
    expect(result.value?.question.slug).not.toBeNull()
    expect(repository.items.length).toBe(1)
    expect(repository.items[0].id).toEqual(result.value?.question.id)
  })
})
