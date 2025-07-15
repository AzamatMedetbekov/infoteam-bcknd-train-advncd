import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { plainToInstance } from "class-transformer";
import { UserEntity } from "src/user/entities/user.entity";
import { PayloadDto } from "../dto/payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private prisma:PrismaService, 
                private configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: PayloadDto){
        const user = await this.prisma.user.findUnique({
            where: {
                uuid: payload.uuid,
            }
        });
        if(!user){
            throw new UnauthorizedException();
        }
        return plainToInstance(UserEntity, user);
    }   
}