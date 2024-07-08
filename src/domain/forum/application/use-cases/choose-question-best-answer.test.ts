import { InMemoryAnswersRepository } from '../../../../../test/repositorires/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { ChooseQuestionBestAnswerQuestionUseCase } from './choose-question-best-answer'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let useCase: ChooseQuestionBestAnswerQuestionUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    useCase = new ChooseQuestionBestAnswerQuestionUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('Should be able to choose question best answer', async () => {
    const question = Question.create(
      {
        authorId: UniqueEntityId.create(),
        content: 'question',
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create('question-1'),
    )

    await questionsRepository.create(question)

    const answer = Answer.create({
      authorId: UniqueEntityId.create(),
      content: 'answer',
      questionId: question.id,
    })

    await answersRepository.create(answer)

    await useCase.execute({
      answerId: answer.id.value,
      authorId: question.authorId.value,
    })

    expect(questionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('Should not be able to choose another user question best answer', async () => {
    const question = Question.create(
      {
        authorId: UniqueEntityId.create(),
        content: 'question',
        title: 'Question',
        slug: Slug.createFromText('Question'),
      },
      UniqueEntityId.create('question-1'),
    )

    await questionsRepository.create(question)

    const answer = Answer.create({
      authorId: UniqueEntityId.create(),
      content: 'answer',
      questionId: question.id,
    })

    await answersRepository.create(answer)

    await expect(
      useCase.execute({
        answerId: answer.id.value,
        authorId: 'another-author-id',
      }),
    ).rejects.toThrow(Error)
  })
})
