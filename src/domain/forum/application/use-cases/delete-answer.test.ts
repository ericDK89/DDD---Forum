import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { DeleteAnswerUseCase } from './delete-answer'

let repository: InMemoryAnswersRepository
let useCase: DeleteAnswerUseCase

describe('Delete Answers', () => {
  beforeEach(() => {
    repository = new InMemoryAnswersRepository()
    useCase = new DeleteAnswerUseCase(repository)
  })

  it('Should be able to delete a answer', async () => {
    const newAnswer = Answer.create(
      {
        authorId: UniqueEntityId.create(),
        content: 'answer',
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create('answer-1'),
    )

    await repository.create(newAnswer)

    await useCase.execute({
      answerId: newAnswer.id.value,
      authorId: newAnswer.authorId.value,
    })

    expect(repository.items).toHaveLength(0)
  })

  it('Should not be able to delete a answer from another user', async () => {
    const newAnswer = Answer.create(
      {
        authorId: UniqueEntityId.create(),
        content: 'answer',
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create(),
    )

    await repository.create(newAnswer)

    await expect(
      useCase.execute({
        answerId: 'answer-1',
        authorId: 'another-author-id',
      }),
    ).rejects.toThrow(Error)
  })
})
