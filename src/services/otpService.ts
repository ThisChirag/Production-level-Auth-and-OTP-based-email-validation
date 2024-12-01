import { setOtp, getOtp} from "../cache";
import { v4 as uuidv4 } from "uuid";

export const generateOtp = (): string => {
  return uuidv4().slice(0, 6); // Generate a 6-character OTP
};

export const storeOtp = async (email: string, otp: string, ttl: number): Promise<void> => {
  await setOtp(email, otp, ttl); // Store OTP in Redis
};

export const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
  const storedOtp = await getOtp(email);
  return storedOtp === otp;
};
