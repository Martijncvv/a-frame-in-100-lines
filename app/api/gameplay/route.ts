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
    counter?: number;
    solution: string;
    guesses: string[];
}

const getRandomSolution = () => {
    // const colors = ['r', 'g','b', 'y', "o"];
    const colors = ['r', 'g','b', 'y'];
    return Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)]).join(',');
}



const checkGuess = (guess: string, solution: string) => {
    const result: any = [];
    const solutionChars = solution.split(',');
    const guessEmojis = guess.split(',').map((r) => colorMap[r]).join('');
    const guessChars: any  = guess.split(',');
    const length = guessChars.length;

    if (guessChars?.length ===  0) {
        return "Please enter a guess"
    }
    // First pass to find white pegs (correct color and position)
    for (let i = 0; i < length; i++) {
        if (guessChars[i] === solutionChars[i]) {
            result.push('wh');
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
                result.push('bl');
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


    const guess = message.input || '';

    let state: IState = {
        counter: undefined,
        solution: "",
        guesses: []
    };

    try {
        if (message.state?.serialized) {
            const decodedState = decodeURIComponent(message.state.serialized);
            const parsedState = JSON.parse(decodedState);

            // if the state has a solution, we're in the middle of a game
            if (parsedState.solution) {
                // if the user has guessed the solution, reset the game
                if (parsedState.solution.join('') === guess) {
                    // todo display finish screen
                    state = {
                        ...state,
                        solution: getRandomSolution(),
                    };
                } else {
                   const feedback = checkGuess(guess, parsedState.solution);
                    state = {
                        ...state,
                        ...parsedState,
                        guesses: [...parsedState.guesses, feedback],
                    };
                }
            } else {
                // if the state doesn't have a solution, we're starting a new game
                state = {
                    ...state,
                    solution: getRandomSolution(),
                };
            }

            state = {
                ...state,
                ...parsedState
            };
        }
    } catch (e) {
        console.error(e);
    }

    // generate an image
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `${checkGuess(guess, state.solution)}`,
                },
                {
                    label: `G2: ${state.guesses[1] ? state.guesses[1] : "-"}`,
                },
                {
                    label: `G3: ${state.guesses[2] ? state.guesses[2] : "-"}`,
                },
                {
                    label: `G4: ${state.guesses[3] ? state.guesses[3] : "-"}`,
                },
            ],
            input: {
                text: 'Your guess (e.g. r,g,b,y)',
            },
            image: {
                src: `${NEXT_PUBLIC_URL}/park-1.png`,
            },
            state,
            postUrl: `${NEXT_PUBLIC_URL}/api/gameplay`,
        }),
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';
