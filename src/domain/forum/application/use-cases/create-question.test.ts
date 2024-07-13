import { InMemoryQuestionAttachmentRepository } from '../../../../../test/repositorires/in-memory-question-attachment-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { CreateQuestionUseCase } from './create-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let useCase: CreateQuestionUseCase

describe('Create Questions Tests', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )

    useCase = new CreateQuestionUseCase(questionsRepository)
  })

  it('Should be able to create an question', async () => {
    const result = await useCase.execute({
      content: 'New question',
      authorId: '1',
      title: 'Question',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(result).not.toBeNull()
    expect(result.value?.question.content).toEqual('New question')
    expect(result.value?.question.authorId).toBeInstanceOf(UniqueEntityId)
    expect(result.value?.question.slug).not.toBeNull()
    expect(questionsRepository.items.length).toBe(1)
    expect(questionsRepository.items[0].id).toEqual(result.value?.question.id)
    expect(questionsRepository.items[0].attachments?.currentItems).toHaveLength(
      2,
    )
  })
})
