export default function required(
  condition: any,
  message: string = "Oops! Something went wrong!",
  fatal: boolean = true,
  exitcode: number = -1
) {
  if (condition) return
  
  if (fatal) {
    console.log("[FATAL] " + message);
    process.exit(exitcode);
  } else {
    console.log("[ERROR] " + message);
  }
}
