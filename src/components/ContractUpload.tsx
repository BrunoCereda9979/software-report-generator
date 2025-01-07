import React, { useState } from 'react';
import { Upload, File, Loader2, AlertCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGlobalContext } from "@/context/GlobalContext";

const ContractUpload = () => {
    const { selectedSoftware, currentUser } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [contracts, setContracts] = useState([]);
    const [error, setError] = useState('');

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setError('');

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file only');
            return;
        }

        setUploading(true);

        try {
            console.log('Uploading file...')
            const softwareId = selectedSoftware?.id;

            const formData = new FormData();
            formData.append('contract_file', file);
            formData.append('name', file.name);
            formData.append('user_id', currentUser.user_id.toString());
            formData.append('uploaded_at', new Date().toISOString());
            formData.append('size', file.size.toString());

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software/${softwareId}/contract`, {
                method: 'POST',
                body: formData,
            });
            console.log('CONTRACT POST RESPONSE:', response)
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();

            const newContract = {
                id: Date.now(),
                name: file.name,
                user_id: currentUser?.user_id,
                uploadedAt: new Date().toISOString(),
                size: (file.size / 1024).toFixed(2) + ' KB',
                url: data.contract_url, // Use URL returned by the server
            };

            setContracts([newContract, ...contracts]);
        }
        catch (err) {
            setError('Failed to upload file. Please try again.');
        }
        finally {
            setUploading(false);
        }
    };


    return (
        <div className="w-full max-w-2xl space-y-4">
            <Card className='mt-5'>
                <CardHeader>
                    <CardTitle className='font-medium text-sm'>Contract Documents</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {uploading ? (
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 mb-2 text-gray-500" />
                                        <p className="text-sm text-gray-500">Click to upload contract PDF</p>
                                    </>
                                )}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf,application/pdf"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>

                        <div className="space-y-2">
                            {contracts.map(contract => (
                                <div key={contract.id} className="flex items-center p-3 border rounded-lg">
                                    <File className="h-5 w-5 text-blue-500 mr-3" />
                                    <div className="flex-1">
                                        <a
                                            href={contract.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-bold text-sm hover:text-blue-500"
                                        >
                                            {contract.name}
                                        </a>
                                        <p className="text-sm text-gray-500">
                                            Uploaded by {contract.uploadedBy} • {new Date(contract.uploadedAt).toLocaleString()} • {contract.size}
                                        </p>
                                    </div>
                                    <a
                                        href={contract.url}
                                        download
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <Download className="h-5 w-5 text-gray-500" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContractUpload;