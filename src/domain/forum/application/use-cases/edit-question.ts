import { Either, error, success } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Question } from '../../enterprise/entities/question'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

type EditQuestionUseCaseRequest = {
  authorId: string
  title: string
  content: string
  questionId: string
  attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  private questionsRepository: QuestionsRepository
  private questionAttachmentsRepository: QuestionAttachmentsRepository

  constructor(
    questionsRepository: QuestionsRepository,
    questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {
    this.questionsRepository = questionsRepository
    this.questionAttachmentsRepository = questionAttachmentsRepository
  }

  async execute({
    title,
    content,
    questionId,
    authorId,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return error(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.value) {
      return error(new NotAllowedError())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: UniqueEntityId.create(id),
        quetionsId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.attachments = questionAttachmentList
    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return success({ question })
  }
}
