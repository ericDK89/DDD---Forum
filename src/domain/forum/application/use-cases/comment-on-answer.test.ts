import { InMemoryAnswerCommentsRepository } from '../../../../../test/repositorires/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { CommentOnAnswerUseCase } from './comment-on-answer'

let answersRepository: InMemoryAnswersRepository
let answerCommentsRepository: InMemoryAnswerCommentsRepository
let useCase: CommentOnAnswerUseCase

describe('Comment On Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    useCase = new CommentOnAnswerUseCase(
      answersRepository,
      answerCommentsRepository,
    )
  })

  it('Should be able to comment on answer', async () => {
    const answer = Answer.create(
      {
        authorId: UniqueEntityId.create(),
        content: 'answer',
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create('answer-1'),
    )

    await answersRepository.create(answer)

    await useCase.execute({
      authorId: answer.authorId.value,
      answerId: answer.id.value,
      content: 'comment',
    })

    expect(answerCommentsRepository.items).toHaveLength(1)
    expect(answerCommentsRepository.items[0].content).toEqual('comment')
  })
})
