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
        solution: "",
        guesses: [],
    };

    try {
        if (message.state?.serialized) {
            const decodedState = decodeURIComponent(message.state.serialized);
            const parsedState = JSON.parse(decodedState);

            if (parsedState.solution) {
                if (parsedState.solution.join('') === guess) {

                } else {
                    const feedback = checkGuess(guess, parsedState.solution);
                    state = {
                        ...parsedState,
                        guesses: [parsedState.guesses, feedback],
                    };
                }
            } else {
                const newSolution = getRandomSolution()
                const feedback = checkGuess(guess, newSolution);
                state = {
                    ...parsedState,
                    solution : newSolution,
                    guesses: [feedback],
                };
            }
        }
    } catch (e) {
        console.error(e);
    }
    console.log("state123: ", state)

    // generate an image
    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `${checkGuess(guess, state.solution)}`,
                },
                {
                    label: `Sol: ${ state.solution ?  state.solution : "-"}`,
                },
                {
                    label: `G1: ${state.guesses[0] ? state.guesses[0] : "-"}`,
                },
                {
                    label: `G2: ${state.guesses[1] ? state.guesses[1] : "-"}`,
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
