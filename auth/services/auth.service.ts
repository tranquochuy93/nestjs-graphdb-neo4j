import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '~users/entities/user.entity';
import { UserService } from '~users/services/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if ( user !== undefined && await this.userService.compare(password, user.getPassword()) ) {
            return user;
        }

        return null;
    }

    async createToken(user: User) {
        // Deconstruct the properties
        const { id, email, dateOfBirth, firstName, lastName } =  user.toJson()

        // Encode that into a JWT
        return {
            access_token: this.jwtService.sign({
                sub: id,
                email, dateOfBirth, firstName, lastName,
            }),
        }
    }

}
