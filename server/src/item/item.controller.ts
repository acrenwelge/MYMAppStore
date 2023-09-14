import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, HttpStatus} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './item.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NeedRole } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/role.enum';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @NeedRole(Roles.Admin)
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

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @NeedRole(Roles.Admin)
  update(@Param('id') id: string, @Body() updateItemDto: ItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @NeedRole(Roles.Admin)
  remove(@Param('id') id: string) {
    this.itemService.remove(+id);
  }
}
