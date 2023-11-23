import {Controller, Get, Request, Res, Param, UseGuards} from '@nestjs/common';
import {BookService} from "../book/book.service";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";


@Controller('book')
export class BookController {

    constructor(private readonly bookService:BookService) {}

    @UseGuards(JwtAuthGuard)
    @Get("read/:name")
    async read(@Request() req, @Param("name") name: string) {
        const userId = req.user.user_id
        // TODO: differentiate between items instead of hard-coding
        const itemId = 1
        const readValidation = await this.bookService.getBookURL(userId,itemId,name)
        return {readValidation}
    }

}
