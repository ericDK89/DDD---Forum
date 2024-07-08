import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let repository: InMemoryAnswersRepository
let useCase: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    repository = new InMemoryAnswersRepository()
    useCase = new FetchQuestionAnswersUseCase(repository)
  })

  it('Should be able to fetch question answers', async () => {
    const question = Question.create({
      content: 'New question',
      authorId: UniqueEntityId.create(),
      title: 'Question',
      slug: Slug.createFromText('Question'),
      createdAt: new Date('2023, 1, 22'),
    })

    const answerOne = Answer.create({
      authorId: UniqueEntityId.create(),
      content: 'answer one',
      questionId: question.id,
    })

    repository.create(answerOne)

    const answerTwo = Answer.create({
      authorId: UniqueEntityId.create(),
      content: 'answer two',
      questionId: question.id,
    })

    repository.create(answerTwo)

    const answerThree = Answer.create({
      authorId: UniqueEntityId.create(),
      content: 'answer three',
      questionId: question.id,
    })

    repository.create(answerThree)

    const { answers } = await useCase.execute({
      questionId: question.id.value,
      page: 1,
    })

    expect(answers).not.toBeNull()
    expect(answers).toHaveLength(3)
  })

  it('Should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      const answer = Answer.create({
        authorId: UniqueEntityId.create(),
        content: 'answer three',
        questionId: UniqueEntityId.create('question-1'),
      })

      await repository.create(answer)
    }

    const { answers } = await useCase.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(answers).toHaveLength(2)
  })
})
