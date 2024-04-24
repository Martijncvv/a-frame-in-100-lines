import { ImageResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export async function GET(req: NextRequest) {
    const stateSearchParam = req.nextUrl.searchParams.get('state');


      const state = stateSearchParam ? JSON.parse(decodeURIComponent(stateSearchParam)) : {
        solution: "",
        guesses: [],
        counter: 0,
          gameWon: "false",
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
                <strong style={{ display: 'block', color: '#aad1f9', fontSize: '22px' }}>{title}</strong>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px', textAlign: 'center', fontSize: '20px' }}>
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
                    fontFamily: 'Comic Sans MS, cursive, sans-serif',
                    padding: '20px',
                    boxSizing: 'border-box',
                }}
            >
                <h1 style={{color: '#f66f06', marginBottom: '20px', fontSize: '28px'}}>
                    {state.gameWon === "true" ? 'Congratulations, You Won!' : 'Mastermind Game Stats'}
                </h1>
                <h2 style={{color: '#f66f06', marginBottom: '20px', fontSize: '24px'}}>
                    By X: Marty_cfly
                </h2>


                {state.gameWon === "true" ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                        <p style={{fontSize: '22px', color: '#f66f06' }}>
                            Great job! You've solved the puzzle in {state.counter} tries.
                        </p>
                        <p style={{fontSize: '22px', color: '#f66f06'}}>
                            {state.guesses[state.guesses.length - 1]}
                        </p>
                        <p style={{fontSize: '22px', color: '#f66f06'}}>
                            {state.counter < 5 ? <span>{state.counter} tries, Gm Vitalik</span>  : state.counter < 7 ?
                                <span>{state.counter} tries. Mid-curver! NGMI</span> :
                                <span>{state.counter} tries.. left-curvers unite!</span>}
                        </p>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    >
                        {state.guesses.length > 0 && (
                                <GameInfo title="Guesses" value={state.guesses}/>
                            )}
                        <GameInfo title="Number of Tries" value={state.counter}/>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '10px',
                            padding: '20px',
                            margin: '5px 0',
                            width: '80%',
                            fontSize: '20px',
                            color: '#aad1f9',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        }}>
                            {state.counter < 5 &&
                                (
                            <p>Select your guesses from the colors: 🔴 (r), 🟢 (g), 🔵 (b), 🟡 (y), and 🟠
                                (o).                                Enter a sequence of four or six characters (r,g,b,y,o,r)</p>
                                )
                            }
                            <p>Feedback: Black ⚫ indicates that a color is both correct and correctly positioned. White ⚪ signifies that the color is correct but
                                in the wrong position.</p>
                        </div>
                    </div>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}


export const runtime = 'edge';