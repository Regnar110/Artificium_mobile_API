import { Controller } from '@nestjs/common';
import { ResponseBuilderService } from 'src/domain/services/ResponseBuilder/responseBuilder.service';

@Controller('friendList')
export class FriendListController {
  constructor(private readonly responseBuilder: ResponseBuilderService) {}
}
