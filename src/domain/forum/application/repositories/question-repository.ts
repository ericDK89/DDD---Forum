import { Question } from '../../enterprise/entities/question'

export type QuestionsRepository = {
  create(question: Question): Promise<void>
}
