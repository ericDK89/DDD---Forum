import { Either, error, success } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'

type EditAnswerUseCaseRequest = {
  authorId: string
  content: string
  answerId: string
  attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  private answersRepository: AnswersRepository
  private answerAttachmentsRepository: AnswerAttachmentsRepository

  constructor(
    answersRepository: AnswersRepository,
    answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {
    this.answersRepository = answersRepository
    this.answerAttachmentsRepository = answerAttachmentsRepository
  }

  async execute({
    content,
    answerId,
    authorId,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return error(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.value) {
      return error(new NotAllowedError())
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    const answerAttachments = attachmentsIds.map((id) => {
      return AnswerAttachment.create({
        attachmentId: UniqueEntityId.create(id),
        answerId: answer.id,
      })
    })

    answerAttachmentList.update(answerAttachments)

    answer.attachments = answerAttachmentList
    answer.content = content

    await this.answersRepository.save(answer)

    return success({ answer })
  }
}
