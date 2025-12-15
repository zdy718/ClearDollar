import { ChangeEvent, useState, useEffect } from 'react';


type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
export function FileUploader() {

    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<UploadStatus>('idle');


    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    }

    async function handleFileUpload() {
        if (!file) return;

        setStatus("uploading");

        // Adjust the URL or the form field name ("file") if your controller expects different values.

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch('/transactions/upload?userId=demo-user', {
            method: "POST",
            body: formData,
            // Do NOT set Content-Type when sending FormData; the browser will set the multipart boundary for you.
            credentials: "same-origin" // include if your API uses cookies/antiforgery; remove if not needed
        });

        if (response.ok) {
            setStatus("success");

            // Close window after short delay so user sees success message
            //setTimeout(() => {
            //    setIsOpen(false);
            //    setFile(null);
            //    setStatus('idle')
            //}, 900);
        } else {
            const text = await response.text().catch(() => '');
            console.error(`Upload failed (${response.status}):`, text);
            setStatus("error");
        }
       
    }

    return (
        <>
            {/* Trigger button */}
            <button
                onClick={() => setIsOpen(true)}
                className="px-3 py-1.5 border rounded-lg hover:bg-gray-50"
            >
                Import CSV
            </button>

            {/* Modal */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    aria-modal="true"
                    role="dialog"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal content */}
                    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Upload Transactions CSV</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                X
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input type="file" accept=".csv" onChange={handleFileChange} />

                            {file && (
                                <div className="text-sm">
                                    <p>File name: {file.name}</p>
                                    <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                                    <p>Type: {file.type || 'n/a'}</p>
                                </div>
                            )}

                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setFile(null);
                                        setStatus('idle');
                                    }}
                                    className="px-3 py-1.5 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleFileUpload}
                                    disabled={!file || status === 'uploading'}
                                    className="px-3 py-1.5 border rounded-lg bg-blue-600 text-white disabled:opacity-50"
                                >
                                    {status === 'uploading' ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>

                            {status === 'success' && (
                                <p className="text-sm text-green-600">File uploaded successfully!</p>
                            )}
                            {status === 'error' && (
                                <p className="text-sm text-red-600">Upload failed. Check console for details.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}