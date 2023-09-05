import {Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards} from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemDto } from './item.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { NeedRole } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/role.enum';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @NeedRole(Roles.Admin)
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @NeedRole(Roles.Admin)
  @HttpCode(200)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: ItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @NeedRole(Roles.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
