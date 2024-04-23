import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

const colorMap: { [key: string]: string } = {
    r: '🔴',
    g: '🟢',
    b: '🔵',
    y: '🟡',
    o: '🟠',
    wh: '⚪',
    bl: '⚫',
};

interface IState {
    solution: string;
    guesses: string[];
    counter: number;
}

const getRandomSolution = () => {
    const colors = ['r', 'g','b', 'y', "o"];
    return Array.from({ length: 6 }, () => colors[Math.floor(Math.random() * colors.length)]).join(',');
}



const checkGuess = (guess: string, solution: string) => {
    const result: any = [];
    const solutionChars = solution.split(',');
    const guessEmojis = guess.split(',').map((r) => colorMap[r]).join('');
    const guessChars: any  = guess.split(',');
    const length = guessChars.length;

    if (guessChars?.length !== 6) {
        return `Enter guess: r,g,b,y,o (6 total)`
    }

    // First pass to find white pegs (correct color and position)
    for (let i = 0; i < length; i++) {
        if (guessChars[i] === solutionChars[i]) {
            result.push('bl');
            // @ts-ignore
            solutionChars[i] = null; // Mark this solution character as matched
            guessChars[i] = null; // Mark this guess character as used
        }
    }

    // Second pass to find black pegs (correct color, wrong position)
    for (let i = 0; i < length; i++) {
        if (guessChars[i] !== null) { // Skip already matched guesses
            const index = solutionChars.findIndex((c) => c === guessChars[i]);
            if (index !== -1) {
                result.push('wh');
                // @ts-ignore
                solutionChars[index] = null; // Mark this solution character as matched
            }
        }
    }

    const feedback =  result?.length > 0 ? result.map((r: any) => colorMap[r]).join('') : '';

    return `${guessEmojis}-${feedback}`;
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

    if (!isValid) {
        return new NextResponse('Message not valid', { status: 500 });
    }

    const guess = message?.input?.length > 0 ? message.input.toLowerCase() : '';

    let state: IState = {
        solution: "",
        guesses: [],
        counter: 0,
    };

    let gameWonMessage

    try {
        if (message.state?.serialized) {
            const decodedState = decodeURIComponent(message.state.serialized);
            const parsedState = JSON.parse(decodedState);


            if (parsedState.solution) {
                if (parsedState.solution === guess) {
                    gameWonMessage = `You won in ${parsedState.counter + 1} tries! ${guess.split(',').map((r) => colorMap[r]).join('')} 🎉`
                    state = {
                        solution: "",
                        guesses: [],
                        counter: -1,
                    };
                } else {
                    const feedback = checkGuess(guess, parsedState.solution);
                    state = {
                        solution: parsedState.solution,
                        guesses: [...parsedState.guesses, feedback],
                        counter: parsedState.counter + 1,
                    };
                }
            } else {
                const newSolution = getRandomSolution()
                const feedback = checkGuess(guess, newSolution);
                state = {
                    ...parsedState,
                    solution : newSolution,
                    guesses: [feedback],
                    counter: parsedState.counter + 1,
                };
            }
        }
    } catch (e) {
        console.error(e);
    }


    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `${gameWonMessage ? gameWonMessage : checkGuess(guess, state.solution)} `,
                    action: 'post',
                    target: `${NEXT_PUBLIC_URL}/api/gameplay_medium`,
                },
                {
                    label: !gameWonMessage? `Tries ${state.counter}` : "",
                    action: 'post',
                    target: `${NEXT_PUBLIC_URL}/api/gameplay_medium`,
                },
                // {
                //     label: !gameWonMessage ? `Sol: ${ state.solution ?  state.solution : "-"}` : "",
                //     action: 'post',
                //     target: `${NEXT_PUBLIC_URL}/api/gameplay_medium`,
                // },

            ],
            postUrl: `${NEXT_PUBLIC_URL}/api/gameplay_medium`,
            input: {
                text: 'Enter guess: r,g,b,y,o (6 total)',
            },
            image: {
                src: `${NEXT_PUBLIC_URL}/mastermind-3.png`,
            },
            state: {
                solution: state.solution,
                guesses: state.guesses,
                counter: state.counter,
            },
        }),
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';
