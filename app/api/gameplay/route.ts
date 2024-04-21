import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

const colorMap = {
    // emoji
    r: '🔴',
    g: '🟢',
    b: '🔵',
    y: '🟡',
    o: '🟠',
    wh: '⚪',
    bl: '⚫',
};


async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

    if (!isValid) {
        return new NextResponse('Message not valid', { status: 500 });
    }

    const getRandomSolution = () => {
        // const colors = ['r', 'g','b', 'y', "o"];
        const colors = ['r', 'g','b', 'y'];
        return Array.from({ length: 4 }, () => colors[Math.floor(Math.random() * colors.length)]).join(',');
    }

    const checkGuess = (guess: string, solution: string) => {
        const result: string[] = [];
        const solutionChars = solution.split(',');
        const guessChars = guess.split(',');
        const length = guessChars.length;

        if (!(guessChars?.length >  0)) {
            return "Please enter a guess"
        }

        // First pass to find white pegs (correct color and position)
        for (let i = 0; i < length; i++) {
            if (guessChars[i] === solutionChars[i]) {
                result.push('wh');
                // @ts-ignore
                solutionChars[i] = null; // Mark this solution character as matched
                // @ts-ignore
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

        // map to emojis and return
        // @ts-ignore
        const feedback = result.map((r) => colorMap[r]).join('');
        // @ts-ignore
        const guessEmojis = guess.map((r) => colorMap[r]).join('');


        state.guesses = `${guessEmojis}  - ${feedback} \n`;

        return `${guessEmojis}  - ${feedback} \n`;
    }

    const guess = message.input || '';

    let state = {
        counter: undefined,
        solution: "",
        guesses: ""
    };

    try {
        if (message.state?.serialized) {
            const decodedState = decodeURIComponent(message.state.serialized);
            const parsedState = JSON.parse(decodedState);

            console.log("message.decodedState: ", decodedState)
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
                    state = {
                        ...state,
                        ...parsedState,
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
                    label: `Result: ${checkGuess(guess, state.solution)}`,
                },
                {
                    label: `${state.guesses}`,
                },
            ],
            input: {
                text: 'Your guess (e.g. r,g,b,y)',
            },
            image: {
                src: `${NEXT_PUBLIC_URL}/park-1.png`,
            },
            state: {
                counter: state.counter ? state.counter + 1 : 1,
                mastermindVar: 'red, blue, green',
            },
            postUrl: `${NEXT_PUBLIC_URL}/api/gameplay`,
        }),
    );
}

export async function POST(req: NextRequest): Promise<Response> {
    return getResponse(req);
}

export const dynamic = 'force-dynamic';
