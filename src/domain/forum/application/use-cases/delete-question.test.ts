import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { DeleteQuestionUseCase } from './delete-question'

let repository: InMemoryQuestionsRepository
let useCase: DeleteQuestionUseCase

describe('Delete Questions By Slug Tests', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    useCase = new DeleteQuestionUseCase(repository)
  })

  it('Should be able to delete a question', async () => {
    const newQuestion = Question.create(
      {
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create('question-1'),
    )

    await repository.create(newQuestion)

    await useCase.execute({
      questionId: newQuestion.id.value,
      authorId: newQuestion.authorId.value,
    })

    expect(repository.items).toHaveLength(0)
  })

  it('Should not be able to delete a question from another user', async () => {
    const newQuestion = Question.create(
      {
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create(),
    )

    await repository.create(newQuestion)

    await expect(
      useCase.execute({
        questionId: 'question-1',
        authorId: 'another-author-id',
      }),
    ).rejects.toThrow(Error)
  })
})
