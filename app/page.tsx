import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start Mastermind',
      action: 'post',
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/mastermind-1.png`,
    aspectRatio: '1:1',
  },
  input: {
    text: 'Marty',
  },
  // state: {
  //           counter: 23,
  //           mastermindVar: 'red, blue, green',
  //       },
  postUrl: `${NEXT_PUBLIC_URL}/api/gameplay`,

});

export const metadata: Metadata = {
  title: 'Mastermindcfly',
  description: 'Mastermind tiempo',
  openGraph: {
    title: 'mcfly.xyz',
    description: 'Mastermindooo',
    images: [`${NEXT_PUBLIC_URL}/mastermind-1.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>X: Martycfly</h1>
      <h2>WP: Marty_cfly</h2>
      <h3>What you doing here bro</h3>
    </>
  );
}
