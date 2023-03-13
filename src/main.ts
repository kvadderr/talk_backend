import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true
  });
  const version = '1.0.0';

  const config = new DocumentBuilder()
    .setTitle('Документация по проекту T2me')
    .setDescription('T2me REST API')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/docs/v/${version}`, app, document);

  await app.listen(PORT, () => console.log(`Server start on port ${PORT}`));

}
bootstrap();
