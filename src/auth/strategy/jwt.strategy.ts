import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaService } from "src/prisma/prisma.service";
import { PayloadDto } from "../dto/payload.dto";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private prisma:PrismaService, 
                private configService: ConfigService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
            ignoreExpiration: false,
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
        return user;
    }   
}