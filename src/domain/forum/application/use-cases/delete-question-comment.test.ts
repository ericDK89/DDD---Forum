import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositorires/in-memory-question-comments-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { NotAllowedError } from './errors/not-allowed-error'

let repository: InMemoryQuestionCommentsRepository
let useCase: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
  beforeEach(() => {
    repository = new InMemoryQuestionCommentsRepository()
    useCase = new DeleteQuestionCommentUseCase(repository)
  })

  it('Should be able to delete own question comment', async () => {
    const question = QuestionComment.create({
      authorId: UniqueEntityId.create(),
      content: 'question',
      questionId: UniqueEntityId.create(),
    })

    await repository.create(question)

    await useCase.execute({
      authorId: question.authorId.value,
      questionCommentId: question.id.value,
    })

    expect(repository.items).toHaveLength(0)
  })

  it('Should be not able to delete others question comment', async () => {
    const question = QuestionComment.create({
      authorId: UniqueEntityId.create(),
      content: 'question',
      questionId: UniqueEntityId.create(),
    })

    await repository.create(question)

    const result = await useCase.execute({
      authorId: 'other-author-id',
      questionCommentId: question.id.value,
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
