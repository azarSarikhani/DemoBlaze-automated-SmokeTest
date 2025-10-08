import dotenv from 'dotenv';

dotenv.config();

const baseUsername = process.env.TEST_USER_USERNAME || 'testuser';
const testPassword = process.env.TEST_USER_PASSWORD || 'testpassword';

export function getTestCredentials(projectName: string): { testUsername: string; testPassword: string } {
  const uniqueSuffix = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  const testUsername = `${baseUsername}-${projectName}-${uniqueSuffix}`;
  return { testUsername, testPassword };
}
