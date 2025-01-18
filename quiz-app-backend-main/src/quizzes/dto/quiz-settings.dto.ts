import { IsBoolean, IsNumber, IsOptional, Max, Min } from "class-validator";

export class QuizSettingsDto {
    @IsNumber()
    @IsOptional()
    @Min(60)
    @Max(7200)
    timeLimit?: number;

    @IsNumber()
    @IsOptional()
    @Min(1)
    pointsPerQuestion?: number;

    @IsBoolean()
    @IsOptional()
    randomizeQuestions?: boolean;
}