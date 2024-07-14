import { InMemoryQuestionAttachmentRepository } from '../../../../../test/repositorires/in-memory-question-attachment-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let useCase: DeleteQuestionUseCase

describe('Delete Questions By Slug Tests', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )

    useCase = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('Should be able to delete a question', async () => {
    const newQuestion = Question.create(
      {
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
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
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0)
  })

  it('Should not be able to delete a question from another user', async () => {
    const newQuestion = Question.create(
      {
        content: 'New question',
        authorId: UniqueEntityId.create(),
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create(),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await useCase.execute({
      questionId: newQuestion.id.value,
      authorId: 'another-author-id',
    })

    expect(result.isError).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
