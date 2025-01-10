import React, { useState, useEffect } from 'react';
import { Upload, File, Loader2, AlertCircle, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Contract {
    id: number;
    name: string;
    uploaded_by: string;
    uploaded_at: string;
    size: string;
    url: string;
    contract_file: string;
}
import { useGlobalContext } from '@/context/GlobalContext';

const ContractUpload = () => {
    const { selectedSoftware } = useGlobalContext();
    const [uploading, setUploading] = useState(false);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [error, setError] = useState('');

    const fetchContracts = async () => {
        if (!selectedSoftware?.id) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/contracts/${selectedSoftware.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Add appropriate auth token
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch contracts');
            }

            const data: Contract[] = await response.json();
            setContracts(data);
        } 
        catch (err) {
            console.error(err)
        }
    };

    useEffect(() => {
        fetchContracts();
    }, [selectedSoftware?.id]);

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
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/software/${selectedSoftware?.id}/contracts`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();

            const newContract: Contract = {
                id: data.id,
                name: file.name,
                uploaded_by: 'Current User',
                uploaded_at: new Date().toISOString(),
                size: `${(file.size / 1024).toFixed(2)} KB`,
                url: data.url,
            };

            setContracts([newContract, ...contracts]);
        } 
        catch (err) {
            setError('Failed to upload file. Please try again.');
        } 
        finally {
            setUploading(false);
            e.target.value = '';
            fetchContracts();
        }
    };

    const handleDelete = async (contractId: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/contracts/${contractId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            );
    
            if (!response.ok) {
                throw new Error('Failed to delete the contract');
            }

            setContracts(contracts.filter(contract => contract.id !== contractId));
        } 
        catch (err) {
            console.error(err);
            setError('Failed to delete file. Please try again.');
        }
    };

    return (
        <div className="w-full max-w-2xl space-y-4">
            <Card className='mt-4'>
                <CardHeader>
                    <CardTitle className='text-sm'>Contract Documents</CardTitle>
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
                                        <p className="text-xs text-gray-500">Click to upload contract PDF</p>
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
                                            href={`${process.env.NEXT_PUBLIC_API_MEDIA_URL}${contract.contract_file}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-sm hover:text-blue-500"
                                        >
                                            {contract.name}
                                        </a>
                                        <p className="text-xs text-gray-500">
                                            Uploaded by {contract.uploaded_by} • {new Date(contract.uploaded_at).toLocaleString()} • {contract.size}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <a
                                            href={contract.url}
                                            download
                                            className="p-2 hover:bg-gray-100 rounded-full"
                                        >
                                            <Download className="h-5 w-5 text-gray-500" />
                                        </a>
                                        <AlertDialog>
                                            <AlertDialogTrigger>
                                                <div className="p-2 hover:bg-gray-100 rounded-full">
                                                    <Trash2 className="h-5 w-5 text-red-500" />
                                                </div>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete {contract.name}? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(contract.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
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