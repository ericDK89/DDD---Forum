import { DomainEvents } from '../../../../core/events/domain-events'
import { EventHandler } from '../../../../core/events/event-handler'
import { QuestionsRepository } from '../../../forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '../../../forum/enterprise/events/answer-created-events'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  private questionsRepository: QuestionsRepository
  private sendNotification: SendNotificationUseCase

  constructor(
    questionsRepository: QuestionsRepository,
    sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
    this.questionsRepository = questionsRepository
    this.sendNotification = sendNotification
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.value,
    )

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.authorId.value,
        title: `New answer: ${question.title.substring(0, 40).concat('...')}`,
        content: answer.excerpt,
      })
    }
  }
}
