/**
 * Contains all custom defined types 
 */

import { z } from 'zod'

/**
 * API endpoint constants used for making requests.
 */
export const API = {
  BASE: 'https://handshakr.duckdns.org',
  REGISTER: 'api/auth/register',
  LOGIN: 'api/auth/login',
  LOGOUT: 'api/auth/logout',
  PROFILE: 'api/users/me',
  CREATE_HANDSHAKE: "api/users/create-handshake",
  GET_MY_INITIATED_HS: "api/handshake/get-handshakes-by-initiator",
  GET_MY_RECEIVED_HS: "api/handshake/get-handshakes-by-acceptor",
  GET_PRICE_STATS: 'scraper/get-price-stats',
  GET_PRICE_HISTOGRAM: 'scraper/graph-item-price-histogram',
  GET_WEEKLY_MEDIAN_PRICE: 'scraper/graph-item-weekly-median-price',
}

/**********  SCHEMA DEFINITIONS  *******************
 * Schemas are zod objects that validate user input into forms.
 * Schemas only validate inputs based on specifications and do not authenticate data.
 */


/**
 * Schema to validate the user registration form input.
 * Validates the username, email, password, and confirmPassword fields.
 * Ensures that the passwords match.
 */
export const UserRegisterFormSchema = z.object({
  username: z
    .string()
    .regex(/^\S*$/, { message: 'Username cannot contain whitespace' })
    .min(5, { message: 'Name must be at least 5 characters long.' })
    .max(30)
    .trim(),

  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),

  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Password must contain at least one special character.',
    })
    .trim(),

  confirmPassword: z.string().trim()
})
  // Check if passwords match
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "The passwords did not match.",
      path: ["confirmPassword"],
    }
  );


/**
 * Schema to validate the login form input.
 * Validates that both username and password are provided.
 */
export const LoginFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
});


/**
 * Schema to validate the handshake creation form input.
 * Ensures that the handshake name, receiver username, and encrypted details are provided.
 */
export const HandshakeFormSchema = z.object({
  handshakeName: z
    .string()
    .min(5, { message: 'Handshake name must be at least 5 characters long.' })
    .trim(),
  receiverUsername: z
    .string()
    .trim(),
  encryptedDetails: z
    .string()
    .min(10, { message: "Encrypted details must be at least 10 characters long" })
    .trim()
})

/********** FormState Definitions  *******************/
/**
 * Defines the state of the user authentication form.
 * Collects error messages to be displayed. If no errors, it is set to undefined.
 */
export type UserAuthFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined;

/**
 * Defines the state of the handshake form.
 * Collects error messages to be displayed. If no errors, it is set to undefined.
 */
export type HandshakeFormState =
  | {
      errors?: {
        handshakeName?: string[];
        encryptedDetails?: string[];
        receiverUsername?: string[];
      };
      message?: string;
    }
  | undefined;

/**
 * Defines the structure of user data returned from the API.
 * Includes user ID, username, and email.
 */
export type UserData =
  | {
      id: string;
      username: string;
      email: string;
    }
  | undefined;

/**
 * Defines the structure of a handshake.
 * Includes handshake name, encrypted details, signing and completion dates, status, initiator, and acceptor usernames.
 */
export type Handshake = {
  handshakeName: string;
  encryptedDetails: string;
  signedDate: string;
  completedDate: string;
  handshakeStatus: string;
  initiatorUsername: string;
  acceptorUsername: string;
}

/**
 * Defines the structure of price statistics.
 * Includes max, mean, median, and min price values.
 */
export type PriceStats = {
  max: number;
  mean: number;
  median: number;
  min: number;
};
