import {Controller, Get, Request, Res, UseGuards} from '@nestjs/common';
import {BookService} from "../book/book.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";


@Controller('book')
export class BookController {

    constructor(private readonly bookService:BookService) {}

    @UseGuards(JwtAuthGuard)
    @Get("read")
    async read(@Request() req) {
        const userId = req.user.user_id
        // TODO: differentiate between items instead of hard-coding
        const itemId = 1
        const readValidation = await this.bookService.getBookURL(userId,itemId)
        return {readValidation}
    }

}
