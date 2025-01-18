import { Controller, Get, Post } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderBoardService: LeaderboardService) {}

    @Get()
    getLeaderBoard() {}

    @Post("share")
    getShare() {}
}
