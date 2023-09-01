import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
  @HttpCode(200)
  @Post()
  create(@Body() createItemDto: ItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll() {
      return this.itemService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.itemService.findOne(id);
  }
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: ItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
