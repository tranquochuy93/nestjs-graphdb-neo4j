import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "~users/entities/user.entity";
import { UserService } from "~users/services/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: any): Promise<User> {
        const user = await this.userService.findByEmail(payload.email)
        console.log('=================')
        console.log(user)
        if ( !user ) {
            throw new UnauthorizedException()
        }

        return user;
    }

}