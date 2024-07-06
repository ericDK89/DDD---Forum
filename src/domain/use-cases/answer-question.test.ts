import { UniqueEntityId } from "../../core/entities/unique-entity-id"
import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { AnswerQuestionUseCase } from "./answer-question"

class FakeAnswersRepository implements AnswersRepository {
    async create(answer: Answer): Promise<void> {
        return
    }
}

describe("Answer Tests", () => {
    it("Should be able to create an answer", async () => {
        const fakeAnswersRepository = new FakeAnswersRepository()
        const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

        const response = await answerQuestion.execute({
            content: "New answer",
            instructorId: UniqueEntityId.create(),
            questionId: UniqueEntityId.create()
        })

        expect(response).not.toBeNull()
        expect(response.content).toEqual("New answer")
    })
})