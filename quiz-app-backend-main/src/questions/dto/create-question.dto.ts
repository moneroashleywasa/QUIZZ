import { IsArray, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateQuestionDto {
    @IsString()
    text: string;

    @IsArray()
    @IsString({ each: true })
    options: string[];

    @IsArray()
    @IsString({ each: true })
    correctAnswer: string[];

    @IsUrl()
    @IsOptional()
    mediaUrl?: string;
}