"use client";

import React from 'react';
import StickyNavHeader from './StickyNavHeader';
import FixedProgressBar from './FixedProgressBar';

export default function StickyNavigation() {
  return (
    <>
      <FixedProgressBar />
      <StickyNavHeader />
    </>
  );
}
