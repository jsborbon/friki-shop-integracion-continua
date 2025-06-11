import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { ClerkAuthMiddleware } from "../common/middleware/clerk-auth.middleware";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClerkAuthMiddleware)
      .forRoutes("orders"); // Protege todas las rutas de OrdersController
  }
}