import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";
import { PassportStatic } from "passport";
import { PrismaClient } from "../../generated";

const prisma = new PrismaClient();

const secretKey = process.env.ACCESS_TOKEN!;

function accessTokenExtractor(req: Request) {
  return req.cookies.accessToken || null;
}

const options = {
  jwtFromRequest: accessTokenExtractor,
  secretOrKey: secretKey,
};

export const configurePassport = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.id },
        });

        if (user) return done(null, user);
        return done(null, false);
      } catch (err: any) {
        return done(err, false);
      }
    })
  );
};
