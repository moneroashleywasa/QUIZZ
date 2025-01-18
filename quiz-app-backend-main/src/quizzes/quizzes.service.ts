import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuizStatus } from '@prisma/client';

@Injectable()
export class QuizzesService {
    constructor(private prisma: PrismaService) {}

    // POST /quizzes: Create a new quiz
    async createQuiz(userId: string, data: {
        title: string;
        description?: string;
        questions: {
            text: string;
            options: string[];
            correctAnswer: string[];
            mediaUrl?: string;
        }[];
        settings: {
            timeLimit?: number;
            pointsPerQuestion?: number;
            randomizeQuestions?: boolean;
        };
    }) {
        const quiz = await this.prisma.quiz.create({
            data: {
                title: data.title,
                description: data.description,
                creatorId: userId,
                settings: data.settings,
                status: QuizStatus.DRAFT,
                questions: {
                    create: data.questions.map(q => ({
                        text: q.text,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        mediaUrl: q.mediaUrl
                    }))
                }
            },
            include: {
                questions: true
            }
        });
        return quiz;
    }

    // PUT /quizzes/:id: Update an existing quiz
    async updateQuiz(quizId: string, userId: string, data: {
        title?: string;
        description?: string;
        questions?: {
            id?: string;
            text: string;
            options: string[];
            correctAnswer: string[];
            mediaUrl?: string;
        }[];
        settings?: {
            timeLimit?: number;
            pointsPerQuestion?: number;
            randomizeQuestions?: boolean;
        };
        status?: QuizStatus;
    }) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });

        if (!quiz) throw new NotFoundException('Quiz not found');
        if (quiz.creatorId !== userId) throw new BadRequestException('Not authorized to update this quiz');

        // Update questions if provided
        if (data.questions) {
            await this.prisma.question.deleteMany({
                where: { quizId }
            });

            await this.prisma.question.createMany({
                data: data.questions.map(q => ({
                    quizId,
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    mediaUrl: q.mediaUrl
                }))
            });
        }

        return await this.prisma.quiz.update({
            where: { id: quizId },
            data: {
                title: data.title,
                description: data.description,
                settings: data.settings,
                status: data.status,
            },
            include: {
                questions: true
            }
        });
    }

    // DELETE /quizzes/:id: Delete a quiz
    async deleteQuiz(quizId: string, userId: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId }
        });

        if (!quiz) throw new NotFoundException('Quiz not found');
        if (quiz.creatorId !== userId) throw new BadRequestException('Not authorized to delete this quiz');

        await this.prisma.quiz.delete({
            where: { id: quizId }
        });

        return { message: 'Quiz deleted successfully' };
    }

    // GET /quizzes: List all quizzes
    async getAllQuizzes(filters?: {
        status?: QuizStatus;
        creatorId?: string;
    }) {
        return await this.prisma.quiz.findMany({
            where: {
                ...filters,
                status: filters?.status || QuizStatus.PUBLISHED
            },
            include: {
                creator: {
                    select: {
                        username: true
                    }
                },
                _count: {
                    select: {
                        questions: true
                    }
                }
            }
        });
    }

    // GET /quizzes/:id: Retrieve a specific quiz's details
    async getQuizById(quizId: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: true,
                creator: {
                    select: {
                        username: true
                    }
                }
            }
        });

        if (!quiz) throw new NotFoundException('Quiz not found');
        return quiz;
    }

    // Attempt quiz implementation
    async attemptQuiz(userId: string, quizId: string, data: {
        answers: { questionId: string; selectedOptions: string[] }[];
        timeTaken: number;
    }) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true }
        });

        if (!quiz) throw new NotFoundException('Quiz not found');

        // Calculate score
        let score = 0;
        const settings = quiz.settings as { pointsPerQuestion: number };
        const pointsPerQuestion = settings.pointsPerQuestion || 1;

        data.answers.forEach(answer => {
            const question = quiz.questions.find(q => q.id === answer.questionId);
            if (question) {
                const correctAnswers = question.correctAnswer as string[];
                const isCorrect = JSON.stringify(answer.selectedOptions.sort()) === JSON.stringify(correctAnswers.sort());
                if (isCorrect) score += pointsPerQuestion;
            }
        });

        // Create result
        const result = await this.prisma.result.create({
            data: {
                userId,
                quizId,
                score,
                answers: data.answers,
                timeTaken: data.timeTaken
            }
        });

        // Update leaderboard
        await this.updateLeaderboard(quizId);

        return result;
    }

    // Get rankings implementation
    async getRankings(quizId: string) {
        return await this.prisma.leaderboard.findMany({
            where: { quizId },
            include: {
                user: {
                    select: {
                        username: true
                    }
                }
            },
            orderBy: {
                score: 'desc'
            }
        });
    }

    private async updateLeaderboard(quizId: string) {
        const results = await this.prisma.result.findMany({
            where: { quizId },
            orderBy: {
                score: 'desc'
            },
            select: {
                userId: true,
                score: true
            }
        });

        // Update leaderboard entries with new rankings
        for (let i = 0; i < results.length; i++) {
            await this.prisma.leaderboard.upsert({
                where: {
                    quizId_userId: {
                        quizId,
                        userId: results[i].userId
                    }
                },
                update: {
                    score: results[i].score,
                    rank: i + 1
                },
                create: {
                    quizId,
                    userId: results[i].userId,
                    score: results[i].score,
                    rank: i + 1
                }
            });
        }
    }
}