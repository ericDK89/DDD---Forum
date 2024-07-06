import { Answer } from '../../enterprise/entities/answer'

export type AnswersRepository = {
  create(answer: Answer): Promise<void>
}
