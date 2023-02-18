import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decoration';
import { Roles } from 'src/auth/roles/role.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { User } from 'src/auth/schema/user.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { Order } from './schema/order-schema';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //CREATE NEW ORDERS
  @Post()
  @UseGuards(AuthGuard())
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<Order> {
    // await
    return await this.orderService.createOrder(createOrderDto, user);
  }

  //  GET ALL ORDERS BY ADMIN
  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  // GET MY ORDERS
  @Get('myorders')
  @UseGuards(AuthGuard())
  async getMyOrder(@GetUser() user: User): Promise<Order[]> {
    return this.orderService.getMyOrders(user);
  }

  // UPDATE ORDERTOPAID

  @Put('/:id/paid')
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(Role.Admin)
  async updateOderToPaid(@Param('id') id: string): Promise<Order> {
    return this.orderService.updateOrderToPaid(id);
  }

  //   UPDATE ORDER TO DELIVERED
  @Put('/:id/delivered')
  @UseGuards(AuthGuard())
  async updateOrderToDelivered(@Param('id') id: string): Promise<Order> {
    return await this.orderService.updateOrderToDelivered(id);
  }

  //   GET ORDER BY ID
  @Get('/:id')
  @UseGuards(AuthGuard())
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  //   DELETE PRODUCT ORDERED BY ADMIN
  @Delete('/:id')
  async deleteOrder(@Param('id') id: string): Promise<any> {
    return this.orderService.deleteOrder(id);
  }
}
