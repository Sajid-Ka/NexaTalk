import { injectable } from "inversify";
import { OAuth2Client } from "google-auth-library";
import {
  IGoogleAuthService,
  GoogleUserProfile,
} from "../../../../domain/features/auth/services/IGoogleAuthService";
import { UnauthorizedError } from "../../../../domain/core/errors/UnauthorizedError";
import { env } from "../../../../shared/config/env";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client;

  constructor() {
    this.client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  async verifyIdToken(token: string): Promise<GoogleUserProfile> {
    try {
      // First try to verify as an ID token
      try {
        const ticket = await this.client.verifyIdToken({
          idToken: token,
          audience: env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (payload && payload.sub && payload.email) {
          return {
            googleId: payload.sub,
            email: payload.email,
            name: payload.name ?? "",
            picture: payload.picture ?? "",
            emailVerified: payload.email_verified ?? false,
          };
        }
      } catch {
        // If it's not an ID token, it might be an access token
      }

      // Fallback: Treat token as an access_token and fetch user info
      const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedError("Google token verification failed");
      }

      const payload = await response.json();

      if (!payload || !payload.sub || !payload.email) {
        throw new UnauthorizedError("Invalid Google token payload");
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name ?? "",
        picture: payload.picture ?? "",
        emailVerified: payload.email_verified ?? false,
      };
    } catch {
      throw new UnauthorizedError("Google token verification failed");
    }
  }
}
