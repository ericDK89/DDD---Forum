import { InMemoryQuestionAttachmentRepository } from '../../../../../test/repositorires/in-memory-question-attachment-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { EditQuestionUseCase } from './edit-question'

let questionsRepository: InMemoryQuestionsRepository
let questionAttachmentsRepository: InMemoryQuestionAttachmentRepository
let useCase: EditQuestionUseCase

describe('Edit Questions', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentRepository()

    questionsRepository = new InMemoryQuestionsRepository(
      questionAttachmentsRepository,
    )

    useCase = new EditQuestionUseCase(
      questionsRepository,
      questionAttachmentsRepository,
    )
  })

  it('Should be able to edit a question', async () => {
    const newQuestion = Question.create(
      {
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create('question-1'),
    )

    await questionsRepository.create(newQuestion)

    questionAttachmentsRepository.items.push(
      QuestionAttachment.create({
        quetionsId: newQuestion.id,
        attachmentId: UniqueEntityId.create('1'),
      }),
      QuestionAttachment.create({
        quetionsId: newQuestion.id,
        attachmentId: UniqueEntityId.create('2'),
      }),
    )

    await useCase.execute({
      questionId: newQuestion.id.value,
      authorId: newQuestion.authorId.value,
      content: 'New Update question',
      title: 'Update Question',
      attachmentsIds: ['1', '3'],
    })

    expect(questionsRepository.items[0].content).toEqual('New Update question')
    expect(questionsRepository.items[0].title).toEqual('Update Question')
    expect(questionsRepository.items[0].attachments?.currentItems).toHaveLength(
      2,
    )
  })

  it('Should not be able to edit a question from another user', async () => {
    const newQuestion = Question.create(
      {
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create(),
    )

    await questionsRepository.create(newQuestion)

    const result = await useCase.execute({
      questionId: newQuestion.id.value,
      authorId: 'another-author-id',
      content: 'New Update question',
      title: 'Update Question',
      attachmentsIds: [],
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
