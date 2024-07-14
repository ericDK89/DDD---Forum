import { NotificationsRepository } from '../../src/domain/notification/application/repositories/notifications-repository'
import { Notification } from '../../src/domain/notification/enterprise/entities/notifcation'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async findById(id: string): Promise<Notification | null> {
    return this.items.find((item) => item.id.value === id) ?? null
  }

  async save(notification: Notification): Promise<void> {
    const itemToUpdateIndex = this.items.indexOf(notification)
    this.items[itemToUpdateIndex] = notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }
}
