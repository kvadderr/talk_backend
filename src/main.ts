import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as https from 'https';
import { AppModule } from './app.module';
import * as cors from 'cors';


async function bootstrap() {
  const PORT = process.env.PORT;
const app = await NestFactory.create(AppModule, {
    httpsOptions: {
        key: fs.readFileSync('/home/SSL/dijo.space.key'),
      cert: fs.readFileSync('/home/SSL/dijo.space.crt'),
}
}); 
 app.enableCors({
    origin: true,
    credentials: true
  });  
  const version = '1.0.0';
app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Документация по проекту T2me')
    .setDescription('T2me REST API')
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/docs/v/${version}`, app, document);

  await app.listen(PORT,'0.0.0.0', () => console.log(`Server start on port ${PORT}`));

}
bootstrap();
