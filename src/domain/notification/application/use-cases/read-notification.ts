import { Either, error, success } from '../../../../core/either'
import { NotAllowedError } from '../../../../core/errors/not-allowed-error'
import { ResourceNotFoundError } from '../../../../core/errors/resource-not-found-error'
import { Notification } from '../../enterprise/entities/notifcation'
import { NotificationsRepository } from '../repositories/notifications-repository'

type ReadNotificationUseCaseRequest = {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  private notificationsRepository: NotificationsRepository

  constructor(notificationsRepository: NotificationsRepository) {
    this.notificationsRepository = notificationsRepository
  }

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return error(new ResourceNotFoundError())
    }

    if (recipientId !== notification.recipientId.value) {
      return error(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return success({ notification })
  }
}
