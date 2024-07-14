import { Either, success } from '../../../../core/either'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notifcation'
import { NotificationsRepository } from '../repositories/notifications-repository'

type SendNotificationUseCaseRequest = {
  recipientId: string
  title: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  private notificationsRepository: NotificationsRepository

  constructor(notificationsRepository: NotificationsRepository) {
    this.notificationsRepository = notificationsRepository
  }

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: UniqueEntityId.create(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return success({ notification })
  }
}
