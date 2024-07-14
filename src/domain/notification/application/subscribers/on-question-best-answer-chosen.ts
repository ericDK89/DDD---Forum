import { DomainEvents } from '../../../../core/events/domain-events'
import { EventHandler } from '../../../../core/events/event-handler'
import { AnswersRepository } from '../../../forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '../../../forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  private answersRepository: AnswersRepository
  private sendNotification: SendNotificationUseCase

  constructor(
    answersRepository: AnswersRepository,
    sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
    this.answersRepository = answersRepository
    this.sendNotification = sendNotification
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerid,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerid.value)

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.value,
        title: 'Answer was chosen!',
        content: `The answer that you have send in "${question.title.substring(0, 20).concat('...')} was chosen!`,
      })
    }
  }
}
