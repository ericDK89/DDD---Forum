import { Answer } from '../entities/answer'

export type AnswersRepository = {
  create(answer: Answer): Promise<void>
}
