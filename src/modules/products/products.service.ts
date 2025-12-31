import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseFormatter } from 'src/common/utils/response.util';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProductDto, userId: string) {
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        stock: dto.stock ?? 0,
        createdBy: userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return ResponseFormatter.created(product, 'Product created successfully');
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count(),
    ]);

    return ResponseFormatter.paginate(
      products,
      total,
      page,
      limit,
      'Products retrieved successfully',
    );
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ResponseFormatter.success(product, 'Product retrieved successfully');
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    currentUser: { id: string; role: Role },
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      currentUser.role !== Role.ADMIN &&
      product.createdBy !== currentUser.id
    ) {
      throw new ForbiddenException('You can only update your own products');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: dto,
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return ResponseFormatter.updated(
      updatedProduct,
      'Product updated successfully',
    );
  }

  async remove(id: string, currentUser: { id: string; role: Role }) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      currentUser.role !== Role.ADMIN &&
      product.createdBy !== currentUser.id
    ) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return ResponseFormatter.deleted('Product deleted successfully');
  }
}
