import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositorires/in-memory-question-comments-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let repository: InMemoryQuestionCommentsRepository
let useCase: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository()
    useCase = new FetchQuestionCommentsUseCase(repository)
  })

  it('Should be able to fetch question comments', async () => {
    const questionCommentOne = QuestionComment.create({
      authorId: UniqueEntityId.create(),
      content: 'question comment',
      questionId: UniqueEntityId.create('question-1'),
    })

    repository.create(questionCommentOne)

    const questionCommentTwo = QuestionComment.create({
      authorId: UniqueEntityId.create(),
      content: 'question comment',
      questionId: UniqueEntityId.create('question-1'),
    })

    repository.create(questionCommentTwo)

    const questionCommentThree = QuestionComment.create({
      authorId: UniqueEntityId.create(),
      content: 'question comment',
      questionId: UniqueEntityId.create('question-1'),
    })

    repository.create(questionCommentThree)

    expect(repository.items).toHaveLength(3)
  })

  it('Should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      const questionComment = QuestionComment.create({
        authorId: UniqueEntityId.create(),
        content: 'question comment',
        questionId: UniqueEntityId.create('question-1'),
      })

      await repository.create(questionComment)
    }

    const { questionComments } = await useCase.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(questionComments).toHaveLength(2)
  })
})
