import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Start Easy Mastermind',
      action: 'post',
      target: `${NEXT_PUBLIC_URL}/api/gameplay_easy`,
    },
    {
      label: 'Start Medium Mastermind',
      action: 'post',
      target: `${NEXT_PUBLIC_URL}/api/gameplay_medium`,
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/mastermind-2.png`,
    aspectRatio: '1:1',
  },

});

export const metadata: Metadata = {
  title: 'Mastermindcfly',
  description: 'Mastermind tiempo',
  openGraph: {
    title: 'Martycfly.xyz',
    description: 'Mastermindooo by X: Marty_cfly',
    images: [`${NEXT_PUBLIC_URL}/mastermind-2.png`],
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
