import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseFormatter } from 'src/common/utils/response.util';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const products = await this.prisma.product.findMany({
      select: { price: true, stock: true, name: true },
    });

    const totalUsers = await this.prisma.user.count();
    const totalProducts = products.length;

    const totalStock = products.reduce((acc, curr) => acc + curr.stock, 0);
    const totalInventoryValue = products.reduce(
      (acc, curr) => acc + curr.price * curr.stock,
      0,
    );

    const prices = products.map((p) => p.price);
    const maxPrice = prices.length ? Math.max(...prices) : 0;
    const minPrice = prices.length ? Math.min(...prices) : 0;

    const recentProducts = await this.prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return ResponseFormatter.success(
      {
        counts: {
          users: totalUsers,
          products: totalProducts,
          totalStock: totalStock,
          totalInventoryValue: totalInventoryValue,
          maxPrice: maxPrice,
          minPrice: minPrice,
        },
        recentProducts,
      },
      'Dashboard summary retrieved successfully',
    );
  }
}
