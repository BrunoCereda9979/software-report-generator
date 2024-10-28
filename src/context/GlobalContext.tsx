"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Item, ContactPerson, Software, Comment } from '@/types/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface GlobalState {
    software: Software[];
    comments: Comment[];
    divisions: Item[];
    departments: Item[];
    softwareToOperate: Item[];
    hardwareToOperate: Item[];
    vendors: Item[];
    contacts: ContactPerson[];
    glAccounts: Item[];
    loading: boolean;
    isDialogOpen: boolean;
    dialogMode: 'add' | 'edit';
    selectedSoftware: Software | undefined;
    editingSoftware: Software | undefined;
    filteredSoftwareList: Software[];
    setFilteredSoftwareList: (data: Software[]) => void;
    setSelectedSoftware: React.Dispatch<React.SetStateAction<Software | undefined>>;
    setEditingSoftware: React.Dispatch<React.SetStateAction<Software | undefined>>;
    setSoftware: React.Dispatch<React.SetStateAction<Software[]>>;
    setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
    deleteComment: (id: number) => void;
    setIsDialogOpen: (isOpen: boolean) => void;
    handleAddSoftware: () => void;
    handleEditSoftware: (software: Software) => void;
    handleSaveSoftware: (software: Software) => Promise<Response>;
    updateSoftware: (newSoftwareList: Software[]) => void;
    generateCSV: (data: any[]) => string;
    downloadCSV: (csv: string, filename: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [software, setSoftware] = useState<Software[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [divisions, setDivisions] = useState<Item[]>([]);
    const [departments, setDepartments] = useState<Item[]>([]);
    const [softwareToOperate, setSoftwareToOperate] = useState<Item[]>([]);
    const [hardwareToOperate, setHardwareToOperate] = useState<Item[]>([]);
    const [vendors, setVendors] = useState<Item[]>([]);
    const [contacts, setContacts] = useState<ContactPerson[]>([]);
    const [glAccounts, setGlAccounts] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedSoftware, setSelectedSoftware] = useState<Software | undefined>(undefined);
    const [editingSoftware, setEditingSoftware] = useState<Software | undefined>(undefined);
    const [filteredSoftwareList, setFilteredSoftwareList] = useState<Software[]>([]);

    const deleteComment = (commentId: number) => {
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    fetchedSoftware,
                    fetchedComments,
                    fetchedDivisions,
                    fetchedDepartments,
                    fetchedSoftwareToOperate,
                    fetchedHardwareToOperate,
                    fetchedVendors,
                    fetchedContacts,
                    fetchedGlAccounts
                ] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/comments`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/divisions`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/departments`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software-to-operate`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/hardware-to-operate`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vendors`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-people`).then((res) => res.json()),
                    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gl-accounts`).then((res) => res.json()),
                ]);

                setSoftware(fetchedSoftware);
                setComments(fetchedComments);
                setDivisions(fetchedDivisions);
                setDepartments(fetchedDepartments);
                setSoftwareToOperate(fetchedSoftwareToOperate);
                setHardwareToOperate(fetchedHardwareToOperate);
                setVendors(fetchedVendors);
                setContacts(fetchedContacts);
                setGlAccounts(fetchedGlAccounts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddSoftware = () => {
        setDialogMode('add');
        setEditingSoftware(undefined);
        setIsDialogOpen(true);
    };

    const handleEditSoftware = (softwareToEdit: Software) => {
        setDialogMode('edit');
        setEditingSoftware(softwareToEdit);
        setIsDialogOpen(true);
    };

    const handleSaveSoftware = async (softwareToSave: Software) => {
        try {
            let response;
            if (dialogMode === 'add') {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(softwareToSave),
                });

                if (!response.ok) throw new Error('Failed to add software');

                const newSoftware = await response.json();
                setSoftware(prevSoftware => [...prevSoftware, newSoftware]);
            }
            else {
                response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/software/${softwareToSave.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(softwareToSave),
                });

                if (!response.ok) throw new Error('Failed to update software');

                const updatedSoftware = await response.json();
                setSoftware(prevSoftware => prevSoftware.map(s => s.id === updatedSoftware.id ? updatedSoftware : s));
                toast.success('Software updated successfully!');
            }

            setIsDialogOpen(false);
            return response; // Return the response object
        }
        catch (error) {
            console.error('Error saving software:', error);
            throw error;
        }
    };


    const updateSoftware = (newSoftwareList: Software[]) => {
        setSoftware(newSoftwareList);
    };

    // CSV and EXCEL FILE GENERATION
    const generateCSV = (data: any[]) => {
        const headers = [
            'id',
            'software_name',
            'software_description',
            'software_version',
            'software_department',
            'software_divisions_using',
            'software_department_contact_people',
            'software_vendor',
            'software_years_of_use',
            'software_last_updated',
            'software_expiration_date',
            'software_is_hosted',
            'software_is_tech_supported',
            'software_is_cloud_based',
            'software_maintenance_support',
            'software_number_of_licenses',
            'software_to_operate',
            'hardware_to_operate',
            'software_gl_accounts',
            'software_operational_status',
            'software_annual_amount',
            'software_comments',
        ];

        let csv = headers.join(',') + '\n';

        data.forEach(item => {
            let row = headers.map(header => {
                let value = item[header];

                if (header === 'software_department') {
                    value = value.map((department: Item) => department.name).join('; ');
                } else if (header === 'software_vendor') {
                    value = value.map((vendor: Item) => vendor.name).join('; ');
                } else if (header === 'software_department_contact_people') {
                    value = value.map((contact: ContactPerson) =>
                        `${contact.contact_name} ${contact.contact_lastname} (${contact.contact_email})`
                    ).join('; ');
                } else if (header === 'software_divisions_using') {
                    value = value.map((division: Item) => division.name).join('; ');
                } else if (header === 'software_to_operate') {
                    value = value.map((software: Item) => software.name).join('; ');
                } else if (header === 'hardware_to_operate') {
                    value = value.map((hardware: Item) => hardware.name).join('; ');
                } else if (header === 'software_gl_accounts') {
                    value = value.map((account: Item) => account.name).join('; ');
                } else if (header === 'software_last_updated' || header === 'software_expiration_date') {
                    value = format(new Date(value), 'yyyy-MM-dd');
                }

                return `"${value !== undefined ? value : ''}"`;
            }).join(',');

            csv += row + '\n';
        });

        return csv;
    };

    const downloadCSV = (csv: string, filename: string) => {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <GlobalContext.Provider value={{
            software,
            comments,
            divisions,
            departments,
            softwareToOperate,
            hardwareToOperate,
            vendors,
            contacts,
            glAccounts,
            loading,
            isDialogOpen,
            dialogMode,
            selectedSoftware,
            editingSoftware,
            filteredSoftwareList,
            setFilteredSoftwareList,
            setSoftware,
            setComments,
            setSelectedSoftware,
            setIsDialogOpen,
            setEditingSoftware,
            deleteComment,
            handleAddSoftware,
            handleEditSoftware,
            handleSaveSoftware,
            updateSoftware,
            generateCSV,
            downloadCSV,
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};
