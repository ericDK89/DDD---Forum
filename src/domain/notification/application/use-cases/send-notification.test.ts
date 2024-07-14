import { InMemoryNotificationsRepository } from '../../../../../test/repositorires/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let notificationsRepository: InMemoryNotificationsRepository
let useCase: SendNotificationUseCase

describe('Send Notification Tests', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    useCase = new SendNotificationUseCase(notificationsRepository)
  })

  it('Should be able to send a notification', async () => {
    const result = await useCase.execute({
      content: 'New question',
      recipientId: '1',
      title: 'Question',
    })

    expect(result.isSuccess()).toBeTruthy()
    expect(notificationsRepository.items[0].content).toEqual(
      result.value?.notification.content,
    )
  })
})
