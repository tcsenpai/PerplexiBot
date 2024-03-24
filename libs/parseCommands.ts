export interface ContextPart {
    role: string
    content: string
}

export default function parseCommands(input: string): {proceed: boolean, logpart: string | null} {
    let proceed = true
    let logpart = null
    switch (input) {
        case "exit":
        case "quit":
        case "stop":
        case "end":
        case "bye":
            proceed = false
            logpart = "Last conversation ended at: " + String(Date.now())
            break
        default:
            break
    }
    return {
        proceed: proceed,
        logpart: logpart
    }
}