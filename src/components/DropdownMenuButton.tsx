"use client"

import { useState, useRef } from "react"
import { Download, Upload, Settings, FileUp, X, Plus, FileDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGlobalContext } from "@/context/GlobalContext"

export default function DropdownMenuButton() {
    const { 
        software, 
        generateCSV, 
        downloadCSV, 
        handleAddSoftware,
    } = useGlobalContext()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExportAll = () => {
        const csv = generateCSV(software);
        downloadCSV(csv, 'all_software.csv');
    }

    const handleUploadSheet = () => {
        setIsDialogOpen(true)
    }

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setIsDragging(false)
        const droppedFile = event.dataTransfer.files[0]
        if (droppedFile && (droppedFile.type === "text/csv" || droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || droppedFile.type === "application/vnd.ms-excel")) {
            setFile(droppedFile)
        } else {
            alert("Please upload a CSV or Excel file.")
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (file) {
            console.log("File uploaded:", file.name)
            // Add your file upload logic here
        }
        setIsDialogOpen(false)
        setFile(null)
    }

    const removeFile = () => {
        setFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setFile(null);
    }

    return (
        <>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-0">
                    <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 h-auto font-normal" 
                        onClick={handleAddSoftware}
                    >
                        <Plus className="mr-2 h-4 w-4" /> 
                        <span>Add Software</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 h-auto font-normal"
                        onClick={handleExportAll}
                    >
                        <FileDown className="mr-2 h-4 w-4" />
                        <span>Download Report</span>
                    </Button>
                    {/* <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 h-auto font-normal"
                        onClick={handleUploadSheet}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        <span>Upload Sheet</span>
                    </Button> */}
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Upload Sheet</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div
                            className={`grid w-full max-w-sm items-center gap-1.5 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragging ? "border-primary" : "border-muted-foreground"
                                }`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {file ? (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">{file.name}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFile()
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        Drag and drop your file here, or click to select
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!file}>
                                <FileUp className="mr-2 h-4 w-4" />
                                Upload
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}