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

    const GameInfo = ({ title, value }: any) => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '10px 20px',
                margin: '10px 0',
                width: '90%',
                maxWidth: '500px',
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}>
                <strong style={{ display: 'block', color: '#aad1f9' }}>{title}</strong>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', textAlign: 'center' }}>
                    {Array.isArray(value) ? value.map((item, index) => (
                        <div key={index} style={{ margin: '2px 0' }}>{item}</div>
                    )) : <span>{value}</span>}
                </div>
            </div>
        );
    }

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
                    backgroundColor: "#0a0f0d",
                    color: 'white',
                    fontFamily: 'Comic Sans MS, cursive, sans-serif', // More playful font
                    padding: '20px',
                    boxSizing: 'border-box',
                }}
            >
                <h1 style={{color: '#f66f06', marginBottom: '20px'}}>Mastermind Game Stats</h1>
                <GameInfo title="Guesses" value={state.guesses}/>
                <GameInfo title="Number of Tries" value={state.counter}/>
                <GameInfo title="Current Solution" value={state.solution || "Not set yet"}/>
                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '20px',
                    margin: '10px 0',
                    width: '80%',
                    fontSize: '16px',
                    color: '#aad1f9',
                    textAlign: 'center',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                }}>
                    <p>Choose from 'r', 'g', 'b', 'y', 'o' and separate choices with a comma. There should be 6 chars
                        total.</p>
                    <p>A white feedback circle indicates an option is in the correct color and position. A black circle
                        indicates the correct color but wrong position.</p>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}


export const runtime = 'edge';