import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export type RegisteredAccount = {
  email: string;
  password: string;
  source: string;
  createdAt: string;
};

type RegistrationAttempt = {
  email: string;
  source: string;
  status: 'created' | 'protected';
  url: string;
  createdAt: string;
};

const registeredAccountsPath =
  process.env.REGISTERED_ACCOUNTS_PATH ?? 'test-results/registered-accounts.jsonl';
const registrationAttemptsPath =
  process.env.REGISTRATION_ATTEMPTS_PATH ?? 'test-results/registration-attempts.jsonl';

export function recordRegisteredAccount(account: RegisteredAccount) {
  mkdirSync(path.dirname(registeredAccountsPath), { recursive: true });
  appendFileSync(registeredAccountsPath, `${JSON.stringify(account)}\n`, 'utf8');
  return registeredAccountsPath;
}

export function recordRegistrationAttempt(attempt: RegistrationAttempt) {
  mkdirSync(path.dirname(registrationAttemptsPath), { recursive: true });
  appendFileSync(registrationAttemptsPath, `${JSON.stringify(attempt)}\n`, 'utf8');
  return registrationAttemptsPath;
}

export function readLatestRegisteredAccount() {
  if (!existsSync(registeredAccountsPath)) return null;

  const lines = readFileSync(registeredAccountsPath, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines.reverse()) {
    try {
      const account = JSON.parse(line) as Partial<RegisteredAccount>;
      if (account.email && account.password) {
        return account as RegisteredAccount;
      }
    } catch {
      continue;
    }
  }

  return null;
}
