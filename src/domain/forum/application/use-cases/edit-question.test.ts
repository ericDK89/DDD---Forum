import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from './errors/not-allowed-error'

let repository: InMemoryQuestionsRepository
let useCase: EditQuestionUseCase

describe('Edit Questions', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    useCase = new EditQuestionUseCase(repository)
  })

  it('Should be able to edit a question', async () => {
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
      content: 'New Update question',
      title: 'Update Question',
    })

    expect(repository.items[0].content).toEqual('New Update question')
    expect(repository.items[0].title).toEqual('Update Question')
  })

  it('Should not be able to edit a question from another user', async () => {
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

    const result = await useCase.execute({
      questionId: newQuestion.id.value,
      authorId: 'another-author-id',
      content: 'New Update question',
      title: 'Update Question',
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
