import Blog from '@/src/components/Web/Blog'
import React from 'react';

export const metadata = {
  title: "GiveSphere | Blogs & Stories",
  description: "Read inspiring stories, articles, and news from our charity campaigns.",
};

const page = () => {
  return (
    <div>
      <Blog />
    </div>
  )
}

export default page
