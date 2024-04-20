import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './config';
import parkImage1 from '../public/park-1.png';
import Image from 'next/image';


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
      <h1>Martycfly.xyz</h1>
      <Image src={parkImage1} alt="Park View" layout='fill' objectFit='cover'/>
    </>
  );
}
