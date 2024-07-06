import { UniqueEntityId } from "../../core/entities/unique-entity-id"
import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

type AnswerQuestionUseCaseRequest = {
    instructorId: UniqueEntityId,
    questionId: UniqueEntityId,
    content: string
}

export class AnswerQuestionUseCase {
    constructor(private answerRepository: AnswersRepository) { }

    async execute({ instructorId, questionId, content }: AnswerQuestionUseCaseRequest) {
        const answer = Answer.create({
            authorId: instructorId,
            questionId,
            content,
        })

        this.answerRepository.create(answer)

        return answer
    }
}