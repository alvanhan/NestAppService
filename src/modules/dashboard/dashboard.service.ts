import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseFormatter } from 'src/common/utils/response.util';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const [totalUsers, totalProducts, totalStock] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.product.aggregate({
        _sum: {
          stock: true,
        },
      }),
    ]);

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
          totalStock: totalStock._sum.stock || 0,
        },
        recentProducts,
      },
      'Dashboard summary retrieved successfully',
    );
  }
}
