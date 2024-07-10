import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositorires/in-memory-answer-comments-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comments'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let repository: InMemoryAnswerCommentsRepository
let useCase: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository()
    useCase = new FetchAnswerCommentsUseCase(repository)
  })

  it('Should be able to fetch answer comments', async () => {
    const answerCommentOne = AnswerComment.create({
      authorId: UniqueEntityId.create(),
      content: 'answer comment',
      answerId: UniqueEntityId.create('answer-1'),
    })

    repository.create(answerCommentOne)

    const answerCommentTwo = AnswerComment.create({
      authorId: UniqueEntityId.create(),
      content: 'answer comment',
      answerId: UniqueEntityId.create('answer-1'),
    })

    repository.create(answerCommentTwo)

    const answerCommentThree = AnswerComment.create({
      authorId: UniqueEntityId.create(),
      content: 'answer comment',
      answerId: UniqueEntityId.create('answer-1'),
    })

    repository.create(answerCommentThree)

    expect(repository.items).toHaveLength(3)
  })

  it('Should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      const answerComment = AnswerComment.create({
        authorId: UniqueEntityId.create(),
        content: 'answer comment',
        answerId: UniqueEntityId.create('answer-1'),
      })

      await repository.create(answerComment)
    }

    const result = await useCase.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.value?.answerComments).toHaveLength(2)
  })
})
