/* eslint-disable no-new */
import { InMemoryAnswerAttachmentRepository } from '../../../../../test/repositorires/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { InMemoryNotificationsRepository } from '../../../../../test/repositorires/in-memory-notifications-repository'
import { InMemoryQuestionAttachmentRepository } from '../../../../../test/repositorires/in-memory-question-attachment-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { waitFor } from '../../../../../test/utils/wait-for'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../../forum/enterprise/entities/answer'
import { Question } from '../../../forum/enterprise/entities/question'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sendNotificationExecuteSpy: any

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentRepository =
      new InMemoryAnswerAttachmentRepository()

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentRepository,
    )

    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentRepository()

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = jest.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })
  it('Should send a notification when question has new best answer', async () => {
    const question = Question.create({
      authorId: UniqueEntityId.create(),
      content: 'question example',
      title: 'Question title',
    })

    inMemoryQuestionsRepository.create(question)

    const answer = Answer.create({
      authorId: UniqueEntityId.create(),
      content: 'answer content',
      questionId: question.id,
    })

    inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
