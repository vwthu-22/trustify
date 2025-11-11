import React from 'react';
import { Search, Bell, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Suggest from '@/components/suggest';
import Bank from '@/components/bestbank';
import Travel from '@/components/besttravel';
import RecentReview from '@/components/rv_recent'
import SearchHD from '@/components/search';
export default function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className='mx-0 px-0' /*style={{ backgroundImage: 'url(/img/bg.png)' }}*/>
        <SearchHD></SearchHD>
        <div className='mx-32'>
          <Suggest />
          <Bank />
          <Travel />
          <RecentReview />
        </div>
      </div>
  );
}
