// src/App.js
import React, { useState } from "react";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { fetchFiles, fetchFileContent } from "./api/githubApi";
import BlogPost from "./components/BlogPost";
import FileUpload from "./components/FileUpload";

const queryClient = new QueryClient();

const App = () => {
    const [selectedPost, setSelectedPost] = useState(null);

    const {
        data: files,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["files"],
        queryFn: fetchFiles,
    });

    const loadPostContent = async (file) => {
        const content = await fetchFileContent(file.path);
        setSelectedPost({ ...content, fileName: file.name });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading files</div>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="container mx-auto p-4 max-w-3xl">
                <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
                {!selectedPost && (
                    <>
                        <FileUpload onUpload={refetch} />
                        <div className="mb-8">
                            {files.map((file, index) => (
                                <div key={index} className="mb-4">
                                    <h2
                                        className="text-2xl font-bold mb-2 cursor-pointer"
                                        onClick={() => loadPostContent(file)}
                                    >
                                        {file.name.replace(/\.[^/.]+$/, "")}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {selectedPost && (
                    <BlogPost
                        post={selectedPost}
                        onBack={() => setSelectedPost(null)}
                    />
                )}
            </div>
        </QueryClientProvider>
    );
};

export default App;
