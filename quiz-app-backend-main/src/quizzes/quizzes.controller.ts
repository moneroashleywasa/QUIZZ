import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Request
} from '@nestjs/common';
import {
    AttemptQuizDto,
    CreateQuizDto,
    QuizFilterDto,
} from './dto/create-quiz.dto';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizService: QuizzesService) {}

  @Get()
  async getQuizzes(@Query() filters: QuizFilterDto) {
    return await this.quizService.getAllQuizzes(filters);
  }

  @Get(':id')
  async getQuizById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.quizService.getQuizById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createQuiz(@Request() req, @Body() createQuizDto: CreateQuizDto) {
    return await this.quizService.createQuiz(req.user.id, createQuizDto);
  }

  @Put(':id')
  async updateQuiz(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateQuizDto: Partial<CreateQuizDto>,
  ) {
    return await this.quizService.updateQuiz(id, req.user.id, updateQuizDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteQuiz(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
    return await this.quizService.deleteQuiz(id, req.user.id);
  }

  @Post(':id/submit')
  async submitQuiz(
    @Request() req,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() attemptQuizDto: AttemptQuizDto,
  ) {
    return await this.quizService.attemptQuiz(req.user.id, id, attemptQuizDto);
  }

  @Get(':id/results')
  async getQuizResults(@Param('id', ParseUUIDPipe) id: string) {
    return await this.quizService.getRankings(id);
  }

  @Get(':id/stats')
  async getQuizStatistics(@Param('id', ParseUUIDPipe) id: string) {
    // Implement this method in your service
    // return await this.quizService.getQuizStatistics(id);
  }
}
