import { InMemoryQuestionCommentsRepository } from '../../../../../test/repositorires/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from '../../../../../test/repositorires/in-memory-questions-repository'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { CommentOnQuestionUseCase } from './comment-on-question'

let questionsRepository: InMemoryQuestionsRepository
let questionCommentsRepository: InMemoryQuestionCommentsRepository
let useCase: CommentOnQuestionUseCase

describe('Comment On Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    useCase = new CommentOnQuestionUseCase(
      questionsRepository,
      questionCommentsRepository,
    )
  })

  it('Should be able to comment on question', async () => {
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

    await useCase.execute({
      authorId: question.authorId.value,
      questionId: question.id.value,
      content: 'comment',
    })

    expect(questionCommentsRepository.items).toHaveLength(1)
    expect(questionCommentsRepository.items[0].content).toEqual('comment')
  })
})
