import React from 'react';

interface HeadProps {
  title: string;
  description: string;
}

export const Head: React.FC<HeadProps> = ({ title, description }) => {
  return (
    <head>
      <title>{title}</title>
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} key="title" />
      <meta property="og:description" content={description} />
      {/* <link rel="manifest" href="/manifest.json" /> */}
      <link rel="icon" href="/favicon.ico" />
    </head>
  );
}

export default Head;