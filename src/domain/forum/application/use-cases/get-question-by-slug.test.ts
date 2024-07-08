import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let repository: InMemoryQuestionsRepository
let useCase: GetQuestionBySlugUseCase

describe('Get Questions By Slug Tests', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionsRepository()
    useCase = new GetQuestionBySlugUseCase(repository)
  })

  it('Should be able to get a question by slug', async () => {
    const newQuestion = Question.create({
      content: 'New question',
      authorId: UniqueEntityId.create(),
      title: 'Question',
      slug: Slug.createFromText('Question'),
    })

    await repository.create(newQuestion)

    const { question } = await useCase.execute({
      slug: 'question',
    })

    expect(question).not.toBeNull()
    expect(question!.title).toEqual(newQuestion.title)
  })
})
