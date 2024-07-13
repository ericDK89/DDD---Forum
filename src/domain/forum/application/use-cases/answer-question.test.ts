import { InMemoryAnswerAttachmentRepository } from '../../../../../test/repositorires/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let repository: InMemoryAnswersRepository
let useCase: AnswerQuestionUseCase

describe('Answers Questions Tests', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()

    repository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )

    useCase = new AnswerQuestionUseCase(repository)
  })

  it('Should be able to create an answer', async () => {
    const result = await useCase.execute({
      content: 'New answer',
      instructorId: '1',
      questionId: '1',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isSuccess).toBeTruthy()
    expect(result.value?.answer.id).toBeInstanceOf(UniqueEntityId)
    expect(result.value?.answer.content).toEqual('New answer')
    expect(repository.items.length).toBe(1)
    expect(repository.items[0].id).toEqual(result.value?.answer.id)
    expect(repository.items[0].id).toEqual(result.value?.answer.id)
    expect(repository.items[0].attachments?.currentItems).toHaveLength(2)
  })
})
