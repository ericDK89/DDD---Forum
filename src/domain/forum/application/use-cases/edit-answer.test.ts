import { InMemoryAnswerAttachmentRepository } from '../../../../../test/repositorires/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let repository: InMemoryAnswersRepository
let useCase: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()

    repository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )

    useCase = new EditAnswerUseCase(
      repository,
      inMemoryAnswerAttachmentRepository,
    )
  })

  it('Should be able to edit a answer', async () => {
    const newAnswer = Answer.create(
      {
        content: 'New answer',
        authorId: UniqueEntityId.create(),
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create('answer-1'),
    )

    await repository.create(newAnswer)

    inMemoryAnswerAttachmentRepository.items.push(
      AnswerAttachment.create({
        answerId: newAnswer.id,
        attachmentId: UniqueEntityId.create('1'),
      }),
      AnswerAttachment.create({
        answerId: newAnswer.id,
        attachmentId: UniqueEntityId.create('2'),
      }),
    )

    await useCase.execute({
      answerId: newAnswer.id.value,
      authorId: newAnswer.authorId.value,
      content: 'New Update answer',
      attachmentsIds: ['1', '2'],
    })

    expect(repository.items[0].content).toEqual('New Update answer')
    expect(repository.items[0].attachments?.currentItems).toHaveLength(2)
  })

  it('Should not be able to edit a answer from another user', async () => {
    const newAnswer = Answer.create(
      {
        content: 'New answer',
        authorId: UniqueEntityId.create(),
        questionId: UniqueEntityId.create(),
      },
      UniqueEntityId.create(),
    )

    await repository.create(newAnswer)

    const result = await useCase.execute({
      answerId: newAnswer.id.value,
      authorId: 'another-author-id',
      content: 'New Update answer',
      attachmentsIds: [],
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
