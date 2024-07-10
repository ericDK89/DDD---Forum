import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let repository: InMemoryAnswersRepository
let useCase: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    repository = new InMemoryAnswersRepository()
    useCase = new EditAnswerUseCase(repository)
  })

  it('Should be able to edit a answer', async () => {
    const newAnswer = Answer.create(
      {
        content: 'New answer',
        authorId: UniqueEntityId.create(),
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create('answer-1'),
    )

    await repository.create(newAnswer)

    await useCase.execute({
      answerId: newAnswer.id.value,
      authorId: newAnswer.authorId.value,
      content: 'New Update answer',
    })

    expect(repository.items[0].content).toEqual('New Update answer')
  })

  it('Should not be able to edit a answer from another user', async () => {
    const newAnswer = Answer.create(
      {
        content: 'New answer',
        authorId: UniqueEntityId.create(),
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create(),
    )

    await repository.create(newAnswer)

    const result = await useCase.execute({
      answerId: newAnswer.id.value,
      authorId: 'another-author-id',
      content: 'New Update answer',
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
