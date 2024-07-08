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
    const { answer } = await useCase.execute({
      content: 'New answer',
      instructorId: UniqueEntityId.create(),
      questionId: UniqueEntityId.create(),
    })

    expect(answer.id).toBeInstanceOf(UniqueEntityId)
    expect(answer.content).toEqual('New answer')
    expect(repository.items.length).toBe(1)
    expect(repository.items[0].id).toEqual(answer.id)
  })
})
