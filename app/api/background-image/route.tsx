import { ImageResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export async function GET(req: NextRequest) {


    const stateSearchParam = req.nextUrl.searchParams.get('state');
    console.log("stateSearchParam12", stateSearchParam)

  const state = stateSearchParam ? JSON.parse(decodeURIComponent(stateSearchParam)) : {
    solution: "",
    guesses: [],
    counter: 0,
    gameWon: false
  };

    interface GameInfoProps {
        title: string;
        value: string | string[];
    }


    console.log("state123: ", state)

    const GameInfo: React.FC<GameInfoProps> = ({ title, value }) => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.8)',
                borderRadius: '10px',
                padding: '10px 20px',
                margin: '5px',
                width: '90%',
                maxWidth: '500px',
                fontSize: '18px',
                color: '#333',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}>
                <strong style={{ display: 'block' }}>{title}</strong>
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
                    backgroundColor: "#063e7c",
                    color: 'white',
                    fontFamily: 'Comic Sans MS, cursive, sans-serif',
                    padding: '20px',
                    boxSizing: 'border-box',
                }}
            >
                <h1 style={{ color: '#f66f06', marginBottom: '20px' }}>Mastermind Game Stats</h1>
                <GameInfo title="Guesses" value={state.guesses} />
                <GameInfo title="Number of Tries" value={state.counter} />
                <GameInfo title="Current Solution" value={state.solution || "Not set yet"} />
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}


export const runtime = 'edge';