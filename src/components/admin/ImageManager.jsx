import React, { useState, useEffect } from 'react';
import { apiUrls } from '../../config/api-urls';

const ImageManager = ({ token }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal states
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showReplaceModal, setShowReplaceModal] = useState(false);
    const [imageToReplace, setImageToReplace] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Form states
    const [uploadFiles, setUploadFiles] = useState(null);
    const [replaceFile, setReplaceFile] = useState(null);

    // Determines API URL based on environment (copied from Admin.jsx logic or passed down)
    const getApiUrl = () => {
        if (window.location.hostname === 'localhost') {
            return 'http://localhost:8787';
        }
        return apiUrls.url.baseUrl;
    };
    const currentAPIurl = getApiUrl();

    const loadImages = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.images.getAll}`, {
                method: apiUrls.methods.admin.images.getAll,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.result === 'Empty') {
                setImages([]);
            } else if (data.result) {
                setImages(data.result);
            }
        } catch (error) {
            console.error("Error loading images:", error);
            alert("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) loadImages();
    }, [token]);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFiles || uploadFiles.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < uploadFiles.length; i++) {
            formData.append('imageFile', uploadFiles[i]);
        }

        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.images.create}`, {
                method: apiUrls.methods.admin.images.create,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            // Note: Content-Type header is not set manually for FormData to allow browser to set boundary

            const data = await response.json();
            // Handle summary like legacy handleUploadSummary if needed, for now just detailed alert or console
            console.log("Upload result:", data);

            setShowUploadModal(false);
            setUploadFiles(null);
            loadImages();
            alert("Upload completed.");
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed.");
        }
    };

    const handleReplace = async (e) => {
        e.preventDefault();
        if (!replaceFile || !imageToReplace) return;

        const formData = new FormData();
        formData.append('imageFile', replaceFile);
        formData.append('imageName', imageToReplace.key.replace('images/', '')); // key logic from legacy
        formData.append('token', token);

        try {
            const response = await fetch(`${currentAPIurl}${apiUrls.url.admin.images.replace}`, {
                method: 'POST', // Legacy used POST for replace, verifying method from api-urls might be good but code said 'POST' or from object
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            await response.json(); // Consume body

            setShowReplaceModal(false);
            setReplaceFile(null);
            setImageToReplace(null);
            loadImages();
            alert("Image replaced successfully.");
        } catch (error) {
            console.error("Replace failed", error);
            alert("Replace failed.");
        }
    };

    const handleDelete = async (imageKey) => {
        const imageName = imageKey.replace('images/', '');
        if (!window.confirm(`Are you sure you want to delete ${imageName}?`)) return;

        try {
            await fetch(`${currentAPIurl}${apiUrls.url.admin.images.remove}`, {
                method: apiUrls.methods.admin.images.remove,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ imageName })
            });
            loadImages();
        } catch (error) {
            console.error("Delete failed", error);
            alert("Delete failed.");
        }
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Image Library</h2>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <i className="fas fa-upload"></i> Upload Images
                </button>
            </div>

            {loading ? (
                <div className="text-center text-gray-400">Loading images...</div>
            ) : (
                <div className="bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-gray-700 text-gray-300">
                                <tr>
                                    <th className="p-4">Preview</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4 hidden md:table-cell">URL</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {images.map((item, index) => {
                                    const img = item.image;
                                    const name = img.key.replace('images/', '');
                                    const url = `${currentAPIurl}${apiUrls.url.images.get}${encodeURIComponent(name)}`;

                                    return (
                                        <tr key={index} className="hover:bg-gray-750">
                                            <td className="p-4">
                                                <img
                                                    src={url}
                                                    alt={name}
                                                    className="h-16 w-16 object-cover rounded bg-gray-900 cursor-pointer hover:opacity-80 transition-opacity"
                                                    onMouseEnter={() => setPreviewImage(url)}
                                                    onMouseLeave={() => setPreviewImage(null)}
                                                    onClick={() => setPreviewImage(url)} // For mobile/touch
                                                />
                                            </td>
                                            <td className="p-4 font-medium text-white">{name}</td>
                                            <td className="p-4 hidden md:table-cell">
                                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate block max-w-xs">
                                                    {url}
                                                </a>
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setImageToReplace(img);
                                                        setShowReplaceModal(true);
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                >
                                                    Replace
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(img.key)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {images.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-8 text-center text-gray-500">
                                            No images found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )
            }

            {/* Fullscreen Image Overlay */}
            {
                previewImage && (
                    <div
                        className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                    // On desktop we might want to let clicks pass through if just hovering, but typically an overlay blocks. 
                    // However, legacy was a hover effect. 
                    // Let's make it fixed centered on top of everything.
                    >
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-h-[90vh] max-w-[90vw] shadow-2xl rounded-lg border-2 border-white/20"
                        />
                    </div>
                )
            }

            {/* Upload Modal */}
            {
                showUploadModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Upload Images</h3>
                            <form onSubmit={handleUpload}>
                                <div className="mb-4">
                                    <label className="block text-gray-400 mb-2">Select Files</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setUploadFiles(e.target.files)}
                                        className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!uploadFiles}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Replace Modal */}
            {
                showReplaceModal && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Replace Image</h3>
                            <p className="text-gray-400 mb-4 text-sm">Replacing: <span className="text-white font-mono">{imageToReplace?.key.replace('images/', '')}</span></p>
                            <form onSubmit={handleReplace}>
                                <div className="mb-4">
                                    <label className="block text-gray-400 mb-2">Select New File</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setReplaceFile(e.target.files[0])}
                                        className="w-full bg-gray-900 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowReplaceModal(false);
                                            setImageToReplace(null);
                                        }}
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!replaceFile}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Confirm Replace
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ImageManager;
