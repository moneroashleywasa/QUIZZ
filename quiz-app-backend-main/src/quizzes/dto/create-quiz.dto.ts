import { QuizStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { CreateQuestionDto } from "src/questions/dto/create-question.dto";
import { QuizSettingsDto } from "./quiz-settings.dto";

export class CreateQuizDto {
    @IsString()
    title: string;
    @IsString()
    @IsOptional()
    description?: string;

    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    @IsArray()
    questions: CreateQuestionDto[];

    @ValidateNested()
    @Type(() => QuizSettingsDto)
    settings: QuizSettingsDto;

    @IsEnum(QuizStatus)
    @IsOptional()
    status?: QuizStatus;
}


export class QuizFilterDto {
    @IsEnum(QuizStatus)
    @IsOptional()
    status?: QuizStatus;

    @IsString()
    @IsOptional()
    creatorId?: string;
}

export class AttemptQuizDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuizAnswerDto)
    answers: QuizAnswerDto[];

    @IsNumber()
    @Min(0)
    timeTaken: number;
}

export class QuizAnswerDto {
    @IsString()
    questionId: string;

    @IsArray()
    @IsString({ each: true })
    selectedOptions: string[];
}