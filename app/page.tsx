import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start Mastermind',
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/mastermind-1.png`,
    aspectRatio: '1:1',
  },
  input: {
    text: 'Marty',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/gameplay`,
  state: {
    page: 0,
    mastermindVar: 'red blue green',
  },
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
