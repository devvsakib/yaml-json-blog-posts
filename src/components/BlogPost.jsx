// src/components/BlogPost.js
import React from 'react';
import YouTube from 'react-youtube';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';

const BlogPost = ({ post, onBack }) => {
  const renderContent = (item) => {
    if (typeof item === 'string') {
      if (item.startsWith('[yt:')) {
        const videoId = item.match(/\[yt:(.*?)\]/)[1];
        return <YouTube videoId={videoId} className="w-full my-4" />;
      } else if (item.match(/\.(jpeg|jpg|gif|png)$/) || item.startsWith('http')) {
        return <img src={item} alt="content" className="max-w-full h-auto my-4 rounded-lg shadow-md" />;
      } else if (item.startsWith('```')) {
        const code = item.replace(/```/g, '');
        return (
          <SyntaxHighlighter language="text" style={docco} className="my-4">
            {code}
          </SyntaxHighlighter>
        );
      }
      return <ReactMarkdown className="mb-4">{item}</ReactMarkdown>;
    } else if (Array.isArray(item)) {
      return (
        <ul className="list-disc pl-5 mb-4">
          {item.map((subItem, index) => (
            <li key={index} className="mb-2">{renderContent(subItem)}</li>
          ))}
        </ul>
      );
    } else if (typeof item === 'object' && item !== null) {
      return (
        <div className="mb-4">
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className="mb-4">
              {key !== 'image' && key !== 'video' && <h3 className="text-xl font-bold mb-2">{key}</h3>}
              {renderContent(value)}
            </div>
          ))}
        </div>
      );
    }
    return <span>{String(item)}</span>;
  };

  return (
    <div className="prose lg:prose-xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-xl mb-8">{post.description}</p>
      {post.sections && post.sections.map((section, index) => (
        <div key={index} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{section.name}</h2>
          {renderContent(section)}
        </div>
      ))}
      <button
        onClick={onBack}
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Posts
      </button>
    </div>
  );
};

export default BlogPost;
