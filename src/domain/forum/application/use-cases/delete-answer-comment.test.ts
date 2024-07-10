import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositorires/in-memory-answer-comments-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comments'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let repository: InMemoryAnswerCommentsRepository
let useCase: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    repository = new InMemoryAnswerCommentsRepository()
    useCase = new DeleteAnswerCommentUseCase(repository)
  })

  it('Should be able to delete own answer comment', async () => {
    const answer = AnswerComment.create({
      authorId: UniqueEntityId.create(),
      content: 'answer',
      answerId: UniqueEntityId.create(),
    })

    await repository.create(answer)

    await useCase.execute({
      authorId: answer.authorId.value,
      answerCommentId: answer.id.value,
    })

    expect(repository.items).toHaveLength(0)
  })

  it('Should be not able to delete others answer comment', async () => {
    const answer = AnswerComment.create({
      authorId: UniqueEntityId.create(),
      content: 'answer',
      answerId: UniqueEntityId.create(),
    })

    await repository.create(answer)

    const result = await useCase.execute({
      authorId: 'other-author-id',
      answerCommentId: answer.id.value,
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
