import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

    if (!isValid) {
        return new NextResponse('Message not valid', { status: 500 });
    }

    const text = message.input || '';


    let state = {
        counter: undefined,
        mastermindVar: undefined,
    };
    let checker = false
    console.log("state1: ", state)
    console.log("message1: ", message)
    console.log("message1state: ", message.state)
    console.log("message.raw: ", message.raw)
    console.log("message.raw.action: ", message.raw.action)
    try {
        if (message.state?.serialized) {
            checker = true
            const decodedState = decodeURIComponent(message.state.serialized);
            const parsedState = JSON.parse(decodedState);
            // Merge parsed state with default state to fill in any missing properties
            state = {
                ...state,
                ...parsedState
            };
        }
    } catch (e) {
        console.error(e);
    }
    console.log("state22: ", state)

    /**
     * Use this code to redirect to a different page
     */
    if (message?.button === 3) {
        return NextResponse.redirect(
            'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
            { status: 302 },
        );
    }

    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `${checker ? "Yes " : "No "}`,
                },
                // {
                //     label: `Mstemind: ${state?.mastermindVar || 'notset'}`,
                // },
                // {
                //     label: `txt: ${text}`,
                // },
                // {
                //     label: `${message.state.mastermindVar}`,
                // },
                {
                    label: `${message.state.serialized}`,
                },

            ],
            image: {
                src: `${NEXT_PUBLIC_URL}/park-1.png`,
            },
            state: {
                counter: state.counter ? state.counter + 1 : 23,
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
