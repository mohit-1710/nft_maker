import React from "react";

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4">📘 Documentation</h1>
      <p className="text-lg text-gray-300 max-w-2xl text-center leading-relaxed">
        Welcome to the Docs section! Here you’ll find all the information about
        how to use and integrate the platform — including setup guides,
        configuration options, and API references.
      </p>
    </div>
  );
}