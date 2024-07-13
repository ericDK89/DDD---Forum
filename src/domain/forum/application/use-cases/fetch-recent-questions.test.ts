import { InMemoryQuestionAttachmentRepository } from '../../../../../test/repositorires/in-memory-question-attachment-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let repository: InMemoryQuestionsRepository
let useCase: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
    repository = new InMemoryQuestionsRepository(questionAttachmentsRepository)
    useCase = new FetchRecentQuestionsUseCase(repository)
  })

  it('Should be able to fetch recent questions', async () => {
    const questionOne = Question.create({
      content: 'New question',
      authorId: UniqueEntityId.create(),
      title: 'Question',
      slug: Slug.createFromText('Question'),
      createdAt: new Date('2023, 1, 22'),
    })

    const questionTwo = Question.create({
      content: 'New question',
      authorId: UniqueEntityId.create(),
      title: 'Question',
      slug: Slug.createFromText('Question'),
      createdAt: new Date('2023, 1, 21'),
    })

    const questionThree = Question.create({
      content: 'New question',
      authorId: UniqueEntityId.create(),
      title: 'Question',
      slug: Slug.createFromText('Question'),
      createdAt: new Date('2023, 1, 20'),
    })

    await repository.create(questionOne)
    await repository.create(questionTwo)
    await repository.create(questionThree)

    const result = await useCase.execute({
      page: 1,
    })

    expect(result.value?.questions).not.toBeNull()
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date('2023, 1, 22') }),
      expect.objectContaining({ createdAt: new Date('2023, 1, 21') }),
      expect.objectContaining({ createdAt: new Date('2023, 1, 20') }),
    ])
  })

  it('Should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      const question = Question.create({
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
        createdAt: new Date('2023, 1, 22'),
      })

      await repository.create(question)
    }

    const result = await useCase.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(2)
  })
})
