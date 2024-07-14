import { InMemoryNotificationsRepository } from '../../../../../test/repositorires/in-memory-notifications-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notifcation'
import { ReadNotificationUseCase } from './read-notification'

let notificationsRepository: InMemoryNotificationsRepository
let useCase: ReadNotificationUseCase

describe('Send Notification Tests', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    useCase = new ReadNotificationUseCase(notificationsRepository)
  })

  it('Should be able to send a notification', async () => {
    const notification = Notification.create({
      recipientId: UniqueEntityId.create(),
      title: 'Notification title',
      content: 'notification example',
    })

    await notificationsRepository.create(notification)

    const result = await useCase.execute({
      notificationId: notification.id.value,
      recipientId: notification.recipientId.value,
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(notificationsRepository.items[0].readAt).toBeInstanceOf(Date)
  })
})
