import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'

let repository: InMemoryAnswersRepository
let useCase: AnswerQuestionUseCase

describe('Answers Questions Tests', () => {
  beforeEach(() => {
    repository = new InMemoryAnswersRepository()
    useCase = new AnswerQuestionUseCase(repository)
  })

  it('Should be able to create an answer', async () => {
    const result = await useCase.execute({
      content: 'New answer',
      instructorId: UniqueEntityId.create(),
      questionId: UniqueEntityId.create(),
    })

    expect(result.isSuccess).toBeTruthy()
    expect(result.value?.answer.id).toBeInstanceOf(UniqueEntityId)
    expect(result.value?.answer.content).toEqual('New answer')
    expect(repository.items.length).toBe(1)
    expect(repository.items[0].id).toEqual(result.value?.answer.id)
  })
})
