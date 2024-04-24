import { ImageResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export async function GET(req: NextRequest) {


    const stateSearchParam = req.nextUrl.searchParams.get('state');
    console.log("stateSearchParam12", stateSearchParam)

  const state = stateSearchParam ? JSON.parse(decodeURIComponent(stateSearchParam)) : {
    solution: "",
    guesses: [],
    counter: 0,
  };


    console.log("state123: ", state)

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: "blue",
                }}
            >


            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}


export const runtime = 'edge';