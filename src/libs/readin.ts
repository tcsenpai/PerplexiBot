import * as readline from 'readline/promises';

export default async function readin(q: string = ""): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let answer = await rl.question(q);
  rl.close();
  return answer;
}
